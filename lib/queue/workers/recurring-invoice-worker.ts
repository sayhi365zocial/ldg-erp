import { Worker } from 'bullmq'
import { connection } from '../connection'
import { RecurringInvoiceJob, scheduleRecurringInvoice } from '../invoice-queue'
import { prisma } from '@/lib/prisma'
import { addMonths, addWeeks, addYears } from 'date-fns'

export const recurringInvoiceWorker = new Worker<RecurringInvoiceJob>(
  'recurring-invoices',
  async (job) => {
    const { invoiceId } = job.data

    // Fetch parent invoice
    const parentInvoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        items: true,
        company: true,
        project: true,
      },
    })

    if (!parentInvoice) {
      throw new Error(`Invoice ${invoiceId} not found`)
    }

    if (!parentInvoice.isRecurring) {
      throw new Error(`Invoice ${invoiceId} is not a recurring invoice`)
    }

    // Check if we should still generate invoices
    if (parentInvoice.recurringEndDate && new Date() > parentInvoice.recurringEndDate) {
      console.log(`Recurring invoice ${invoiceId} has ended`)
      return { skipped: true, reason: 'ended' }
    }

    // Generate next invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { createdAt: 'desc' },
    })
    const lastNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split('-')[1]) : 0
    const newInvoiceNumber = `INV-${String(lastNumber + 1).padStart(6, '0')}`

    // Calculate next due date based on interval
    let nextDueDate = new Date()
    let nextGenerateDate = new Date()

    switch (parentInvoice.recurringInterval) {
      case 'WEEKLY':
        nextDueDate = addWeeks(new Date(), 1)
        nextGenerateDate = addWeeks(new Date(), 1)
        break
      case 'MONTHLY':
        nextDueDate = addMonths(new Date(), 1)
        nextGenerateDate = addMonths(new Date(), 1)
        break
      case 'QUARTERLY':
        nextDueDate = addMonths(new Date(), 3)
        nextGenerateDate = addMonths(new Date(), 3)
        break
      case 'YEARLY':
        nextDueDate = addYears(new Date(), 1)
        nextGenerateDate = addYears(new Date(), 1)
        break
    }

    // Create new invoice
    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber: newInvoiceNumber,
        type: 'RECURRING',
        status: 'DRAFT',
        isRecurring: true,
        recurringInterval: parentInvoice.recurringInterval,
        recurringStartDate: parentInvoice.recurringStartDate,
        recurringEndDate: parentInvoice.recurringEndDate,
        parentInvoiceId: parentInvoice.id,
        issueDate: new Date(),
        dueDate: nextDueDate,
        nextInvoiceDate: nextGenerateDate,
        subtotal: parentInvoice.subtotal,
        taxRate: parentInvoice.taxRate,
        taxAmount: parentInvoice.taxAmount,
        discountAmount: parentInvoice.discountAmount,
        totalAmount: parentInvoice.totalAmount,
        notes: parentInvoice.notes,
        terms: parentInvoice.terms,
        companyId: parentInvoice.companyId,
        projectId: parentInvoice.projectId,
        createdById: parentInvoice.createdById,
        items: {
          create: parentInvoice.items.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            sortOrder: index,
          })),
        },
      },
    })

    // Update parent invoice next date
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        nextInvoiceDate: nextGenerateDate,
      },
    })

    // Schedule next recurring invoice
    await scheduleRecurringInvoice(
      { invoiceId, companyId: parentInvoice.companyId },
      nextGenerateDate
    )

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'INVOICE_CREATED',
        title: `Recurring invoice generated`,
        description: `Generated invoice ${newInvoiceNumber} from recurring template`,
        userId: parentInvoice.createdById,
        invoiceId: newInvoice.id,
      },
    })

    return { success: true, newInvoiceId: newInvoice.id }
  },
  {
    connection,
    concurrency: 5,
  }
)

recurringInvoiceWorker.on('completed', (job) => {
  console.log(`Recurring invoice job ${job.id} completed`)
})

recurringInvoiceWorker.on('failed', (job, err) => {
  console.error(`Recurring invoice job ${job?.id} failed:`, err)
})

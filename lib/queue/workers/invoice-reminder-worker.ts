import { Worker } from 'bullmq'
import { connection } from '../connection'
import { InvoiceReminderJob } from '../invoice-queue'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email/send'
import InvoiceReminderEmail from '@/lib/email/templates/invoice-reminder'
import { formatCurrency, formatDate } from '@/lib/utils'

export const invoiceReminderWorker = new Worker<InvoiceReminderJob>(
  'invoice-reminders',
  async (job) => {
    const { invoiceId } = job.data

    // Fetch invoice with company details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        company: true,
      },
    })

    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`)
    }

    // Check if invoice is already paid
    if (invoice.status === 'PAID') {
      console.log(`Invoice ${invoice.invoiceNumber} is already paid, skipping reminder`)
      return { skipped: true, reason: 'already_paid' }
    }

    // Send reminder email
    const emailResult = await sendEmail({
      to: invoice.company.email || '',
      subject: `Payment Reminder - Invoice ${invoice.invoiceNumber}`,
      react: InvoiceReminderEmail({
        companyName: invoice.company.name,
        invoiceNumber: invoice.invoiceNumber,
        amount: formatCurrency(invoice.totalAmount),
        dueDate: formatDate(invoice.dueDate),
        invoiceUrl: `${process.env.NEXTAUTH_URL}/invoices/${invoice.id}`,
      }),
    })

    if (!emailResult.success) {
      throw new Error('Failed to send reminder email')
    }

    // Update invoice reminder status
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        reminderSent: true,
        reminderSentAt: new Date(),
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'INVOICE_SENT',
        title: `Invoice reminder sent`,
        description: `Reminder sent for invoice ${invoice.invoiceNumber}`,
        userId: invoice.createdById,
        invoiceId: invoice.id,
      },
    })

    return { success: true, emailResult }
  },
  {
    connection,
    concurrency: 5,
  }
)

invoiceReminderWorker.on('completed', (job) => {
  console.log(`Invoice reminder job ${job.id} completed`)
})

invoiceReminderWorker.on('failed', (job, err) => {
  console.error(`Invoice reminder job ${job?.id} failed:`, err)
})

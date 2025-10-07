import { Queue } from 'bullmq'
import { connection } from './connection'

export interface InvoiceReminderJob {
  invoiceId: string
  companyId: string
  dueDate: Date
}

export interface RecurringInvoiceJob {
  invoiceId: string
  companyId: string
}

// Queue for invoice reminders
export const invoiceReminderQueue = new Queue<InvoiceReminderJob>('invoice-reminders', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
})

// Queue for recurring invoice generation
export const recurringInvoiceQueue = new Queue<RecurringInvoiceJob>('recurring-invoices', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
})

// Helper function to schedule invoice reminder
export async function scheduleInvoiceReminder(data: InvoiceReminderJob, sendDate: Date) {
  return invoiceReminderQueue.add(
    'send-reminder',
    data,
    {
      delay: sendDate.getTime() - Date.now(),
    }
  )
}

// Helper function to schedule recurring invoice
export async function scheduleRecurringInvoice(data: RecurringInvoiceJob, generateDate: Date) {
  return recurringInvoiceQueue.add(
    'generate-invoice',
    data,
    {
      delay: generateDate.getTime() - Date.now(),
    }
  )
}

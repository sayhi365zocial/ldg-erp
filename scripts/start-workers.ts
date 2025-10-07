// Run this script to start background workers
// Usage: tsx scripts/start-workers.ts

import '../lib/queue/workers/invoice-reminder-worker'
import '../lib/queue/workers/recurring-invoice-worker'

console.log('🚀 Background workers started')
console.log('📧 Invoice reminder worker is running')
console.log('🔄 Recurring invoice worker is running')
console.log('Press Ctrl+C to stop')

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down workers...')
  process.exit(0)
})

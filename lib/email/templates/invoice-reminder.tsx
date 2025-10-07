import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface InvoiceReminderEmailProps {
  companyName: string
  invoiceNumber: string
  amount: string
  dueDate: string
  invoiceUrl: string
}

export const InvoiceReminderEmail = ({
  companyName,
  invoiceNumber,
  amount,
  dueDate,
  invoiceUrl,
}: InvoiceReminderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Invoice {invoiceNumber} Payment Reminder</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Reminder</Heading>
          <Text style={text}>Dear {companyName},</Text>
          <Text style={text}>
            This is a friendly reminder that invoice <strong>{invoiceNumber}</strong> is due on{' '}
            <strong>{dueDate}</strong>.
          </Text>
          <Section style={invoiceDetails}>
            <Text style={detailText}>
              <strong>Invoice Number:</strong> {invoiceNumber}
            </Text>
            <Text style={detailText}>
              <strong>Amount Due:</strong> {amount}
            </Text>
            <Text style={detailText}>
              <strong>Due Date:</strong> {dueDate}
            </Text>
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href={invoiceUrl}>
              View Invoice
            </Button>
          </Section>
          <Text style={footer}>
            If you have already made this payment, please disregard this notice.
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            LDG Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#0000FF',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
}

const text = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
}

const invoiceDetails = {
  backgroundColor: '#f4f4f5',
  borderRadius: '4px',
  margin: '24px 48px',
  padding: '24px',
}

const detailText = {
  color: '#525252',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const buttonContainer = {
  padding: '0 48px',
}

const button = {
  backgroundColor: '#0000FF',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
}

export default InvoiceReminderEmail

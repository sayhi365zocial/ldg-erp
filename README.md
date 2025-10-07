# LDG ERP - Digital Firm Management System

Comprehensive ERP system for managing digital marketing, web development, hosting, events, and printing services.

## 🚀 Features

### Core Modules
- **CRM & Contact Management**: Track companies, contacts, and their relationships
- **Sales Pipeline**: Manage deals from lead to won/lost
- **Project Management**: Handle multiple service types (Digital Marketing, Website, Hosting, Events, Printing)
- **Invoicing System**:
  - One-time and recurring invoices
  - Automated reminders
  - Payment tracking
- **Activity Logging**: Complete audit trail of all interactions

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Email**: Resend + React Email
- **Background Jobs**: BullMQ + Redis

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/sayhi365zocial/ldg-erp.git
cd ldg-erp
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ldg_erp"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"
REDIS_URL="redis://localhost:6379"
```

4. **Setup database**
```bash
# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

5. **Generate Prisma Client**
```bash
npm run db:generate
```

## 🚦 Running the Application

### Development Mode

1. **Start the Next.js dev server**
```bash
npm run dev
```

2. **Start background workers** (in a separate terminal)
```bash
npx tsx scripts/start-workers.ts
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Mode

```bash
npm run build
npm start
```

## 📊 Database Schema

### Key Models
- **User**: System users with role-based access
- **Company**: Client companies
- **ContactPerson**: Contact persons with company relationships
- **ContactHistory**: Track when contacts move between companies
- **Deal**: Sales pipeline management
- **Project**: Service delivery tracking
- **Invoice**: Billing and invoicing
- **Activity**: Complete activity log

## 🎨 Brand Colors

- **Primary Blue**: #0000FF
- **Blue Secondary**: #003DF6
- **Navy**: #0F0034
- **Grey**: #E9E9E9
- **White**: #FFFFFF

## 📧 Email System

Automated emails for:
- Invoice reminders (sent before due date)
- Recurring invoice generation notifications
- Deal updates
- Project status changes

## 🔄 Background Jobs

### Invoice Reminders
Automatically sends email reminders for unpaid invoices before due date.

### Recurring Invoices
Automatically generates invoices based on recurring schedules:
- Weekly
- Monthly
- Quarterly
- Yearly

## 🗄️ Database Management

```bash
# Open Prisma Studio
npm run db:studio

# Create a new migration
npm run db:migrate

# Reset database
npx prisma migrate reset
```

## 🔐 Authentication

Default login credentials (create via Prisma Studio):
- Email: admin@ldg.com
- Password: (hash with bcrypt)

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations

## 🏗️ Project Structure

```
ldg-erp/
├── app/
│   ├── (auth)/          # Auth pages (login)
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── api/             # API routes
│   └── layout.tsx       # Root layout
├── components/
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   ├── utils.ts         # Utility functions
│   ├── email/           # Email templates and sender
│   └── queue/           # BullMQ queues and workers
├── prisma/
│   └── schema.prisma    # Database schema
├── scripts/
│   └── start-workers.ts # Background worker starter
└── types/               # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

Private - All rights reserved

## 🆘 Support

For support, email support@ldg.com or open an issue in the repository.

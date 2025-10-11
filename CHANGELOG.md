# Changelog

All notable changes to LDG ERP project will be documented in this file.

## [0.1.0] - 2025-10-07

### 🎉 Initial Setup

**Core Framework**
- ✅ Next.js 14 (App Router) with TypeScript
- ✅ Tailwind CSS with custom brand colors
- ✅ ESLint configuration

**Tech Stack**

### Frontend
- **Framework**: Next.js 14.2.18 (React 18.3.1)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui (Radix UI primitives)
  - Button, Card, Input, Label, Badge, Table
  - Dialog, Dropdown Menu, Select, Tabs, Popover, Toast
- **Icons**: Lucide React 0.454.0
- **Charts**: Recharts 2.12.7
- **Utilities**:
  - clsx 2.1.1
  - tailwind-merge 2.5.4
  - class-variance-authority 0.7.0
  - date-fns 3.6.0

### Backend
- **API**: Next.js API Routes & Server Actions
- **ORM**: Prisma 5.22.0
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: NextAuth.js 4.24.10
- **Password Hashing**: bcryptjs 2.4.3
- **Validation**: Zod 3.23.8

### Email System
- **Provider**: Resend 4.0.1
- **Templates**: @react-email/components 0.0.25
- **Email Builder**: react-email 3.0.1

### Background Jobs
- **Queue**: BullMQ 5.15.0
- **Redis Client**: ioredis 5.4.1
- **Provider**: Upstash Redis

### Database Schema
Comprehensive schema with:
- **User Management**: Role-based access control (ADMIN, MANAGER, SALES, FINANCE, USER)
- **CRM**: Companies, Contact Persons, Contact History
- **Sales Pipeline**: Deals with stages (LEAD → QUALIFIED → PROPOSAL → NEGOTIATION → WON/LOST)
- **Project Management**:
  - Project types: Digital Marketing, Website Development, Hosting, Events, Printing
  - Service items tracking
- **Invoicing System**:
  - One-time and recurring invoices
  - Multiple recurring intervals (Weekly, Monthly, Quarterly, Yearly)
  - Invoice status tracking (DRAFT → SENT → VIEWED → PAID → OVERDUE)
  - Automated reminders
- **Activity Logging**: Complete audit trail for all interactions

### Brand Identity
- **Primary Blue**: #0000FF (Majorelle Blue)
- **Blue Secondary**: #003DF6
- **Navy**: #0F0034
- **Grey**: #E9E9E9
- **White**: #FFFFFF
- **Fonts**: Gotham (EN), IBM Plex Sans Thai (TH)

### Features Implemented

**Authentication**
- NextAuth.js with credentials provider
- JWT session strategy
- Protected dashboard routes
- Login page with branded design

**Dashboard Structure**
- Layout with sidebar navigation
- Dashboard overview with key metrics:
  - Total Companies
  - Open Deals
  - Active Projects
  - Outstanding Invoices

**Email System**
- Invoice reminder email template
- Resend email service integration
- Branded email design matching company identity

**Background Job System**
- Invoice reminder worker (automated email reminders before due date)
- Recurring invoice worker (automatic invoice generation)
- BullMQ queue management
- Redis-based job persistence
- Error handling and retry logic

**Developer Experience**
- Comprehensive README with setup instructions
- Environment variable examples
- Database scripts (migrate, push, studio, generate)
- TypeScript definitions for NextAuth
- Utility functions (currency formatting, date formatting)
- Worker startup script

### Project Structure
```
ldg-erp/
├── app/
│   ├── (auth)/login/          # Authentication pages
│   ├── (dashboard)/           # Protected dashboard pages
│   ├── api/auth/              # NextAuth API routes
│   ├── globals.css            # Global styles with CSS variables
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/ui/             # shadcn/ui components
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── prisma.ts              # Prisma client singleton
│   ├── utils.ts               # Utility functions
│   ├── email/
│   │   ├── send.ts            # Email sending service
│   │   └── templates/         # React email templates
│   └── queue/
│       ├── connection.ts      # Redis connection
│       ├── invoice-queue.ts   # Invoice job queues
│       └── workers/           # Background job workers
├── prisma/
│   └── schema.prisma          # Complete database schema
├── scripts/
│   └── start-workers.ts       # Worker process starter
└── types/
    └── next-auth.d.ts         # TypeScript definitions
```

### Configuration Files
- `next.config.js`: Next.js configuration with server actions
- `tailwind.config.ts`: Custom theme with brand colors
- `tsconfig.json`: TypeScript configuration with path aliases
- `prisma/schema.prisma`: Complete database schema
- `.env.example`: Environment variable template

### External Services
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Redis**: Upstash Redis
- **Authentication**: NextAuth.js

### Scripts Available
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run database migrations
```

### Next Steps
- [ ] Setup .env file with credentials
- [ ] Push Prisma schema to Supabase
- [ ] Create admin user
- [ ] Build CRUD interfaces for Companies
- [ ] Build CRUD interfaces for Contacts
- [ ] Build Sales Pipeline board
- [ ] Build Project management interface
- [ ] Build Invoice creation and management
- [ ] Implement dashboard analytics
- [ ] Setup background worker in production
- [ ] Deploy to production

## [0.2.0] - 2025-10-11

### ✨ New Features

**Task Management System**
- ✅ Complete task/to-do list management for team members
- ✅ Task fields: title, description, status, priority, due date, attachments, notes
- ✅ Task relations: assigned user, related company, related contact person
- ✅ Task statuses: PENDING, DOING, DONE with automatic completion timestamps
- ✅ Priority levels: LOW, MEDIUM, HIGH, URGENT
- ✅ File attachment support (up to 10MB per task)

**Task Views**
- ✅ Kanban board view with drag-and-drop functionality
  - Three columns: Pending, Doing, Done
  - Color-coded priority badges
  - User avatars and company information
  - Due date display with overdue warnings
  - Optimistic UI updates for instant feedback
- ✅ List/Table view with status tabs
  - Separate tabs for Pending, Doing, and Done tasks
  - Sortable columns
  - Quick actions (View, Edit, Delete)
- ✅ View toggle between Board and List modes
- ✅ Quick view modal for fast task preview
  - Essential task information at a glance
  - Links to related company and contact
  - Action buttons for full details and editing

**Task Management Pages**
- ✅ `/dashboard/tasks` - User's personal tasks
- ✅ `/dashboard/tasks/admin` - Admin view showing all team tasks
  - Statistics: total tasks, completed, in progress, overdue
  - User breakdown with task counts per team member
  - Navigation between personal and admin views

**Company-Contact Integration**
- ✅ Smart contact filtering based on selected company
- ✅ Contacts only appear in dropdown after company selection
- ✅ Automatic contact reset when company changes
- ✅ Prevents invalid company-contact associations

**Calendar Integration**
- ✅ Tasks with due dates automatically appear in calendar
- ✅ CheckSquare icon to distinguish tasks from events
- ✅ Color-coded by status:
  - Yellow (PENDING)
  - Blue (DOING)
  - Green (DONE)
- ✅ Clickable task cards linking to task details
- ✅ Server-side task fetching for performance

**File Upload Enhancement**
- ✅ Extended upload system to support task attachments
- ✅ 10MB file size limit for task attachments
- ✅ Upload validation and error handling

**Contacts Management**
- ✅ Complete CRUD for contact persons
- ✅ Contact form with company association
- ✅ Contact list page at `/dashboard/contacts`
- ✅ Image upload support for contacts

**Companies Management**
- ✅ Complete CRUD for companies
- ✅ Company form with logo upload
- ✅ Company list page at `/dashboard/companies`

**Activities Tracking**
- ✅ Activity logging system
- ✅ Activity management page at `/dashboard/activities`
- ✅ File attachment support for activities

### 🎨 UI/UX Improvements

**Task Components**
- ✅ TaskForm: Comprehensive form with all task fields
- ✅ TasksTable: Organized table view with status tabs
- ✅ TasksKanban: Interactive drag-and-drop board
- ✅ TaskQuickViewModal: Quick preview without page navigation
- ✅ TaskCard: Compact card design with essential info

**Navigation**
- ✅ Tasks menu item added to sidebar with CheckSquare icon
- ✅ "View All Tasks" button for admins on personal tasks page
- ✅ "My Tasks" button on admin page to return to personal view
- ✅ Breadcrumb-style navigation between views

**Performance Optimizations**
- ✅ Optimistic UI updates for drag-and-drop operations
  - Immediate visual feedback
  - Backend sync with error rollback
  - Smooth user experience without loading states
- ✅ useMemo hooks for filtered contact lists
- ✅ Efficient React state management

### 🔧 Technical Updates

**Database Schema Updates**
- ✅ Added Task model with relations
- ✅ Added companyId to ContactPerson model
- ✅ Task-User relation (assignee)
- ✅ Task-Company relation (optional)
- ✅ Task-ContactPerson relation (optional)
- ✅ TaskStatus enum: PENDING, DOING, DONE
- ✅ Priority enum: LOW, MEDIUM, HIGH, URGENT

**API Routes**
- ✅ `/api/tasks` - Full CRUD for tasks
  - GET: Fetch tasks (filtered by user role)
  - POST: Create new task
  - PUT: Update task with optimistic support
  - DELETE: Remove task
- ✅ `/api/upload` - Enhanced for task attachments
- ✅ `/api/companies` - Company management
- ✅ `/api/contacts` - Contact management

**Dependencies Added**
- ✅ @dnd-kit/core: ^6.3.1 - Drag and drop core
- ✅ @dnd-kit/sortable: ^10.0.0 - Sortable components
- ✅ @dnd-kit/utilities: ^3.2.2 - Utility functions

**Component Architecture**
- ✅ Server/Client component separation for performance
- ✅ Server components for data fetching (calendar, tasks pages)
- ✅ Client components for interactivity (kanban, forms, modals)
- ✅ Modular component design for reusability

### 🐛 Bug Fixes
- ✅ Fixed Select component empty value error
- ✅ Fixed formatDate undefined reference in TaskCard
- ✅ Fixed contact filtering to prevent invalid associations
- ✅ Fixed slow drag-and-drop with optimistic updates

### 📝 Documentation
- ✅ Updated package.json version to 0.2.0
- ✅ Updated CHANGELOG with comprehensive feature list

### 🔐 Security & Permissions
- ✅ Role-based task visibility
  - Users see only their assigned tasks
  - Admins see all tasks across organization
- ✅ Task creation restricted to authenticated users
- ✅ Task updates restricted to task owner and admins

---

## [0.1.0] - 2025-10-07

### 🎉 Initial Setup

**Core Framework**
- ✅ Next.js 14 (App Router) with TypeScript
- ✅ Tailwind CSS with custom brand colors
- ✅ ESLint configuration

**Tech Stack**

### Frontend
- **Framework**: Next.js 14.2.18 (React 18.3.1)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui (Radix UI primitives)
  - Button, Card, Input, Label, Badge, Table
  - Dialog, Dropdown Menu, Select, Tabs, Popover, Toast
- **Icons**: Lucide React 0.454.0
- **Charts**: Recharts 2.12.7
- **Utilities**:
  - clsx 2.1.1
  - tailwind-merge 2.5.4
  - class-variance-authority 0.7.0
  - date-fns 3.6.0

### Backend
- **API**: Next.js API Routes & Server Actions
- **ORM**: Prisma 5.22.0
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: NextAuth.js 4.24.10
- **Password Hashing**: bcryptjs 2.4.3
- **Validation**: Zod 3.23.8

### Email System
- **Provider**: Resend 4.0.1
- **Templates**: @react-email/components 0.0.25
- **Email Builder**: react-email 3.0.1

### Background Jobs
- **Queue**: BullMQ 5.15.0
- **Redis Client**: ioredis 5.4.1
- **Provider**: Upstash Redis

### Database Schema
Comprehensive schema with:
- **User Management**: Role-based access control (ADMIN, MANAGER, SALES, FINANCE, USER)
- **CRM**: Companies, Contact Persons, Contact History
- **Sales Pipeline**: Deals with stages (LEAD → QUALIFIED → PROPOSAL → NEGOTIATION → WON/LOST)
- **Project Management**:
  - Project types: Digital Marketing, Website Development, Hosting, Events, Printing
  - Service items tracking
- **Invoicing System**:
  - One-time and recurring invoices
  - Multiple recurring intervals (Weekly, Monthly, Quarterly, Yearly)
  - Invoice status tracking (DRAFT → SENT → VIEWED → PAID → OVERDUE)
  - Automated reminders
- **Activity Logging**: Complete audit trail for all interactions

### Brand Identity
- **Primary Blue**: #0000FF (Majorelle Blue)
- **Blue Secondary**: #003DF6
- **Navy**: #0F0034
- **Grey**: #E9E9E9
- **White**: #FFFFFF
- **Fonts**: Gotham (EN), IBM Plex Sans Thai (TH)

### Features Implemented

**Authentication**
- NextAuth.js with credentials provider
- JWT session strategy
- Protected dashboard routes
- Login page with branded design

**Dashboard Structure**
- Layout with sidebar navigation
- Dashboard overview with key metrics:
  - Total Companies
  - Open Deals
  - Active Projects
  - Outstanding Invoices

**Email System**
- Invoice reminder email template
- Resend email service integration
- Branded email design matching company identity

**Background Job System**
- Invoice reminder worker (automated email reminders before due date)
- Recurring invoice worker (automatic invoice generation)
- BullMQ queue management
- Redis-based job persistence
- Error handling and retry logic

**Developer Experience**
- Comprehensive README with setup instructions
- Environment variable examples
- Database scripts (migrate, push, studio, generate)
- TypeScript definitions for NextAuth
- Utility functions (currency formatting, date formatting)
- Worker startup script

### Project Structure
```
ldg-erp/
├── app/
│   ├── (auth)/login/          # Authentication pages
│   ├── (dashboard)/           # Protected dashboard pages
│   ├── api/auth/              # NextAuth API routes
│   ├── globals.css            # Global styles with CSS variables
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/ui/             # shadcn/ui components
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── prisma.ts              # Prisma client singleton
│   ├── utils.ts               # Utility functions
│   ├── email/
│   │   ├── send.ts            # Email sending service
│   │   └── templates/         # React email templates
│   └── queue/
│       ├── connection.ts      # Redis connection
│       ├── invoice-queue.ts   # Invoice job queues
│       └── workers/           # Background job workers
├── prisma/
│   └── schema.prisma          # Complete database schema
├── scripts/
│   └── start-workers.ts       # Worker process starter
└── types/
    └── next-auth.d.ts         # TypeScript definitions
```

### Configuration Files
- `next.config.js`: Next.js configuration with server actions
- `tailwind.config.ts`: Custom theme with brand colors
- `tsconfig.json`: TypeScript configuration with path aliases
- `prisma/schema.prisma`: Complete database schema
- `.env.example`: Environment variable template

### External Services
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Redis**: Upstash Redis
- **Authentication**: NextAuth.js

### Scripts Available
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run database migrations
```

### Next Steps
- [ ] Setup .env file with credentials
- [ ] Push Prisma schema to Supabase
- [ ] Create admin user
- [ ] Build CRUD interfaces for Companies
- [ ] Build CRUD interfaces for Contacts
- [ ] Build Sales Pipeline board
- [ ] Build Project management interface
- [ ] Build Invoice creation and management
- [ ] Implement dashboard analytics
- [ ] Setup background worker in production
- [ ] Deploy to production

---

## Contributing
This is a private project. All changes should be documented in this changelog.

## Version Format
- **Major.Minor.Patch** (Semantic Versioning)
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

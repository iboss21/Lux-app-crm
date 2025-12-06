# EcoShine Pro - Luxury Cleaning Marketplace

Uber-style luxury cleaning marketplace with complete CRM, cleaner app, and customer portal.

## 🏗️ Architecture

### Three-Layer Application

```
┌─────────────────────────────────────────────┐
│  LAYER 1: PUBLIC WEBSITE                    │
│  /booking - Customer booking form           │
│  ⚠️ DO NOT TOUCH                            │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  LAYER 2: ADMIN CRM (/crm)                  │
│  - Manage bookings, customers, cleaners     │
│  - Assign jobs, track time, invoicing       │
│  - Analytics, settings, automations         │
│  👥 ROLES: Admin, Manager, CSR              │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  LAYER 3A: CLEANER APP (/cleaner)           │
│  - View assigned jobs                       │
│  - GPS clock in/out                         │
│  - Upload before/after photos               │
│  📱 MOBILE-FIRST, PWA-READY                 │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  LAYER 3B: CUSTOMER PORTAL (/portal)        │
│  - View booking history                     │
│  - Leave reviews                            │
│  - Manage payment methods                   │
└─────────────────────────────────────────────┘
```

## 🎨 Brand Identity

```css
PRIMARY:    #4a1e2b  /* Deep Burgundy - buttons, headers */
SECONDARY:  #8b5a6b  /* Rose - hover states */
ACCENT:     #c9a87c  /* Gold - highlights, badges */
BACKGROUND: #fef9fb  /* Soft Cream - page bg */
SUCCESS:    #2d5016  /* Dark Green - completed */
DANGER:     #8b2e3b  /* Dark Red - cancelled */
```

## 🔐 Role-Based Access Control

- **ADMIN**: Full system access
- **MANAGER**: Team management, reports
- **CSR**: Customer service, bookings
- **TECHNICIAN**: Job execution
- **CUSTOMER**: Portal access

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
├── app/
│   ├── crm/           # Admin CRM dashboard
│   ├── cleaner/       # Cleaner mobile app
│   ├── portal/        # Customer portal
│   ├── api/           # API routes
│   │   └── bookings/  # Booking endpoints
│   └── layout.tsx     # Root layout
├── components/
│   ├── crm/           # CRM components
│   ├── cleaner/       # Cleaner app components
│   ├── portal/        # Portal components
│   └── ui/            # Shared UI components
├── lib/
│   ├── auth/          # Authentication & RBAC
│   ├── db.ts          # Database connection
│   ├── schema.ts      # Drizzle ORM schema (70+ tables)
│   ├── env.ts         # Environment handling
│   └── utils.ts       # Utility functions
└── public/
    └── manifest.json  # PWA manifest
```

## 🗄️ Database

Uses **Drizzle ORM** with PostgreSQL (Supabase/Neon compatible).

### Core Tables
- `customers` - Customer records
- `bookings` - Service bookings (all form fields)
- `cleaners` - Cleaner profiles
- `regions` - Service regions
- `timeTracking` - GPS clock in/out
- `jobPhotos` - Before/after photos
- `invoices` - Billing
- `adminUsers` - Admin accounts

### Database Commands

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Auth**: JWT + bcrypt
- **Payments**: Stripe
- **Email**: Resend
- **SMS**: Twilio
- **Storage**: AWS S3
- **Maps**: Google Maps API

## 📱 PWA Support

The app is PWA-ready with:
- Web manifest
- Theme colors
- App icons
- Offline capability (future)

## 🔒 Environment Variables

See `.env.example` for all required variables:
- Database URL
- Stripe keys
- Twilio credentials
- Google Maps API
- AWS S3 configuration

## 📝 License

Copyright © 2024 EcoShine Pro. All rights reserved.


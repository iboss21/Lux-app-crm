# EcoShine Pro - Luxury Cleaning Marketplace

<p align="center">
  <img src="https://github.com/user-attachments/assets/251b25b0-29ca-422f-9bc7-9a2fe2e90915" alt="EcoShine Pro Home" width="800"/>
</p>

<p align="center">
  <strong>Uber-style luxury cleaning marketplace with complete CRM, cleaner app, and customer portal.</strong>
</p>

---

## 📋 Executive Summary

**EcoShine Pro** is a comprehensive, full-stack cleaning service management platform designed for luxury cleaning businesses. Built with modern web technologies, it provides an end-to-end solution for managing cleaning operations, from customer booking to service delivery and payment processing.

### What Makes EcoShine Pro Special?

- **🎯 Three-Layer Architecture**: Separate interfaces for admins (CRM), cleaners (mobile app), and customers (portal)
- **📱 Mobile-First Design**: PWA-ready cleaner app with GPS tracking and photo uploads
- **🔐 Enterprise Security**: Role-based access control (RBAC) with 5 distinct user roles
- **💎 Luxury Branding**: Premium design with elegant burgundy, rose, and gold color palette
- **⚡ Real-Time Operations**: Live booking management, scheduling, and notifications
- **📊 Business Intelligence**: Comprehensive analytics and reporting dashboard

### Key Features

| Feature | Description |
|---------|-------------|
| **Booking Management** | Full lifecycle management from inquiry to completion |
| **Customer Database** | Complete CRM with customer history and preferences |
| **Cleaner Management** | Profiles, scheduling, availability, and payouts |
| **GPS Time Tracking** | Location-verified clock in/out for cleaners |
| **Photo Documentation** | Before/after photo uploads for quality assurance |
| **Invoicing & Payments** | Stripe integration for seamless billing |
| **Automated Workflows** | Email/SMS notifications via Resend and Twilio |
| **Route Optimization** | Google Maps integration for efficient scheduling |
| **Review System** | Customer feedback and ratings management |
| **Audit Logging** | Complete activity trail for compliance |

---

## 📸 Screenshots

### Landing Page
The elegant home page provides quick access to all three application layers.

<p align="center">
  <img src="https://github.com/user-attachments/assets/251b25b0-29ca-422f-9bc7-9a2fe2e90915" alt="EcoShine Pro Landing Page" width="800"/>
</p>

### Admin CRM Dashboard
Full-featured admin dashboard with real-time statistics, quick actions, and booking management.

<p align="center">
  <img src="https://github.com/user-attachments/assets/13e92462-f0b2-4e9b-9a00-ec63496106a3" alt="CRM Dashboard" width="800"/>
</p>

### Booking Management
Comprehensive booking management with status tracking, filters, and search functionality.

<p align="center">
  <img src="https://github.com/user-attachments/assets/87abcb6b-533b-499c-a97d-ca070d5bf769" alt="Booking Management" width="800"/>
</p>

### Cleaner Mobile App
Mobile-first interface for cleaners to manage jobs, track time, and upload photos.

<p align="center">
  <img src="https://github.com/user-attachments/assets/81ae6e3b-2248-48ce-8da7-5c65467ba898" alt="Cleaner App" width="800"/>
</p>

### Customer Portal
Self-service portal for customers to view bookings, leave reviews, and manage payments.

<p align="center">
  <img src="https://github.com/user-attachments/assets/9d34e4a2-200f-4ce7-9286-40a59c551767" alt="Customer Portal" width="800"/>
</p>

---

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


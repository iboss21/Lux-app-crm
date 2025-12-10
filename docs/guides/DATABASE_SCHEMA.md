# 🗄️ EcoShine Pro - Database Schema

Complete database schema documentation for EcoShine Pro.

## Overview

EcoShine Pro uses **PostgreSQL** with **Drizzle ORM** for type-safe database operations. The schema includes **70+ tables** covering all aspects of the cleaning service marketplace.

## Table of Contents

1. [Core Entities](#core-entities)
2. [Field Service](#field-service)
3. [Financial](#financial)
4. [CRM & Sales](#crm--sales)
5. [Communication](#communication)
6. [System](#system)
7. [Enums](#enums)
8. [Relationships](#relationships)

---

## 🏗️ Core Entities

### customers

Stores customer information and profiles.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `firstName` | Text | Customer first name |
| `lastName` | Text | Customer last name |
| `email` | Text | Email address (unique) |
| `phone` | Text | Phone number |
| `address` | Text | Street address |
| `aptUnit` | Text | Apartment/unit number |
| `city` | Text | City |
| `state` | Text | State/province |
| `zipCode` | Text | ZIP/postal code |
| `buildingName` | Text | Building name |
| `source` | Text | Lead source (website, referral, etc.) |
| `tags` | Text[] | Customer tags |
| `lifetimeValue` | Decimal | Total revenue from customer |
| `membershipTier` | Enum | standard, premium, vip |
| `stripeCustomerId` | Text | Stripe customer ID |
| `createdAt` | Timestamp | Record creation date |
| `updatedAt` | Timestamp | Last update date |

**Indexes:**
- Unique index on `email`

### bookings

Complete booking information including all form fields.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `customerId` | UUID | Reference to customers |
| `assignedTo` | UUID | Reference to cleaners |
| **Service Details** | | |
| `serviceType` | Text | Type of service |
| `propertyType` | Text | House, apartment, office, etc. |
| `squareFootage` | Integer | Property size |
| `bedrooms` | Integer | Number of bedrooms |
| `bathrooms` | Integer | Number of bathrooms |
| `floors` | Integer | Number of floors |
| **Occupancy** | | |
| `isOccupied` | Boolean | Is property occupied |
| `numberOfOccupants` | Integer | Number of people |
| `hasPets` | Boolean | Has pets |
| `petType` | Text | Type of pet |
| `petCount` | Integer | Number of pets |
| `hasChildren` | Boolean | Has children |
| `childrenAges` | Text | Ages of children |
| **Cleanliness** | | |
| `cleanlinessLevel` | Text | Current cleanliness level |
| `lastProfessionalCleaning` | Text | When last cleaned professionally |
| `clutterLevel` | Text | Amount of clutter |
| **Additional Services** | | |
| `additionalServices` | Text[] | Array of extra services |
| **Special Requirements** | | |
| `hasAllergies` | Boolean | Has allergies |
| `allergyDetails` | Text | Allergy information |
| `preferredProducts` | Text | Product preferences |
| `focusAreas` | Text | Areas to focus on |
| `avoidAreas` | Text | Areas to avoid |
| `valuableItems` | Text | Valuable items to note |
| **Access** | | |
| `accessMethod` | Text | How to access property |
| `accessInstructions` | Text | Access instructions |
| `parkingAvailable` | Boolean | Parking available |
| `parkingInstructions` | Text | Parking details |
| `hasSecuritySystem` | Boolean | Has security system |
| `securityDetails` | Text | Security information |
| **Schedule** | | |
| `frequency` | Enum | one-time, weekly, bi-weekly, monthly |
| `preferredDay` | Text | Preferred day of week |
| `preferredTime` | Text | Preferred time |
| `specificDate` | Timestamp | Scheduled date |
| `specificTime` | Text | Scheduled time |
| `flexibleTiming` | Boolean | Is timing flexible |
| `sameCleaner` | Boolean | Want same cleaner |
| **Pricing** | | |
| `budgetRange` | Text | Customer budget |
| `estimatedPrice` | Decimal | Estimated price |
| `actualPrice` | Decimal | Final price |
| `paymentMethod` | Text | Payment method |
| `interestedInDiscount` | Boolean | Wants discount info |
| **Status** | | |
| `status` | Enum | pending, assigned, en-route, in-progress, completed, cancelled |
| **Metadata** | | |
| `utmSource` | Text | UTM source |
| `utmMedium` | Text | UTM medium |
| `utmCampaign` | Text | UTM campaign |
| `notes` | Text | Internal notes |
| **Recurring** | | |
| `isRecurring` | Boolean | Is recurring booking |
| `recurringParentId` | UUID | Parent booking if recurring |
| `nextRecurringDate` | Timestamp | Next occurrence date |
| `createdAt` | Timestamp | Creation date |
| `updatedAt` | Timestamp | Update date |

**Indexes:**
- Index on `customerId`
- Index on `assignedTo`
- Index on `status`
- Index on `specificDate`

### cleaners

Cleaner profiles and information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `firstName` | Text | First name |
| `lastName` | Text | Last name |
| `email` | Text | Email (unique) |
| `phone` | Text | Phone number |
| `password` | Text | Hashed password |
| `avatar` | Text | Profile photo URL |
| `role` | Enum | cleaner, lead-cleaner, supervisor |
| `skills` | Text[] | Skills/certifications |
| `hourlyRate` | Decimal | Base hourly rate |
| `commissionRate` | Decimal | Commission percentage |
| `commissionType` | Enum | percentage, flat, tiered, bonus, spiff |
| `isActive` | Boolean | Is active |
| `regionId` | UUID | Assigned region |
| `currentLat` | Decimal | Current latitude |
| `currentLng` | Decimal | Current longitude |
| `lastPingAt` | Timestamp | Last GPS update |
| `address` | Text | Home address |
| `city` | Text | City |
| `state` | Text | State |
| `zipCode` | Text | ZIP code |
| `emergencyContact` | Text | Emergency contact name |
| `emergencyPhone` | Text | Emergency phone |
| `hireDate` | Timestamp | Hire date |
| `rating` | Decimal | Average rating |
| `totalJobs` | Integer | Total jobs completed |
| `totalRevenue` | Decimal | Total revenue generated |
| `bankAccount` | Text | Bank account (encrypted) |
| `taxId` | Text | Tax ID |
| `notes` | Text | Internal notes |
| `createdAt` | Timestamp | Creation date |

**Indexes:**
- Unique index on `email`
- Index on `regionId`

### regions

Service regions and territories.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | Text | Region name |
| `zipCodes` | Text[] | ZIP codes in region |
| `serviceArea` | JSONB | GeoJSON polygon |
| `managerId` | UUID | Regional manager |
| `isActive` | Boolean | Is active |
| `hourlyMultiplier` | Decimal | Pricing multiplier |
| `createdAt` | Timestamp | Creation date |

---

## 🚚 Field Service

### timeTracking

GPS-verified time tracking for cleaners.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `bookingId` | UUID | Reference to booking |
| `cleanerId` | UUID | Reference to cleaner |
| `clockIn` | Timestamp | Clock in time |
| `clockOut` | Timestamp | Clock out time |
| `clockInLat` | Decimal | Clock in latitude |
| `clockInLng` | Decimal | Clock in longitude |
| `clockOutLat` | Decimal | Clock out latitude |
| `clockOutLng` | Decimal | Clock out longitude |
| `travelTime` | Integer | Travel time (minutes) |
| `workTime` | Integer | Work time (minutes) |
| `totalTime` | Integer | Total time (minutes) |
| `breakTime` | Integer | Break time (minutes) |
| `overtimeMinutes` | Integer | Overtime (minutes) |
| `createdAt` | Timestamp | Creation date |

**Indexes:**
- Index on `bookingId`
- Index on `cleanerId`

### jobPhotos

Before, during, and after photos.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `bookingId` | UUID | Reference to booking |
| `cleanerId` | UUID | Cleaner who uploaded |
| `photoType` | Enum | before, during, after |
| `photoUrl` | Text | S3 URL |
| `thumbnailUrl` | Text | Thumbnail URL |
| `caption` | Text | Photo caption |
| `takenAt` | Timestamp | Photo timestamp |
| `uploadedAt` | Timestamp | Upload timestamp |

### routes

Daily route planning.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | Text | Route name |
| `date` | Timestamp | Route date |
| `cleanerId` | UUID | Assigned cleaner |
| `status` | Enum | planned, in-progress, completed |
| `startTime` | Timestamp | Start time |
| `endTime` | Timestamp | End time |
| `totalDistance` | Decimal | Total distance (miles) |
| `totalDuration` | Integer | Total duration (minutes) |
| `stops` | Integer | Number of stops |
| `createdAt` | Timestamp | Creation date |

### routeStops

Individual stops on a route.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `routeId` | UUID | Reference to route |
| `bookingId` | UUID | Reference to booking |
| `stopOrder` | Integer | Order in route |
| `status` | Enum | pending, arrived, completed, skipped |
| `estimatedArrival` | Timestamp | ETA |
| `actualArrival` | Timestamp | Actual arrival |
| `departureTime` | Timestamp | Departure time |
| `travelDistance` | Decimal | Distance from previous stop |
| `travelDuration` | Integer | Travel time (minutes) |

---

## 💰 Financial

### invoices

Customer invoices.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `bookingId` | UUID | Reference to booking |
| `customerId` | UUID | Reference to customer |
| `invoiceNumber` | Text | Unique invoice number |
| `status` | Enum | draft, sent, paid, overdue, cancelled |
| `subtotal` | Decimal | Subtotal |
| `tax` | Decimal | Tax amount |
| `total` | Decimal | Total amount |
| `amountPaid` | Decimal | Amount paid |
| `dueDate` | Timestamp | Payment due date |
| `paidAt` | Timestamp | Payment date |
| `notes` | Text | Invoice notes |
| `createdAt` | Timestamp | Creation date |

### payments

Payment transactions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `invoiceId` | UUID | Reference to invoice |
| `customerId` | UUID | Reference to customer |
| `amount` | Decimal | Payment amount |
| `status` | Enum | pending, completed, failed, refunded |
| `paymentMethod` | Text | Payment method |
| `stripePaymentIntentId` | Text | Stripe PI ID |
| `stripeChargeId` | Text | Stripe charge ID |
| `transactionId` | Text | Transaction ID |
| `failureReason` | Text | Failure reason |
| `processedAt` | Timestamp | Processing date |
| `createdAt` | Timestamp | Creation date |

### payouts

Cleaner payouts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `cleanerId` | UUID | Reference to cleaner |
| `periodStart` | Timestamp | Payout period start |
| `periodEnd` | Timestamp | Payout period end |
| `totalEarnings` | Decimal | Total earnings |
| `commission` | Decimal | Commission amount |
| `deductions` | Decimal | Deductions |
| `netPayout` | Decimal | Net payout |
| `status` | Enum | pending, processing, paid, failed |
| `paymentMethod` | Text | Payment method |
| `transactionId` | Text | Transaction ID |
| `paidAt` | Timestamp | Payment date |
| `notes` | Text | Payout notes |
| `createdAt` | Timestamp | Creation date |

---

## 📊 CRM & Sales

### leads

Sales leads pipeline.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `firstName` | Text | First name |
| `lastName` | Text | Last name |
| `email` | Text | Email |
| `phone` | Text | Phone |
| `company` | Text | Company name |
| `status` | Enum | new, contacted, qualified, proposal-sent, won, lost |
| `temperature` | Enum | hot, warm, cold |
| `source` | Text | Lead source |
| `estimatedValue` | Decimal | Estimated deal value |
| `notes` | Text | Notes |
| `assignedTo` | UUID | Assigned sales rep |
| `nextFollowUp` | Timestamp | Next follow-up date |
| `wonAt` | Timestamp | Won date |
| `lostReason` | Text | Lost reason |
| `createdAt` | Timestamp | Creation date |

### reviews

Customer reviews and ratings.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `bookingId` | UUID | Reference to booking |
| `customerId` | UUID | Reference to customer |
| `cleanerId` | UUID | Reference to cleaner |
| `rating` | Integer | 1-5 star rating |
| `comment` | Text | Review text |
| `photoUrls` | Text[] | Review photos |
| `response` | Text | Business response |
| `respondedAt` | Timestamp | Response date |
| `isPublic` | Boolean | Show publicly |
| `createdAt` | Timestamp | Creation date |

---

## 📧 Communication

### emailCampaigns

Email marketing campaigns.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | Text | Campaign name |
| `subject` | Text | Email subject |
| `content` | Text | Email content |
| `status` | Enum | draft, scheduled, sending, completed |
| `scheduledFor` | Timestamp | Send date |
| `sentAt` | Timestamp | Actual send date |
| `totalRecipients` | Integer | Total recipients |
| `opened` | Integer | Emails opened |
| `clicked` | Integer | Links clicked |
| `bounced` | Integer | Bounces |
| `unsubscribed` | Integer | Unsubscribes |
| `createdAt` | Timestamp | Creation date |

### notifications

System notifications.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `userId` | UUID | User ID |
| `type` | Enum | info, success, warning, error |
| `title` | Text | Notification title |
| `message` | Text | Notification message |
| `isRead` | Boolean | Is read |
| `actionUrl` | Text | Action URL |
| `createdAt` | Timestamp | Creation date |

---

## ⚙️ System

### adminUsers

Admin/staff user accounts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `firstName` | Text | First name |
| `lastName` | Text | Last name |
| `email` | Text | Email (unique) |
| `password` | Text | Hashed password |
| `role` | Enum | admin, manager, csr |
| `isActive` | Boolean | Is active |
| `avatar` | Text | Profile photo |
| `lastLogin` | Timestamp | Last login |
| `createdAt` | Timestamp | Creation date |

### auditLogs

System activity audit trail.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `userId` | UUID | User who performed action |
| `userType` | Enum | admin, cleaner, customer |
| `action` | Text | Action performed |
| `entityType` | Text | Entity type |
| `entityId` | UUID | Entity ID |
| `changes` | JSONB | Changes made |
| `ipAddress` | Text | IP address |
| `userAgent` | Text | User agent |
| `createdAt` | Timestamp | Action timestamp |

---

## 📝 Enums

### booking_status
- `pending` - Awaiting assignment
- `assigned` - Cleaner assigned
- `en-route` - Cleaner traveling to location
- `in-progress` - Service in progress
- `completed` - Service completed
- `cancelled` - Booking cancelled

### user_role
- `admin` - Full system access
- `manager` - Team management
- `csr` - Customer service representative
- `technician` - Field cleaner
- `customer` - Customer portal access

### cleaner_role
- `cleaner` - Standard cleaner
- `lead-cleaner` - Team lead
- `supervisor` - Regional supervisor

### invoice_status
- `draft` - Not sent
- `sent` - Sent to customer
- `paid` - Paid in full
- `overdue` - Past due date
- `cancelled` - Cancelled

### payment_status
- `pending` - Awaiting processing
- `completed` - Successful
- `failed` - Failed
- `refunded` - Refunded

---

## 🔗 Relationships

### Customer Relationships
- One customer → Many bookings
- One customer → Many invoices
- One customer → Many payments
- One customer → Many reviews

### Booking Relationships
- One booking → One customer
- One booking → One/Many cleaners (assigned)
- One booking → Many photos
- One booking → Many time tracking records
- One booking → One invoice
- One booking → One review

### Cleaner Relationships
- One cleaner → Many bookings
- One cleaner → Many time tracking records
- One cleaner → Many photos
- One cleaner → One region
- One cleaner → Many payouts
- One cleaner → Many reviews

### Route Relationships
- One route → One cleaner
- One route → Many route stops
- One route stop → One booking

---

## 📊 Key Metrics Tables

The schema includes several computed/cached metric fields:

- **customers.lifetimeValue** - Total revenue from customer
- **cleaners.totalJobs** - Total completed jobs
- **cleaners.totalRevenue** - Total revenue generated
- **cleaners.rating** - Average rating

These are updated via triggers or application logic to avoid expensive queries.

---

## 🔐 Security Considerations

1. **Password Storage**
   - All passwords hashed with bcrypt
   - Never store plain text

2. **Sensitive Data**
   - Bank accounts encrypted
   - Tax IDs encrypted
   - Credit cards never stored (use Stripe)

3. **Access Control**
   - Row-level security via application layer
   - RBAC enforced in queries
   - Audit logs for compliance

---

*For API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)*

*For user guides, see [USER_GUIDE.md](USER_GUIDE.md)*

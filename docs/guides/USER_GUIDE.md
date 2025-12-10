# 📖 EcoShine Pro - Complete User Guide

Welcome to the EcoShine Pro user guide. This comprehensive manual will help you navigate and use all features of the platform effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Admin CRM Guide](#admin-crm-guide)
3. [Cleaner App Guide](#cleaner-app-guide)
4. [Customer Portal Guide](#customer-portal-guide)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### First Time Login

1. Navigate to the appropriate portal:
   - **Admin/Staff**: `https://yoursite.com/crm`
   - **Cleaners**: `https://yoursite.com/cleaner`
   - **Customers**: `https://yoursite.com/portal`

2. Enter your credentials (email and password)
3. If you forgot your password, click "Forgot Password" to reset

### User Roles

- **ADMIN** - Full system access, all features
- **MANAGER** - Team management, reports, limited settings
- **CSR** - Customer service, bookings, customer management
- **TECHNICIAN** - Cleaner with field access
- **CUSTOMER** - Customer portal access

---

## 🏢 Admin CRM Guide

### Dashboard Overview

The CRM dashboard is your central hub for business operations.

#### Understanding Dashboard Metrics

1. **Pending Bookings** - Jobs awaiting assignment or completion
2. **Total Bookings** - All bookings in the system (this month)
3. **Total Customers** - Active customer count
4. **Revenue This Month** - Current month's revenue

Each metric shows a percentage change compared to the previous period.

#### Quick Actions

- **New Booking** - Create a new service booking
- **Assign Cleaners** - View and assign pending jobs
- **View Analytics** - Access detailed business analytics

### Managing Bookings

#### Creating a New Booking

1. Click "New Booking" from the dashboard or navigation
2. **Step 1: Customer Selection**
   - Search for existing customer
   - Or click "Add New Customer"
   - Enter customer details if new
3. **Step 2: Service Details**
   - Select service type (Standard Clean, Deep Clean, etc.)
   - Choose date and time
   - Enter service address
   - Add special instructions
4. **Step 3: Pricing**
   - Review automatic pricing
   - Apply discounts if needed
   - Add extra services
5. **Step 4: Assignment** (optional)
   - Assign cleaner(s) immediately
   - Or leave for later assignment
6. Click "Create Booking" to finish

#### Viewing and Filtering Bookings

1. Navigate to "Bookings" from sidebar
2. Use filters to narrow down results:
   - **Status Filter**: All, Pending, Assigned, In Progress, Completed, Cancelled
   - **Service Type Filter**: Filter by service category
   - **Search**: Search by customer name, address, or booking ID
3. Click any booking to view full details

#### Assigning Cleaners

1. Go to Bookings page
2. Filter by "Pending" status
3. Click on a booking
4. Click "Assign Cleaner"
5. Select cleaner(s) from the list
6. Confirm assignment
7. System automatically notifies the cleaner

#### Updating Booking Status

Booking statuses progress through these stages:
- **Pending** → **Assigned** → **En Route** → **In Progress** → **Completed**

To update status:
1. Open the booking
2. Click "Update Status"
3. Select new status
4. Add notes if needed
5. Save changes

### Managing Customers

#### Adding a New Customer

1. Navigate to "Customers"
2. Click "Add Customer"
3. Fill in the form:
   - First and last name
   - Email address
   - Phone number
   - Service address
   - Additional addresses (optional)
4. Click "Save Customer"

#### Viewing Customer History

1. Go to "Customers"
2. Click on a customer name
3. View their profile which shows:
   - Contact information
   - All service addresses
   - Booking history
   - Payment methods
   - Total lifetime value
   - Reviews and ratings

#### Communicating with Customers

1. Open customer profile
2. Click "Send Message"
3. Choose method:
   - Email
   - SMS
   - Internal note
4. Compose and send

### Managing Cleaners

#### Adding a New Cleaner

1. Navigate to "Cleaners"
2. Click "Add Cleaner"
3. Enter details:
   - Personal information
   - Contact details
   - Role (Cleaner, Lead Cleaner, Supervisor)
   - Commission rate
   - Skills and certifications
4. Set availability schedule
5. Click "Create Cleaner"

#### Setting Cleaner Availability

1. Open cleaner profile
2. Go to "Availability" tab
3. Set working hours for each day
4. Block off unavailable dates
5. Save changes

#### Processing Vacation Requests

1. Navigate to "Cleaners" → "Vacation Requests"
2. Review pending requests
3. Check team capacity for those dates
4. Approve or deny with notes
5. System notifies the cleaner

### Using the Calendar

#### Viewing Schedule

1. Navigate to "Calendar"
2. Choose view:
   - **Day View**: Hourly breakdown of jobs
   - **Week View**: Weekly overview
   - **Month View**: Monthly calendar
3. Color coding indicates status:
   - Orange: Pending
   - Blue: Assigned
   - Green: In Progress
   - Dark Green: Completed
   - Red: Cancelled

#### Drag and Drop Assignment

1. In calendar view
2. Find an unassigned job (orange)
3. Drag it to a cleaner's schedule
4. Drop to assign
5. Confirm the assignment

### Route Optimization

#### Creating a Daily Route

1. Navigate to "Routes"
2. Click "Create New Route"
3. Select date
4. Choose cleaner or team
5. Add jobs to the route:
   - Drag and drop from available jobs
   - Or click "Add Job"
6. System automatically optimizes for distance
7. Review route on map
8. Click "Finalize Route"

#### Monitoring Route Progress

1. Go to "Routes"
2. Select active route
3. View real-time progress:
   - Current location
   - Completed stops
   - Remaining stops
   - Estimated completion time

### Invoicing and Billing

#### Creating an Invoice

Invoices are typically auto-generated after job completion, but you can create manual invoices:

1. Navigate to "Invoices"
2. Click "Create Invoice"
3. Select customer
4. Add line items:
   - Service description
   - Quantity
   - Unit price
   - Tax
5. Apply discounts if needed
6. Set payment terms
7. Click "Save & Send"

#### Processing Payments

1. Open invoice
2. Click "Record Payment"
3. Enter payment details:
   - Amount
   - Payment method
   - Payment date
   - Transaction ID
4. Save payment
5. Invoice status updates to "Paid"

#### Handling Refunds

1. Find the paid invoice
2. Click "Issue Refund"
3. Enter refund amount
4. Select reason
5. Add notes
6. Process refund through Stripe
7. Customer receives confirmation

### Managing Payouts

#### Processing Weekly Payouts

1. Navigate to "Payouts"
2. Review payout period
3. Click "Calculate Payouts"
4. System shows:
   - Each cleaner's jobs
   - Total earnings
   - Commission breakdown
   - Previous advances (if any)
   - Net payout amount
5. Review for accuracy
6. Click "Approve Payouts"
7. Select payment method:
   - Direct deposit
   - Check
   - Cash
8. Click "Process Payments"
9. Cleaners receive notification

### Analytics and Reporting

#### Viewing Revenue Trends

1. Navigate to "Analytics"
2. Select time period:
   - Last 7 days
   - Last 30 days
   - Last 90 days
   - Last year
   - Custom range
3. View revenue trend chart
4. Hover over data points for details

#### Analyzing Service Performance

1. In Analytics page
2. Scroll to "Revenue by Service"
3. View breakdown showing:
   - Service type
   - Revenue
   - Number of bookings
   - Average value

#### Tracking Team Performance

1. In Analytics page
2. View "Top Performing Cleaners" table
3. See rankings by:
   - Jobs completed
   - Revenue generated
   - Average rating
4. Click "Team Performance" for detailed view

#### Exporting Reports

1. In Analytics page
2. Click "Export" button
3. Choose format:
   - Excel (.xlsx)
   - CSV (.csv)
   - PDF
4. Select data to include
5. Download report

### Using the Info Portal

The Info Portal provides internal documentation and resources.

#### Accessing Documentation

1. Navigate to "Info Portal"
2. Browse categories:
   - Getting Started
   - Booking Management
   - Customer Service
   - Billing & Payments
3. Click any article to read
4. Use search to find specific topics

#### Downloading Cleaning Guides

1. In Info Portal
2. Scroll to "Cleaning Guides & Checklists"
3. Click "Download" on desired guide:
   - Standard Cleaning Checklist
   - Deep Cleaning Protocol
   - Move-Out Cleaning Guide
   - Commercial Cleaning Standards
4. PDF downloads to your device

### Settings and Configuration

#### Updating Company Information

1. Navigate to "Settings"
2. Go to "Company" tab
3. Update:
   - Company name
   - Contact information
   - Logo
   - Brand colors
4. Save changes

#### Managing Service Types

1. In Settings → "Services"
2. View list of service types
3. To add new service:
   - Click "Add Service"
   - Enter name and description
   - Set base price and duration
   - Define what's included
   - Save
4. To edit existing service:
   - Click edit icon
   - Modify details
   - Save changes

#### Configuring Regions

1. Settings → "Regions"
2. Click "Add Region"
3. Enter:
   - Region name
   - ZIP codes covered
   - Service availability
   - Travel fees (if any)
4. Save region

---

## 📱 Cleaner App Guide

### Logging In

1. Open app at `https://yoursite.com/cleaner`
2. Enter your cleaner credentials
3. Click "Login"

### Viewing Today's Jobs

1. After login, you see dashboard
2. Today's jobs are listed
3. Each job shows:
   - Customer name
   - Address
   - Time
   - Service type
   - Estimated earnings

### Starting a Job

1. On job list, find your next job
2. Click "Start Job"
3. App requests location permission (allow)
4. Click "Clock In"
5. GPS verifies you're at location
6. Job timer starts

### Using Navigation

1. On job card, click "Navigate"
2. Chooses your preferred maps app:
   - Google Maps
   - Apple Maps
   - Waze
3. Follow turn-by-turn directions

### Uploading Photos

Photos are required for quality assurance.

#### Taking Before Photos

1. Before starting cleaning
2. In job details, click "Upload Photos"
3. Select "Before"
4. Take photos of:
   - Main areas to be cleaned
   - Problem areas
   - Overall condition
5. Review photos
6. Click "Upload"

#### Taking After Photos

1. After completing cleaning
2. Click "Upload Photos"
3. Select "After"
4. Take photos of:
   - Same areas as before photos
   - Completed work
   - Overall final condition
5. Review photos
6. Click "Upload"
7. These photos go to customer

### Completing a Job

1. Ensure all tasks are done
2. Verify before/after photos uploaded
3. Click "Complete Job"
4. App asks: "Did you complete all tasks?"
5. Confirm completion
6. Clock out automatically
7. Add any notes about the job
8. Submit completion
9. Customer receives notification

### Viewing Earnings

1. From dashboard, click "Earnings"
2. View:
   - Today's earnings
   - This week
   - This month
   - Last payout
3. Click any job to see breakdown

### Managing Your Profile

1. Click profile icon
2. Update:
   - Personal information
   - Profile photo
   - Phone number
   - Emergency contact
3. Save changes

### Setting Availability

1. Go to Profile → "Availability"
2. Set working hours for each day
3. To request time off:
   - Click "Request Time Off"
   - Select dates
   - Add reason
   - Submit request
4. Manager will approve/deny

---

## 👤 Customer Portal Guide

### Creating an Account

1. Visit `https://yoursite.com/portal`
2. Click "Sign Up"
3. Enter:
   - Name
   - Email
   - Phone
   - Password
4. Verify email
5. Complete profile

### Booking a Service

#### First Time Booking

1. Log in to portal
2. Click "Book Service"
3. **Step 1: Choose Service**
   - Browse available services
   - Select service type
   - Read what's included
4. **Step 2: Select Date & Time**
   - Choose preferred date
   - Select available time slot
   - Choose frequency (one-time, weekly, bi-weekly, monthly)
5. **Step 3: Enter Address**
   - Enter service address
   - Add apartment/suite number
   - Add access instructions
   - Add parking information
6. **Step 4: Add Extras** (optional)
   - Extra rooms
   - Special services
   - Eco-friendly products
7. **Step 5: Payment**
   - Enter credit card
   - Or select saved payment method
   - Review total price
8. Click "Confirm Booking"
9. Receive confirmation email

### Rebooking a Service

1. In dashboard, click "Rebook"
2. Choose from past services
3. Select new date
4. Confirm booking
5. Done! Much faster than new booking

### Viewing Booking History

1. Navigate to "Bookings"
2. See all bookings:
   - Upcoming
   - In progress
   - Completed
   - Cancelled
3. Click any booking for details

### Viewing Before/After Photos

1. Open a completed booking
2. Scroll to "Photos" section
3. View before and after comparison
4. Download or share photos

### Leaving a Review

1. After job completion, you receive email
2. Click "Leave a Review"
3. Or go to Portal → Bookings → Click booking
4. Click "Write a Review"
5. Rate out of 5 stars:
   - Overall service
   - Cleaner performance
   - Value for money
6. Write detailed feedback
7. Upload photos (optional)
8. Submit review

### Managing Payment Methods

1. Go to Profile → "Payment Methods"
2. To add card:
   - Click "Add Payment Method"
   - Enter card details (secure via Stripe)
   - Save
3. To set default:
   - Click "Set as Default" on preferred card
4. To remove card:
   - Click delete icon
   - Confirm removal

### Managing Subscriptions

#### Setting Up Recurring Service

1. When booking, select frequency:
   - Weekly
   - Bi-weekly
   - Monthly
2. Complete booking
3. Subscription created automatically

#### Pausing a Subscription

1. Go to Profile → "Subscriptions"
2. Find active subscription
3. Click "Pause"
4. Select pause duration
5. Confirm
6. Resume anytime

#### Cancelling a Subscription

1. Go to Profile → "Subscriptions"
2. Click "Cancel"
3. Select reason (helps us improve)
4. Confirm cancellation
5. You can re-subscribe anytime

### Using Referral Program

1. Go to Profile → "Referrals"
2. Find your unique referral code
3. Share with friends via:
   - Email
   - SMS
   - Social media
4. When they book, you both get rewards:
   - You: $25 credit
   - Friend: 20% off first booking
5. Track referrals in your account

---

## 🔧 Common Tasks

### Password Reset

1. Go to login page
2. Click "Forgot Password"
3. Enter your email
4. Check email for reset link
5. Click link
6. Enter new password
7. Confirm password
8. Submit

### Updating Email Address

**Admin/Cleaner:**
1. Settings → Profile
2. Enter new email
3. Verify via code sent to new email
4. Confirm

**Customer:**
1. Profile → Account Settings
2. Update email
3. Verify new email
4. Save

### Changing Notification Preferences

**Admin CRM:**
1. Settings → Notifications
2. Toggle preferences:
   - Email notifications
   - SMS alerts
   - In-app notifications
3. Save

**Customer Portal:**
1. Profile → Preferences
2. Select what you want to receive:
   - Booking confirmations
   - Reminders
   - Promotions
   - Reviews
3. Save preferences

### Downloading Invoice/Receipt

1. Find the booking
2. Click "View Invoice"
3. Click "Download PDF"
4. Save to device

---

## 🆘 Troubleshooting

### Can't Log In

**Problem:** "Invalid email or password"
- Double-check email address
- Ensure password is correct (case-sensitive)
- Try password reset
- Check if account is active

**Problem:** "Account locked"
- Too many failed login attempts
- Wait 15 minutes, or
- Contact admin to unlock

### Booking Not Showing

- Refresh the page
- Check filters (status, date range)
- Ensure database connection is active
- Check your user permissions

### Photos Not Uploading

- Check internet connection
- Ensure photo size < 5MB
- Try different photo format
- Check S3 configuration

### Payment Failed

- Verify card details
- Check card hasn't expired
- Ensure sufficient funds
- Try different payment method
- Check with bank for blocks

### GPS Not Working (Cleaner App)

- Allow location permissions
- Enable GPS on device
- Check internet connection
- Try restarting app
- Update browser

### Email Notifications Not Received

- Check spam folder
- Verify email address in profile
- Check notification settings
- Contact admin to verify email service

### Can't Assign Cleaner to Booking

- Check cleaner availability for that date/time
- Ensure cleaner is in correct region
- Verify cleaner has required skills
- Check for conflicting bookings

---

## 📞 Getting Help

### Contact Support

- **Email**: support@ecoshine.pro
- **Phone**: Call during business hours
- **In-App**: Click "Help" or "Contact Support"
- **Documentation**: Check Info Portal first

### Report a Bug

1. Document the issue:
   - What were you trying to do?
   - What happened instead?
   - Screenshot if possible
2. Go to Settings → "Report Issue"
3. Fill in form with details
4. Submit
5. You'll receive a ticket number

### Request a Feature

1. Settings → "Feature Request"
2. Describe the feature
3. Explain the use case
4. Submit
5. Product team reviews all requests

---

## 🎓 Training Resources

### Video Tutorials

Access via Info Portal → "Training Videos"
- Getting Started (10 minutes)
- Creating Bookings (15 minutes)
- Using Analytics (20 minutes)
- Route Optimization (12 minutes)

### Webinars

Monthly training webinars:
- First Tuesday: Admin CRM Features
- Third Tuesday: Advanced Analytics
- Register in Settings → "Training"

### Best Practices

See Info Portal for guides on:
- Customer communication
- Conflict resolution
- Time management
- Quality assurance

---

*For technical documentation and API details, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)*

*For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)*

# 🔧 EcoShine Pro - Installation Guide

Complete step-by-step installation and setup instructions for EcoShine Pro.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Third-Party Service Setup](#third-party-service-setup)
6. [Running the Application](#running-the-application)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

---

## 📋 System Requirements

### Minimum Requirements

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **PostgreSQL**: Version 13 or higher
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 2GB free space

### Recommended Setup

- **Node.js**: Version 20.x LTS
- **npm**: Version 10.x
- **PostgreSQL**: Version 15 or cloud database (Supabase/Neon)
- **RAM**: 16GB for development
- **SSD**: For faster build times

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🚀 Installation Steps

### Step 1: Install Node.js

#### Windows

1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Follow installation wizard
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### macOS

Using Homebrew:
```bash
brew install node@20
```

Or download from [nodejs.org](https://nodejs.org/)

Verify:
```bash
node --version
npm --version
```

#### Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:
```bash
node --version
npm --version
```

### Step 2: Install Git

#### Windows

Download from [git-scm.com](https://git-scm.com/)

#### macOS

```bash
brew install git
```

#### Linux

```bash
sudo apt-get install git
```

Verify:
```bash
git --version
```

### Step 3: Install PostgreSQL (Optional - if not using cloud)

#### Windows

1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer
3. Set password for postgres user
4. Note the port (default: 5432)

#### macOS

```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux

```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 4: Clone the Repository

```bash
git clone https://github.com/iboss21/Lux-app-crm.git
cd Lux-app-crm
```

### Step 5: Install Dependencies

```bash
npm install
```

This will install all required packages defined in `package.json`. It may take 2-5 minutes depending on your internet speed.

**Expected output:**
```
added 596 packages, and audited 597 packages in 20s
```

---

## ⚙️ Environment Configuration

### Step 1: Create Environment File

```bash
cp .env.example .env.local
```

### Step 2: Configure Required Variables

Open `.env.local` in your text editor and configure the following:

#### Database Configuration (REQUIRED)

```env
DATABASE_URL="postgresql://username:password@host:5432/database_name"
```

**Examples:**

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ecoshine"
```

**Supabase:**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

**Neon:**
```env
DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb"
```

#### Authentication (REQUIRED)

```env
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

Copy the output and paste as `NEXTAUTH_SECRET`.

#### App URL (REQUIRED)

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For production, change to your actual domain:
```env
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Step 3: Configure Optional Services

These are optional but recommended for full functionality:

#### Stripe (for payments)

```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Get from [Stripe Dashboard](https://dashboard.stripe.com/)

#### AWS S3 (for photo uploads)

```env
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="your-bucket-name"
```

Get from [AWS IAM Console](https://console.aws.amazon.com/iam/)

#### Twilio (for SMS)

```env
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"
```

Get from [Twilio Console](https://www.twilio.com/console)

#### Resend (for emails)

```env
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@yourdomain.com"
```

Get from [Resend Dashboard](https://resend.com/api-keys)

#### Google Maps (for navigation)

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSy..."
```

Get from [Google Cloud Console](https://console.cloud.google.com/)

#### Google OAuth (optional)

```env
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

Get from [Google Cloud Console](https://console.cloud.google.com/)

---

## 🗄️ Database Setup

### Option 1: Using Cloud Database (Recommended)

#### Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Create account and new project
3. Wait for database to provision (2-3 minutes)
4. Go to Settings → Database
5. Copy connection string
6. Paste into `DATABASE_URL` in `.env.local`
7. Add `?sslmode=require` to end if needed

#### Neon Setup

1. Go to [neon.tech](https://neon.tech)
2. Create account and new project
3. Copy connection string
4. Paste into `DATABASE_URL` in `.env.local`

### Option 2: Local PostgreSQL

#### Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ecoshine;

# Create user (optional)
CREATE USER ecoshine_user WITH PASSWORD 'secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ecoshine TO ecoshine_user;

# Exit
\q
```

#### Update DATABASE_URL

```env
DATABASE_URL="postgresql://ecoshine_user:secure_password@localhost:5432/ecoshine"
```

### Step 2: Push Database Schema

This creates all 70+ tables in your database:

```bash
npm run db:push
```

**Expected output:**
```
✓ Schema pushed successfully
✓ 72 tables created
```

**Alternative: Using migrations**

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

### Step 3: Verify Database

Open Drizzle Studio to view your database:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:4983` where you can:
- View all tables
- Browse data
- Run queries
- Test relations

---

## 🔌 Third-Party Service Setup

### Stripe Setup (Payments)

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up
   - Complete verification

2. **Get API Keys**
   - Go to Developers → API Keys
   - Copy "Publishable key" and "Secret key"
   - Use test keys for development
   - Add to `.env.local`

3. **Set Up Webhooks**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `payment_intent.succeeded`
     - `payment_intent.failed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy webhook secret
   - Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### AWS S3 Setup (File Storage)

1. **Create AWS Account**
   - Go to [aws.amazon.com](https://aws.amazon.com)
   - Sign up

2. **Create S3 Bucket**
   - Go to S3 console
   - Click "Create bucket"
   - Name: `ecoshine-photos` (must be globally unique)
   - Region: Choose closest to your users
   - Uncheck "Block all public access" (we'll use signed URLs)
   - Create bucket

3. **Create IAM User**
   - Go to IAM console
   - Users → Add users
   - Username: `ecoshine-app`
   - Access type: "Programmatic access"
   - Permissions: Attach `AmazonS3FullAccess` policy
   - Create user
   - Save Access Key ID and Secret Access Key
   - Add to `.env.local`

4. **Configure Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicRead",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::ecoshine-photos/*"
       }
     ]
   }
   ```

### Twilio Setup (SMS)

1. **Create Twilio Account**
   - Go to [twilio.com](https://twilio.com)
   - Sign up
   - Verify email and phone

2. **Get Credentials**
   - Dashboard shows Account SID and Auth Token
   - Copy to `.env.local`

3. **Get Phone Number**
   - Go to Phone Numbers
   - Buy a phone number (free in trial)
   - Copy to `.env.local`

### Resend Setup (Email)

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up

2. **Verify Domain**
   - Go to Domains
   - Add your domain
   - Add DNS records to your domain provider
   - Wait for verification

3. **Get API Key**
   - Go to API Keys
   - Create API key
   - Copy to `.env.local`

### Google Maps Setup (Navigation)

1. **Create Google Cloud Project**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project

2. **Enable APIs**
   - Go to APIs & Services → Library
   - Enable these APIs:
     - Maps JavaScript API
     - Geocoding API
     - Directions API
     - Distance Matrix API

3. **Create API Key**
   - Go to Credentials
   - Create credentials → API key
   - Restrict key to your domain
   - Copy to `.env.local`

4. **Set Up Billing**
   - Required for API usage
   - Google gives $200/month free credit

---

## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.100:3000

 ✓ Ready in 1.3s
```

The application will be available at:
- **Homepage**: http://localhost:3000
- **Admin CRM**: http://localhost:3000/crm
- **Cleaner App**: http://localhost:3000/cleaner
- **Customer Portal**: http://localhost:3000/portal

### Production Build

Build for production:

```bash
npm run build
```

This compiles the application and optimizes for production.

**Expected output:**
```
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (15/15)
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    4.2 kB         120 kB
├ ○ /crm                                 8.5 kB         180 kB
├ ○ /cleaner                             6.3 kB         150 kB
└ ○ /portal                              5.8 kB         145 kB
```

Start production server:

```bash
npm run start
```

---

## ✅ Verification

### Check Installation

1. **Homepage Loads**
   - Visit http://localhost:3000
   - Should see EcoShine Pro homepage

2. **CRM Accessible**
   - Visit http://localhost:3000/crm
   - Should see CRM dashboard

3. **Database Connection**
   - Check CRM dashboard
   - Should NOT see "Database connection: Not configured" error
   - If you see this, verify DATABASE_URL

4. **Environment Variables**
   ```bash
   # Check if .env.local exists
   ls -la .env.local
   
   # Should output the file
   ```

### Create Test Data (Optional)

You can create sample bookings, customers, and cleaners to test the system:

1. Go to http://localhost:3000/crm
2. Navigate to Customers → Add Customer
3. Fill in test customer info
4. Navigate to Bookings → New Booking
5. Create a test booking

---

## 🔧 Troubleshooting

### Common Issues

#### "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### "Database connection failed"

**Solutions:**
1. Verify DATABASE_URL is correct
2. Check database is running (if local)
3. Test connection:
   ```bash
   # For PostgreSQL
   psql -h localhost -U postgres -d ecoshine
   ```
4. Check firewall isn't blocking port 5432
5. For cloud databases, check IP whitelist

#### Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

#### Build fails with TypeScript errors

**Solution:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix errors, then build again
npm run build
```

#### Stripe webhook not receiving events

**Solutions:**
1. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
2. For production, verify webhook endpoint URL
3. Check webhook secret is correct

#### Photos not uploading

**Solutions:**
1. Verify AWS credentials
2. Check S3 bucket policy
3. Ensure bucket name is correct
4. Check IAM user has S3 permissions

#### SMS not sending

**Solutions:**
1. Verify Twilio credentials
2. Check phone number is verified (in trial mode)
3. Check account balance
4. Verify phone number format includes country code

### Getting Help

If you encounter issues not covered here:

1. Check [GitHub Issues](https://github.com/iboss21/Lux-app-crm/issues)
2. Search existing issues
3. Create new issue with:
   - System information (OS, Node version)
   - Error message
   - Steps to reproduce
   - Screenshots if applicable

---

## 🎉 Next Steps

After successful installation:

1. **Read the User Guide**
   - See [USER_GUIDE.md](USER_GUIDE.md) for how to use features

2. **Configure Settings**
   - Set up service types
   - Configure regions
   - Set pricing

3. **Create Admin Users**
   - Add team members
   - Assign roles

4. **Customize Branding**
   - Update company information
   - Upload logo
   - Adjust colors (optional)

5. **Deploy to Production**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions

---

*For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)*

*For API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)*

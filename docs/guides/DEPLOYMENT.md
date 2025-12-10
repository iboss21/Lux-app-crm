# 🚀 EcoShine Pro - Deployment Guide

Complete guide for deploying EcoShine Pro to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment Platforms](#deployment-platforms)
3. [Vercel Deployment](#vercel-deployment)
4. [AWS Deployment](#aws-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Database Migration](#database-migration)
8. [Post-Deployment](#post-deployment)
9. [Monitoring](#monitoring)
10. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Code Preparation

- [ ] All features tested locally
- [ ] No console.log statements in production code
- [ ] All environment variables documented
- [ ] Database schema finalized
- [ ] API endpoints tested
- [ ] Error handling implemented
- [ ] Security measures in place

### Build Verification

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build project
npm run build

# Test production build locally
npm run start
```

### Environment Variables

- [ ] All `.env.local` variables documented
- [ ] Production credentials ready
- [ ] Stripe live keys obtained
- [ ] AWS production bucket created
- [ ] Database backup created
- [ ] SSL certificates ready (if self-hosting)

---

## 🌐 Deployment Platforms

### Recommended Platforms

1. **Vercel** (Recommended) - Easy Next.js deployment
2. **AWS** - Full control, scalable
3. **Docker** - Containerized, portable
4. **DigitalOcean** - Simple, affordable
5. **Heroku** - Quick setup

---

## 🔷 Vercel Deployment

### Why Vercel?

- Built for Next.js
- Automatic deployments
- Global CDN
- Zero configuration
- Free SSL
- Excellent DX

### Step 1: Prepare Repository

Ensure your code is pushed to GitHub, GitLab, or Bitbucket.

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

### Step 3: Import Project

1. Click "Add New Project"
2. Select your repository
3. Vercel auto-detects Next.js
4. Click "Import"

### Step 4: Configure Build Settings

Vercel auto-configures these (verify):

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 5: Add Environment Variables

1. In project settings → Environment Variables
2. Add all production variables:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_BUCKET_NAME=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
RESEND_API_KEY=...
FROM_EMAIL=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

3. Save variables

### Step 6: Deploy

1. Click "Deploy"
2. Wait for build (usually 2-3 minutes)
3. Vercel provides preview URL

### Step 7: Add Custom Domain

1. Go to project → Settings → Domains
2. Add your domain:
   - `yourdomain.com`
   - `www.yourdomain.com`
3. Update DNS records (Vercel provides instructions)
4. Wait for DNS propagation (5 minutes - 48 hours)
5. Vercel auto-provisions SSL

### Step 8: Set Up Database

```bash
# Push schema to production database
DATABASE_URL="production-url" npm run db:push
```

### Step 9: Verify Deployment

1. Visit `https://yourdomain.com`
2. Test all features:
   - [ ] Homepage loads
   - [ ] CRM login works
   - [ ] Bookings can be created
   - [ ] Payments work
   - [ ] Photos upload
   - [ ] Emails send
   - [ ] SMS sends

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests

To disable:
```bash
# In vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "preview": false
    }
  }
}
```

---

## ☁️ AWS Deployment

### Architecture

- **Compute**: AWS Amplify or EC2
- **Database**: RDS PostgreSQL
- **Storage**: S3
- **CDN**: CloudFront
- **Email**: SES

### Option 1: AWS Amplify (Easier)

#### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

#### Step 2: Initialize Amplify

```bash
amplify init
```

Follow prompts:
- Name: `ecoshine-pro`
- Environment: `production`
- Editor: Your choice
- App type: `javascript`
- Framework: `react`
- Source: `.`
- Distribution: `.next`
- Build: `npm run build`
- Start: `npm run start`

#### Step 3: Add Hosting

```bash
amplify add hosting
```

Select:
- Hosting with Amplify Console
- Manual deployment

#### Step 4: Deploy

```bash
amplify publish
```

### Option 2: EC2 (Advanced)

#### Step 1: Launch EC2 Instance

1. Go to AWS EC2 Console
2. Launch instance:
   - **AMI**: Ubuntu 22.04 LTS
   - **Instance type**: t3.medium (minimum)
   - **Storage**: 30 GB
   - **Security group**: Allow ports 80, 443, 22

#### Step 2: Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### Step 4: Deploy Application

```bash
# Clone repository
git clone https://github.com/iboss21/Lux-app-crm.git
cd Lux-app-crm

# Install dependencies
npm install

# Create .env.local with production variables
nano .env.local

# Build application
npm run build

# Start with PM2
pm2 start npm --name "ecoshine" -- start
pm2 save
pm2 startup
```

#### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/ecoshine
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ecoshine /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Set Up SSL

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts to get free SSL certificate.

---

## 🐳 Docker Deployment

### Step 1: Create Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_APP_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=ecoshine
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Step 3: Build and Run

```bash
# Build image
docker build -t ecoshine-pro .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Step 4: Deploy to Docker Registry

```bash
# Tag image
docker tag ecoshine-pro your-registry/ecoshine-pro:latest

# Push to registry
docker push your-registry/ecoshine-pro:latest

# Pull on production server
docker pull your-registry/ecoshine-pro:latest

# Run
docker run -p 3000:3000 --env-file .env your-registry/ecoshine-pro:latest
```

---

## 🔧 Environment Configuration

### Production Environment Variables

Create a `.env.production` file:

```env
# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Auth
NEXTAUTH_SECRET=LONG_RANDOM_STRING_HERE
NEXTAUTH_URL=https://yourdomain.com

# Stripe (LIVE KEYS)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_BUCKET_NAME=ecoshine-production

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Email
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@yourdomain.com

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### Security Best Practices

1. **Never commit secrets to git**
   ```bash
   # Add to .gitignore
   echo ".env*" >> .gitignore
   ```

2. **Use environment variable management**
   - Vercel: Built-in
   - AWS: Systems Manager Parameter Store
   - Docker: Docker Secrets

3. **Rotate secrets regularly**
   - Change NEXTAUTH_SECRET every 90 days
   - Rotate API keys quarterly

4. **Use separate environments**
   - Development
   - Staging
   - Production

---

## 🗄️ Database Migration

### Production Database Setup

#### Option 1: Managed Database (Recommended)

**Supabase:**
```bash
# Get connection string from Supabase
DATABASE_URL="postgresql://..." npm run db:push
```

**Neon:**
```bash
# Get connection string from Neon
DATABASE_URL="postgresql://..." npm run db:push
```

**AWS RDS:**
1. Create RDS PostgreSQL instance
2. Note connection details
3. Update security group to allow access
4. Run migrations

#### Option 2: Self-Hosted

```bash
# On production server
sudo -u postgres psql

# Create database
CREATE DATABASE ecoshine_production;
CREATE USER ecoshine WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ecoshine_production TO ecoshine;

# Exit
\q

# Run migrations
DATABASE_URL="postgresql://ecoshine:secure_password@localhost:5432/ecoshine_production" npm run db:push
```

### Backup Strategy

#### Automated Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backup_$TIMESTAMP.sql"
# Upload to S3
aws s3 cp "backup_$TIMESTAMP.sql" s3://your-bucket/backups/
# Clean old backups
find . -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup.sh
```

---

## 🎯 Post-Deployment

### Verify Deployment

1. **Functionality Check**
   - [ ] All pages load
   - [ ] Authentication works
   - [ ] Database connected
   - [ ] API endpoints respond
   - [ ] File uploads work
   - [ ] Emails send
   - [ ] SMS sends
   - [ ] Payments process

2. **Performance Check**
   - [ ] Page load time < 3s
   - [ ] API response time < 200ms
   - [ ] No console errors
   - [ ] No 404 errors

3. **Security Check**
   - [ ] HTTPS enabled
   - [ ] Security headers set
   - [ ] No exposed secrets
   - [ ] CORS configured correctly

### Configure Webhooks

#### Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events
4. Copy webhook secret
5. Update `STRIPE_WEBHOOK_SECRET` in environment

#### Test Webhooks

```bash
# Install Stripe CLI
stripe listen --forward-to https://yourdomain.com/api/webhooks/stripe

# Trigger test event
stripe trigger payment_intent.succeeded
```

### Set Up Monitoring

See [Monitoring](#monitoring) section below.

---

## 📊 Monitoring

### Application Monitoring

#### Vercel Analytics

Already included with Vercel deployment.

#### Sentry (Error Tracking)

1. Create Sentry account
2. Install Sentry:
   ```bash
   npm install @sentry/nextjs
   ```

3. Initialize:
   ```bash
   npx @sentry/wizard -i nextjs
   ```

4. Add to environment:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://...
   ```

### Uptime Monitoring

#### UptimeRobot

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor:
   - Type: HTTP(S)
   - URL: `https://yourdomain.com`
   - Interval: 5 minutes
3. Set up alerts (email, SMS, Slack)

### Performance Monitoring

#### Google Analytics

1. Get tracking ID from Google Analytics
2. Add to `_app.tsx`:
   ```typescript
   import Script from 'next/script'
   
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
     strategy="afterInteractive"
   />
   ```

### Log Management

#### CloudWatch (AWS)

Already configured if using AWS.

#### Papertrail

1. Sign up at [papertrailapp.com](https://papertrailapp.com)
2. Get log destination
3. Configure PM2:
   ```bash
   pm2 install pm2-papertrail
   pm2 set pm2-papertrail:host logs.papertrailapp.com
   pm2 set pm2-papertrail:port 12345
   ```

---

## 🔥 Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Solution
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

**Error: "TypeScript errors"**
```bash
# Solution
npx tsc --noEmit
# Fix reported errors
```

### Database Connection Issues

**Error: "Connection refused"**
- Check DATABASE_URL is correct
- Verify database is running
- Check firewall rules
- Verify IP whitelist (cloud databases)

### Environment Variable Issues

**Error: "undefined environment variable"**
- Verify all variables are set in deployment platform
- Check variable names match exactly
- Ensure NEXT_PUBLIC_ prefix for client-side variables
- Redeploy after adding variables

### SSL Certificate Issues

**Error: "Certificate expired"**
```bash
# Renew with certbot
sudo certbot renew
sudo systemctl reload nginx
```

### Performance Issues

**Slow page loads:**
1. Enable caching
2. Optimize images
3. Use CDN
4. Check database queries
5. Monitor server resources

### Payment Issues

**Stripe payments failing:**
- Verify using live keys (not test)
- Check webhook secret
- Verify webhook endpoint accessible
- Check Stripe dashboard for errors

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Docker Docs](https://docs.docker.com/)

---

*For API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)*

*For user guides, see [USER_GUIDE.md](USER_GUIDE.md)*

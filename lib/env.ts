// Centralized environment handling - no hard crashes when vars missing
// Returns defaults or undefined gracefully

function getEnv(key: string, defaultValue?: string): string | undefined {
  const value = process.env[key]
  if (!value && defaultValue !== undefined) {
    return defaultValue
  }
  return value
}

function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    console.warn(`⚠️ Environment variable ${key} is not set`)
    return ''
  }
  return value
}

export const env = {
  // Database
  DATABASE_URL: getEnv('DATABASE_URL'),
  
  // Auth
  NEXTAUTH_SECRET: getEnv('NEXTAUTH_SECRET'),
  NEXTAUTH_URL: getEnv('NEXTAUTH_URL', 'http://localhost:3000'),
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
  
  // Stripe
  STRIPE_SECRET_KEY: getEnv('STRIPE_SECRET_KEY'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: getEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  STRIPE_WEBHOOK_SECRET: getEnv('STRIPE_WEBHOOK_SECRET'),
  
  // Email (Resend)
  RESEND_API_KEY: getEnv('RESEND_API_KEY'),
  FROM_EMAIL: getEnv('FROM_EMAIL', 'bookings@ecoshine.pro'),
  
  // SMS (Twilio)
  TWILIO_ACCOUNT_SID: getEnv('TWILIO_ACCOUNT_SID'),
  TWILIO_AUTH_TOKEN: getEnv('TWILIO_AUTH_TOKEN'),
  TWILIO_PHONE_NUMBER: getEnv('TWILIO_PHONE_NUMBER'),
  
  // Maps (Google)
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: getEnv('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'),
  
  // Storage (AWS S3)
  AWS_ACCESS_KEY_ID: getEnv('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: getEnv('AWS_SECRET_ACCESS_KEY'),
  AWS_REGION: getEnv('AWS_REGION', 'us-east-1'),
  AWS_BUCKET_NAME: getEnv('AWS_BUCKET_NAME', 'theluxapp-s3'),
  
  // OpenAI (for future AI features)
  OPENAI_API_KEY: getEnv('OPENAI_API_KEY'),
  
  // App URL
  NEXT_PUBLIC_APP_URL: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  
  // Node environment
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  
  // Check if database is configured
  isDatabaseConfigured(): boolean {
    return Boolean(this.DATABASE_URL)
  },
  
  // Check if Stripe is configured
  isStripeConfigured(): boolean {
    return Boolean(this.STRIPE_SECRET_KEY && this.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  },
  
  // Check if Twilio is configured
  isTwilioConfigured(): boolean {
    return Boolean(this.TWILIO_ACCOUNT_SID && this.TWILIO_AUTH_TOKEN)
  },
  
  // Check if AWS is configured
  isAWSConfigured(): boolean {
    return Boolean(this.AWS_ACCESS_KEY_ID && this.AWS_SECRET_ACCESS_KEY)
  },
}

export default env

import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  decimal, 
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================
// ENUMS
// ============================================

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending', 'assigned', 'en-route', 'in-progress', 'completed', 'cancelled'
])

export const userRoleEnum = pgEnum('user_role', [
  'admin', 'manager', 'csr', 'technician', 'customer'
])

export const cleanerRoleEnum = pgEnum('cleaner_role', [
  'cleaner', 'lead-cleaner', 'supervisor'
])

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft', 'sent', 'paid', 'overdue', 'cancelled'
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', 'completed', 'failed', 'refunded'
])

export const membershipTierEnum = pgEnum('membership_tier', [
  'standard', 'premium', 'vip'
])

export const leadStatusEnum = pgEnum('lead_status', [
  'new', 'contacted', 'qualified', 'proposal-sent', 'won', 'lost'
])

export const leadTemperatureEnum = pgEnum('lead_temperature', [
  'hot', 'warm', 'cold'
])

export const photoTypeEnum = pgEnum('photo_type', [
  'before', 'during', 'after'
])

export const notificationTypeEnum = pgEnum('notification_type', [
  'info', 'success', 'warning', 'error'
])

export const commissionTypeEnum = pgEnum('commission_type', [
  'percentage', 'flat', 'tiered', 'bonus', 'spiff'
])

export const payoutStatusEnum = pgEnum('payout_status', [
  'pending', 'processing', 'paid', 'failed'
])

export const frequencyEnum = pgEnum('frequency', [
  'one-time', 'weekly', 'bi-weekly', 'monthly'
])

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active', 'paused', 'cancelled'
])

export const campaignStatusEnum = pgEnum('campaign_status', [
  'draft', 'scheduled', 'sending', 'completed'
])

export const routeStatusEnum = pgEnum('route_status', [
  'planned', 'in-progress', 'completed'
])

export const routeStopStatusEnum = pgEnum('route_stop_status', [
  'pending', 'arrived', 'completed', 'skipped'
])

export const vacationStatusEnum = pgEnum('vacation_status', [
  'pending', 'approved', 'denied'
])

export const vacationTypeEnum = pgEnum('vacation_type', [
  'vacation', 'sick', 'personal'
])

export const referralStatusEnum = pgEnum('referral_status', [
  'pending', 'converted', 'rewarded'
])

export const automationStatusEnum = pgEnum('automation_status', [
  'pending', 'running', 'completed', 'failed'
])

// ============================================
// CORE ENTITIES
// ============================================

// Customers table
export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  address: text('address'),
  aptUnit: text('apt_unit'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  buildingName: text('building_name'),
  source: text('source').default('website'),
  tags: text('tags').array(),
  lifetimeValue: decimal('lifetime_value', { precision: 10, scale: 2 }).default('0'),
  membershipTier: membershipTierEnum('membership_tier').default('standard'),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('customers_email_idx').on(table.email),
}))

// Bookings table (ALL fields from website form + CRM fields)
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id),
  assignedTo: uuid('assigned_to').references(() => cleaners.id),
  
  // Service Details
  serviceType: text('service_type'),
  propertyType: text('property_type'),
  squareFootage: integer('square_footage'),
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  floors: integer('floors'),
  
  // Occupancy
  isOccupied: boolean('is_occupied').default(true),
  numberOfOccupants: integer('number_of_occupants'),
  hasPets: boolean('has_pets').default(false),
  petType: text('pet_type'),
  petCount: integer('pet_count'),
  hasChildren: boolean('has_children').default(false),
  childrenAges: text('children_ages'),
  
  // Cleanliness
  cleanlinessLevel: text('cleanliness_level'),
  lastProfessionalCleaning: text('last_professional_cleaning'),
  clutterLevel: text('clutter_level'),
  
  // Additional Services
  additionalServices: text('additional_services').array(),
  
  // Special Requirements
  hasAllergies: boolean('has_allergies').default(false),
  allergyDetails: text('allergy_details'),
  preferredProducts: text('preferred_products'),
  focusAreas: text('focus_areas'),
  avoidAreas: text('avoid_areas'),
  valuableItems: text('valuable_items'),
  
  // Access
  accessMethod: text('access_method'),
  accessInstructions: text('access_instructions'),
  parkingAvailable: boolean('parking_available').default(true),
  parkingInstructions: text('parking_instructions'),
  hasSecuritySystem: boolean('has_security_system').default(false),
  securityDetails: text('security_details'),
  
  // Schedule
  frequency: frequencyEnum('frequency').default('one-time'),
  preferredDay: text('preferred_day'),
  preferredTime: text('preferred_time'),
  specificDate: timestamp('specific_date'),
  specificTime: text('specific_time'),
  flexibleTiming: boolean('flexible_timing').default(false),
  sameCleaner: boolean('same_cleaner').default(false),
  
  // Pricing
  budgetRange: text('budget_range'),
  estimatedPrice: decimal('estimated_price', { precision: 10, scale: 2 }),
  actualPrice: decimal('actual_price', { precision: 10, scale: 2 }),
  paymentMethod: text('payment_method'),
  interestedInDiscount: boolean('interested_in_discount').default(false),
  
  // Status
  status: bookingStatusEnum('status').default('pending'),
  
  // Metadata
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  notes: text('notes'),
  
  // Recurring
  isRecurring: boolean('is_recurring').default(false),
  recurringParentId: uuid('recurring_parent_id'),
  nextRecurringDate: timestamp('next_recurring_date'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  customerIdx: index('bookings_customer_idx').on(table.customerId),
  assignedToIdx: index('bookings_assigned_to_idx').on(table.assignedTo),
  statusIdx: index('bookings_status_idx').on(table.status),
  dateIdx: index('bookings_date_idx').on(table.specificDate),
}))

// Cleaners table
export const cleaners = pgTable('cleaners', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  password: text('password').notNull(),
  avatar: text('avatar'),
  role: cleanerRoleEnum('role').default('cleaner'),
  skills: text('skills').array(),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }),
  commissionType: commissionTypeEnum('commission_type').default('percentage'),
  isActive: boolean('is_active').default(true),
  regionId: uuid('region_id').references(() => regions.id),
  currentLat: decimal('current_lat', { precision: 10, scale: 8 }),
  currentLng: decimal('current_lng', { precision: 11, scale: 8 }),
  lastPingAt: timestamp('last_ping_at'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zip_code'),
  emergencyContact: text('emergency_contact'),
  emergencyPhone: text('emergency_phone'),
  hireDate: timestamp('hire_date'),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  totalJobs: integer('total_jobs').default(0),
  totalRevenue: decimal('total_revenue', { precision: 10, scale: 2 }).default('0'),
  bankAccount: text('bank_account'),
  taxId: text('tax_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('cleaners_email_idx').on(table.email),
  regionIdx: index('cleaners_region_idx').on(table.regionId),
}))

// Regions table
export const regions = pgTable('regions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  zipCodes: text('zip_codes').array(),
  serviceArea: jsonb('service_area'), // GeoJSON polygon
  managerId: uuid('manager_id'),
  isActive: boolean('is_active').default(true),
  hourlyMultiplier: decimal('hourly_multiplier', { precision: 4, scale: 2 }).default('1.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================
// FIELD SERVICE
// ============================================

// Time Tracking table
export const timeTracking = pgTable('time_tracking', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id').references(() => bookings.id),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  clockIn: timestamp('clock_in'),
  clockOut: timestamp('clock_out'),
  clockInLat: decimal('clock_in_lat', { precision: 10, scale: 8 }),
  clockInLng: decimal('clock_in_lng', { precision: 11, scale: 8 }),
  clockOutLat: decimal('clock_out_lat', { precision: 10, scale: 8 }),
  clockOutLng: decimal('clock_out_lng', { precision: 11, scale: 8 }),
  travelTime: integer('travel_time'), // minutes
  workTime: integer('work_time'), // minutes
  totalTime: integer('total_time'), // minutes
  breakTime: integer('break_time'), // minutes
  overtimeMinutes: integer('overtime_minutes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  bookingIdx: index('time_tracking_booking_idx').on(table.bookingId),
  cleanerIdx: index('time_tracking_cleaner_idx').on(table.cleanerId),
}))

// Job Photos table
export const jobPhotos = pgTable('job_photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id').references(() => bookings.id),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  photoType: photoTypeEnum('photo_type').notNull(),
  photoUrl: text('photo_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  caption: text('caption'),
  location: text('location'), // room name
  orderIndex: integer('order_index'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  bookingIdx: index('job_photos_booking_idx').on(table.bookingId),
}))

// Equipment table (track installed equipment at customer sites)
export const equipment = pgTable('equipment', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id),
  type: text('type'),
  brand: text('brand'),
  model: text('model'),
  serialNumber: text('serial_number'),
  installDate: timestamp('install_date'),
  warrantyExpDate: timestamp('warranty_exp_date'),
  location: text('location'),
  condition: text('condition'),
  maintenanceSchedule: text('maintenance_schedule'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Equipment Service History
export const equipmentServiceHistory = pgTable('equipment_service_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  equipmentId: uuid('equipment_id').references(() => equipment.id),
  bookingId: uuid('booking_id').references(() => bookings.id),
  serviceType: text('service_type'),
  notes: text('notes'),
  nextServiceDate: timestamp('next_service_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Inventory table (cleaning supplies)
export const inventory = pgTable('inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  sku: text('sku'),
  category: text('category'),
  quantity: integer('quantity').default(0),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  price: decimal('price', { precision: 10, scale: 2 }),
  location: text('location'), // warehouse, truck-1, truck-2
  reorderLevel: integer('reorder_level'),
  supplierId: uuid('supplier_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Inventory Transactions
export const inventoryTransactions = pgTable('inventory_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemId: uuid('item_id').references(() => inventory.id),
  bookingId: uuid('booking_id').references(() => bookings.id),
  employeeId: uuid('employee_id'),
  type: text('type'), // used, restocked, adjustment
  quantity: integer('quantity'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Trucks table
export const trucks = pgTable('trucks', {
  id: uuid('id').defaultRandom().primaryKey(),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  make: text('make'),
  model: text('model'),
  year: integer('year'),
  licensePlate: text('license_plate'),
  currentLat: decimal('current_lat', { precision: 10, scale: 8 }),
  currentLng: decimal('current_lng', { precision: 11, scale: 8 }),
  lastPingAt: timestamp('last_ping_at'),
  inventoryItems: jsonb('inventory_items'), // JSON array of stock levels
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================
// SCHEDULING & ROUTING
// ============================================

// Routes table
export const routes = pgTable('routes', {
  id: uuid('id').defaultRandom().primaryKey(),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  date: timestamp('date'),
  jobs: uuid('jobs').array(), // booking IDs in order
  optimizedOrder: uuid('optimized_order').array(), // booking IDs after optimization
  totalDistance: decimal('total_distance', { precision: 10, scale: 2 }),
  totalTime: integer('total_time'), // minutes
  status: routeStatusEnum('status').default('planned'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Route Stops
export const routeStops = pgTable('route_stops', {
  id: uuid('id').defaultRandom().primaryKey(),
  routeId: uuid('route_id').references(() => routes.id),
  bookingId: uuid('booking_id').references(() => bookings.id),
  sequence: integer('sequence'),
  eta: timestamp('eta'),
  actualArrival: timestamp('actual_arrival'),
  status: routeStopStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Cleaner Availability
export const cleanerAvailability = pgTable('cleaner_availability', {
  id: uuid('id').defaultRandom().primaryKey(),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  date: timestamp('date'),
  startTime: text('start_time'),
  endTime: text('end_time'),
  isAvailable: boolean('is_available').default(true),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Vacations
export const vacations = pgTable('vacations', {
  id: uuid('id').defaultRandom().primaryKey(),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  status: vacationStatusEnum('status').default('pending'),
  type: vacationTypeEnum('type').default('vacation'),
  notes: text('notes'),
  approvedBy: uuid('approved_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================
// PRICING & PAYMENTS
// ============================================

// Price Books
export const priceBooks = pgTable('price_books', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  isActive: boolean('is_active').default(true),
  regionId: uuid('region_id').references(() => regions.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Price Book Items
export const priceBookItems = pgTable('price_book_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  priceBookId: uuid('price_book_id').references(() => priceBooks.id),
  serviceName: text('service_name'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }),
  timeBasedRate: decimal('time_based_rate', { precision: 10, scale: 2 }),
  weekendMultiplier: decimal('weekend_multiplier', { precision: 4, scale: 2 }),
  rushMultiplier: decimal('rush_multiplier', { precision: 4, scale: 2 }),
  tierPricing: jsonb('tier_pricing'), // JSON: small/medium/large property rates
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Dynamic Pricing Rules
export const dynamicPricingRules = pgTable('dynamic_pricing_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  conditions: jsonb('conditions'),
  multiplier: decimal('multiplier', { precision: 4, scale: 2 }),
  priority: integer('priority'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Invoices
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id').references(() => bookings.id),
  customerId: uuid('customer_id').references(() => customers.id),
  invoiceNumber: text('invoice_number').unique(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }),
  tax: decimal('tax', { precision: 10, scale: 2 }),
  discount: decimal('discount', { precision: 10, scale: 2 }),
  total: decimal('total', { precision: 10, scale: 2 }),
  status: invoiceStatusEnum('status').default('draft'),
  dueDate: timestamp('due_date'),
  paidDate: timestamp('paid_date'),
  stripeInvoiceId: text('stripe_invoice_id'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  invoiceNumberIdx: uniqueIndex('invoices_number_idx').on(table.invoiceNumber),
  customerIdx: index('invoices_customer_idx').on(table.customerId),
}))

// Invoice Items
export const invoiceItems = pgTable('invoice_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceId: uuid('invoice_id').references(() => invoices.id),
  description: text('description'),
  quantity: integer('quantity').default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
  total: decimal('total', { precision: 10, scale: 2 }),
})

// Payments
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceId: uuid('invoice_id').references(() => invoices.id),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  method: text('method'), // card, cash, check, ach
  stripePaymentId: text('stripe_payment_id'),
  status: paymentStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Payment Methods
export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id),
  stripePaymentMethodId: text('stripe_payment_method_id'),
  type: text('type'),
  last4: text('last4'),
  expMonth: integer('exp_month'),
  expYear: integer('exp_year'),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Subscriptions (recurring memberships)
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id),
  planId: uuid('plan_id').references(() => membershipPlans.id),
  status: subscriptionStatusEnum('status').default('active'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  billingCycle: text('billing_cycle'),
  discountPercent: decimal('discount_percent', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Membership Plans
export const membershipPlans = pgTable('membership_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }),
  interval: text('interval'), // weekly, bi-weekly, monthly
  benefits: text('benefits').array(),
  cleaningsPerMonth: integer('cleanings_per_month'),
  rolloverUnused: boolean('rollover_unused').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Commissions
export const commissions = pgTable('commissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  bookingId: uuid('booking_id').references(() => bookings.id),
  type: commissionTypeEnum('type').default('percentage'),
  rate: decimal('rate', { precision: 5, scale: 2 }),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  status: text('status').default('pending'), // pending, approved, paid
  paidDate: timestamp('paid_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Payouts
export const payouts = pgTable('payouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  status: payoutStatusEnum('status').default('pending'),
  paidDate: timestamp('paid_date'),
  paymentMethod: text('payment_method'), // ach, check, stripe
  transactionId: text('transaction_id'),
  breakdown: jsonb('breakdown'), // JSON: commissions, bonuses, deductions
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================
// CUSTOMER ENGAGEMENT
// ============================================

// Customer Reviews
export const customerReviews = pgTable('customer_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id').references(() => bookings.id),
  customerId: uuid('customer_id').references(() => customers.id),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  rating: integer('rating'),
  comment: text('comment'),
  wouldRecommend: boolean('would_recommend'),
  responseFromCleaner: text('response_from_cleaner'),
  responseFromCompany: text('response_from_company'),
  isPublic: boolean('is_public').default(true),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Referrals
export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  referrerId: uuid('referrer_id').references(() => customers.id),
  referredId: uuid('referred_id').references(() => customers.id),
  status: referralStatusEnum('status').default('pending'),
  code: text('code'),
  rewardType: text('reward_type'), // discount, cash, free-service
  rewardAmount: decimal('reward_amount', { precision: 10, scale: 2 }),
  convertedAt: timestamp('converted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Review Requests
export const reviewRequests = pgTable('review_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id').references(() => bookings.id),
  customerId: uuid('customer_id').references(() => customers.id),
  sentDate: timestamp('sent_date'),
  completedDate: timestamp('completed_date'),
  platform: text('platform'), // google, yelp, facebook
  reviewUrl: text('review_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Customer Notes
export const customerNotes = pgTable('customer_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id),
  createdBy: uuid('created_by'),
  content: text('content'),
  isPinned: boolean('is_pinned').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Leads
export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  source: text('source'),
  status: leadStatusEnum('status').default('new'),
  score: integer('score'), // 1-100, for AI scoring
  temperature: leadTemperatureEnum('temperature').default('cold'),
  assignedTo: uuid('assigned_to'),
  notes: text('notes'),
  lastContactDate: timestamp('last_contact_date'),
  lostReason: text('lost_reason'),
  wonRevenue: decimal('won_revenue', { precision: 10, scale: 2 }),
  convertedAt: timestamp('converted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Lead Activities
export const leadActivities = pgTable('lead_activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  leadId: uuid('lead_id').references(() => leads.id),
  type: text('type'), // call, email, meeting, note
  description: text('description'),
  createdBy: uuid('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================
// COMMUNICATION
// ============================================

// Conversations
export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  participants: uuid('participants').array(),
  type: text('type'), // internal, customer, cleaner
  lastMessage: text('last_message'),
  lastMessageAt: timestamp('last_message_at'),
  unreadCount: integer('unread_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Messages
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  senderId: uuid('sender_id'),
  content: text('content'),
  type: text('type').default('text'), // text, image, file
  readBy: uuid('read_by').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Email Templates
export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  subject: text('subject'),
  body: text('body'), // HTML
  variables: text('variables').array(),
  category: text('category'), // confirmation, reminder, invoice, follow-up
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// SMS Logs
export const smsLogs = pgTable('sms_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  to: text('to'),
  from: text('from'),
  body: text('body'),
  direction: text('direction'), // inbound, outbound
  status: text('status'), // queued, sent, delivered, failed
  twilioSid: text('twilio_sid'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Call Logs
export const callLogs = pgTable('call_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  userId: uuid('user_id'), // CSR
  direction: text('direction'), // inbound, outbound
  duration: integer('duration'), // seconds
  outcome: text('outcome'),
  recordingUrl: text('recording_url'),
  transcription: text('transcription'),
  sentiment: text('sentiment'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Email Logs
export const emailLogs = pgTable('email_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  to: text('to'),
  from: text('from'),
  subject: text('subject'),
  templateId: uuid('template_id').references(() => emailTemplates.id),
  status: text('status'), // queued, sent, delivered, opened, clicked, bounced
  openedAt: timestamp('opened_at'),
  clickedAt: timestamp('clicked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================
// AUTOMATION & AI
// ============================================

// Automations
export const automations = pgTable('automations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  trigger: text('trigger'), // booking.created, invoice.paid, etc.
  conditions: jsonb('conditions'),
  actions: jsonb('actions'),
  isActive: boolean('is_active').default(true),
  executionCount: integer('execution_count').default(0),
  lastExecutedAt: timestamp('last_executed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Workflow Executions
export const workflowExecutions = pgTable('workflow_executions', {
  id: uuid('id').defaultRandom().primaryKey(),
  automationId: uuid('automation_id').references(() => automations.id),
  triggerData: jsonb('trigger_data'),
  status: automationStatusEnum('status').default('pending'),
  logs: jsonb('logs'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// AI Chat Sessions (for future AI chatbot)
export const aiChatSessions = pgTable('ai_chat_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id),
  leadId: uuid('lead_id').references(() => leads.id),
  messages: jsonb('messages'),
  context: jsonb('context'),
  status: text('status').default('open'), // open, closed, transferred
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// AI Lead Scores (for predictive scoring)
export const aiLeadScores = pgTable('ai_lead_scores', {
  id: uuid('id').defaultRandom().primaryKey(),
  leadId: uuid('lead_id').references(() => leads.id),
  score: integer('score'), // 0-100
  factors: jsonb('factors'),
  modelVersion: text('model_version'),
  confidence: decimal('confidence', { precision: 5, scale: 4 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// AI Insights (general AI-generated insights)
export const aiInsights = pgTable('ai_insights', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: text('type'), // churn-risk, upsell-opportunity, revenue-forecast
  entityType: text('entity_type'),
  entityId: uuid('entity_id'),
  insight: jsonb('insight'),
  priority: integer('priority'),
  dismissedBy: uuid('dismissed_by'),
  dismissedAt: timestamp('dismissed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================
// MARKETING
// ============================================

// Campaigns
export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  type: text('type'), // email, sms, combo
  channel: text('channel'),
  status: campaignStatusEnum('status').default('draft'),
  targetAudience: jsonb('target_audience'), // JSON filters
  content: jsonb('content'), // template + data
  scheduledDate: timestamp('scheduled_date'),
  sentCount: integer('sent_count').default(0),
  openedCount: integer('opened_count').default(0),
  clickedCount: integer('clicked_count').default(0),
  convertedCount: integer('converted_count').default(0),
  revenue: decimal('revenue', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
})

// Campaign Recipients
export const campaignRecipients = pgTable('campaign_recipients', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  customerId: uuid('customer_id').references(() => customers.id),
  status: text('status').default('pending'), // pending, sent, opened, clicked, converted
  sentAt: timestamp('sent_at'),
  openedAt: timestamp('opened_at'),
  clickedAt: timestamp('clicked_at'),
  convertedAt: timestamp('converted_at'),
})

// Coupons
export const coupons = pgTable('coupons', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  description: text('description'),
  type: text('type'), // percentage, fixed
  amount: decimal('amount', { precision: 10, scale: 2 }),
  minPurchase: decimal('min_purchase', { precision: 10, scale: 2 }),
  maxDiscount: decimal('max_discount', { precision: 10, scale: 2 }),
  expiresAt: timestamp('expires_at'),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Coupon Usages
export const couponUsages = pgTable('coupon_usages', {
  id: uuid('id').defaultRandom().primaryKey(),
  couponId: uuid('coupon_id').references(() => coupons.id),
  customerId: uuid('customer_id').references(() => customers.id),
  bookingId: uuid('booking_id').references(() => bookings.id),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================
// ANALYTICS & REPORTING
// ============================================

// Reports (saved custom reports)
export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  type: text('type'), // revenue, bookings, performance
  config: jsonb('config'), // JSON filters, grouping
  createdBy: uuid('created_by'),
  isScheduled: boolean('is_scheduled').default(false),
  scheduleFrequency: text('schedule_frequency'),
  lastRunAt: timestamp('last_run_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Dashboards (custom dashboard layouts)
export const dashboards = pgTable('dashboards', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  layout: jsonb('layout'), // JSON widget positions
  widgets: jsonb('widgets'), // JSON configs
  ownerId: uuid('owner_id'),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// KPIs (key performance indicators tracking)
export const kpis = pgTable('kpis', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  metric: text('metric'),
  target: decimal('target', { precision: 10, scale: 2 }),
  actual: decimal('actual', { precision: 10, scale: 2 }),
  period: timestamp('period'),
  trend: text('trend'), // up, down, flat
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================
// SYSTEM & ADMIN
// ============================================

// Admin Users
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: userRoleEnum('role').default('admin'),
  permissions: jsonb('permissions'),
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true),
  requires2FA: boolean('requires_2fa').default(false),
  twoFactorSecret: text('two_factor_secret'),
  lastLogin: timestamp('last_login'),
  loginAttempts: integer('login_attempts').default(0),
  lockedUntil: timestamp('locked_until'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('admin_users_email_idx').on(table.email),
}))

// Sessions
export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  userType: text('user_type'), // admin, customer, cleaner
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// CRM Settings
export const crmSettings = pgTable('crm_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  type: text('type').default('text'), // text, number, boolean, json, secret
  category: text('category').default('general'), // general, payment, notification, integration
  description: text('description'),
  isSecret: boolean('is_secret').default(false),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Activity Logs (audit trail)
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  userType: text('user_type'),
  action: text('action'), // created, updated, deleted, login
  entity: text('entity'), // booking, customer, invoice, etc.
  entityId: uuid('entity_id'),
  changes: jsonb('changes'), // JSON diff
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  entityIdx: index('activity_logs_entity_idx').on(table.entity, table.entityId),
  userIdx: index('activity_logs_user_idx').on(table.userId),
}))

// Notifications (in-app notifications)
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  userType: text('user_type'),
  title: text('title'),
  message: text('message'),
  type: notificationTypeEnum('type').default('info'),
  isRead: boolean('is_read').default(false),
  actionUrl: text('action_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Webhook Logs (for Stripe, Twilio, etc.)
export const webhookLogs = pgTable('webhook_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  provider: text('provider'),
  event: text('event'),
  payload: jsonb('payload'),
  status: text('status').default('pending'), // pending, processed, failed
  retryCount: integer('retry_count').default(0),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Integrations
export const integrations = pgTable('integrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  provider: text('provider'), // stripe, google, twilio, quickbooks
  apiKey: text('api_key'),
  apiSecret: text('api_secret'),
  config: jsonb('config'),
  isActive: boolean('is_active').default(true),
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Tasks (internal task management)
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  assignedTo: uuid('assigned_to'),
  dueDate: timestamp('due_date'),
  status: text('status').default('todo'), // todo, in-progress, done
  priority: text('priority').default('medium'), // low, medium, high
  linkedEntity: text('linked_entity'), // booking, customer, lead
  linkedEntityId: uuid('linked_entity_id'),
  createdBy: uuid('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
})

// Projects (for larger multi-job projects)
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  customerId: uuid('customer_id').references(() => customers.id),
  status: text('status').default('active'),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  spent: decimal('spent', { precision: 10, scale: 2 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Project Tasks
export const projectTasks = pgTable('project_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id),
  taskId: uuid('task_id').references(() => tasks.id),
  order: integer('order'),
})

// Tags
export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  color: text('color'),
  category: text('category'), // customer, booking, cleaner
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Entity Tags (polymorphic tagging)
export const entityTags = pgTable('entity_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  entityType: text('entity_type'), // customer, booking, cleaner
  entityId: uuid('entity_id'),
  tagId: uuid('tag_id').references(() => tags.id),
})

// Geofences
export const geofences = pgTable('geofences', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  centerLat: decimal('center_lat', { precision: 10, scale: 8 }),
  centerLng: decimal('center_lng', { precision: 11, scale: 8 }),
  radius: integer('radius'), // meters
  type: text('type'), // arrival, departure
  triggers: jsonb('triggers'), // JSON actions
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Geofence Events
export const geofenceEvents = pgTable('geofence_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  geofenceId: uuid('geofence_id').references(() => geofences.id),
  cleanerId: uuid('cleaner_id').references(() => cleaners.id),
  type: text('type'), // entered, exited
  timestamp: timestamp('timestamp'),
  location: jsonb('location'), // lat, lng
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// KB Articles (knowledge base for internal docs)
export const kbArticles = pgTable('kb_articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content'), // markdown
  category: text('category'),
  tags: text('tags').array(),
  views: integer('views').default(0),
  helpfulCount: integer('helpful_count').default(0),
  notHelpfulCount: integer('not_helpful_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// KB Categories
export const kbCategories = pgTable('kb_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  parentId: uuid('parent_id'),
  icon: text('icon'),
  orderIndex: integer('order_index'),
})

// ============================================
// RELATIONS
// ============================================

export const customersRelations = relations(customers, ({ many }) => ({
  bookings: many(bookings),
  invoices: many(invoices),
  reviews: many(customerReviews),
  notes: many(customerNotes),
  paymentMethods: many(paymentMethods),
  subscriptions: many(subscriptions),
}))

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(customers, {
    fields: [bookings.customerId],
    references: [customers.id],
  }),
  cleaner: one(cleaners, {
    fields: [bookings.assignedTo],
    references: [cleaners.id],
  }),
  timeTracking: many(timeTracking),
  photos: many(jobPhotos),
  invoice: many(invoices),
  reviews: many(customerReviews),
}))

export const cleanersRelations = relations(cleaners, ({ one, many }) => ({
  region: one(regions, {
    fields: [cleaners.regionId],
    references: [regions.id],
  }),
  bookings: many(bookings),
  timeTracking: many(timeTracking),
  photos: many(jobPhotos),
  commissions: many(commissions),
  payouts: many(payouts),
}))

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  booking: one(bookings, {
    fields: [invoices.bookingId],
    references: [bookings.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  items: many(invoiceItems),
  payments: many(payments),
}))

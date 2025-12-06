import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { bookings, customers } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Booking creation schema
const bookingSchema = z.object({
  // Customer info
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  aptUnit: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  buildingName: z.string().optional(),
  
  // Service Details
  serviceType: z.string().optional(),
  propertyType: z.string().optional(),
  squareFootage: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  floors: z.number().optional(),
  
  // Occupancy
  isOccupied: z.boolean().optional(),
  numberOfOccupants: z.number().optional(),
  hasPets: z.boolean().optional(),
  petType: z.string().optional(),
  petCount: z.number().optional(),
  hasChildren: z.boolean().optional(),
  childrenAges: z.string().optional(),
  
  // Cleanliness
  cleanlinessLevel: z.string().optional(),
  lastProfessionalCleaning: z.string().optional(),
  clutterLevel: z.string().optional(),
  
  // Additional Services
  additionalServices: z.array(z.string()).optional(),
  
  // Special Requirements
  hasAllergies: z.boolean().optional(),
  allergyDetails: z.string().optional(),
  preferredProducts: z.string().optional(),
  focusAreas: z.string().optional(),
  avoidAreas: z.string().optional(),
  valuableItems: z.string().optional(),
  
  // Access
  accessMethod: z.string().optional(),
  accessInstructions: z.string().optional(),
  parkingAvailable: z.boolean().optional(),
  parkingInstructions: z.string().optional(),
  hasSecuritySystem: z.boolean().optional(),
  securityDetails: z.string().optional(),
  
  // Schedule
  frequency: z.enum(['one-time', 'weekly', 'bi-weekly', 'monthly']).optional(),
  preferredDay: z.string().optional(),
  preferredTime: z.string().optional(),
  specificDate: z.string().optional(),
  specificTime: z.string().optional(),
  flexibleTiming: z.boolean().optional(),
  sameCleaner: z.boolean().optional(),
  
  // Pricing
  budgetRange: z.string().optional(),
  estimatedPrice: z.string().optional(),
  paymentMethod: z.string().optional(),
  interestedInDiscount: z.boolean().optional(),
  
  // UTM
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  
  // Notes
  notes: z.string().optional(),
})

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    const db = getDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    const body = await request.json()
    const validatedData = bookingSchema.parse(body)
    
    // Check if customer exists, create if not
    let customerId: string
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, validatedData.email))
      .limit(1)
    
    if (existingCustomer.length > 0) {
      customerId = existingCustomer[0].id
      // Update customer info
      await db
        .update(customers)
        .set({
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          phone: validatedData.phone,
          address: validatedData.address,
          aptUnit: validatedData.aptUnit,
          city: validatedData.city,
          state: validatedData.state,
          zipCode: validatedData.zipCode,
          buildingName: validatedData.buildingName,
          updatedAt: new Date(),
        })
        .where(eq(customers.id, customerId))
    } else {
      // Create new customer
      const newCustomer = await db
        .insert(customers)
        .values({
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address,
          aptUnit: validatedData.aptUnit,
          city: validatedData.city,
          state: validatedData.state,
          zipCode: validatedData.zipCode,
          buildingName: validatedData.buildingName,
          source: validatedData.utmSource || 'website',
        })
        .returning({ id: customers.id })
      
      customerId = newCustomer[0].id
    }
    
    // Create booking
    const newBooking = await db
      .insert(bookings)
      .values({
        customerId,
        serviceType: validatedData.serviceType,
        propertyType: validatedData.propertyType,
        squareFootage: validatedData.squareFootage,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        floors: validatedData.floors,
        isOccupied: validatedData.isOccupied,
        numberOfOccupants: validatedData.numberOfOccupants,
        hasPets: validatedData.hasPets,
        petType: validatedData.petType,
        petCount: validatedData.petCount,
        hasChildren: validatedData.hasChildren,
        childrenAges: validatedData.childrenAges,
        cleanlinessLevel: validatedData.cleanlinessLevel,
        lastProfessionalCleaning: validatedData.lastProfessionalCleaning,
        clutterLevel: validatedData.clutterLevel,
        additionalServices: validatedData.additionalServices,
        hasAllergies: validatedData.hasAllergies,
        allergyDetails: validatedData.allergyDetails,
        preferredProducts: validatedData.preferredProducts,
        focusAreas: validatedData.focusAreas,
        avoidAreas: validatedData.avoidAreas,
        valuableItems: validatedData.valuableItems,
        accessMethod: validatedData.accessMethod,
        accessInstructions: validatedData.accessInstructions,
        parkingAvailable: validatedData.parkingAvailable,
        parkingInstructions: validatedData.parkingInstructions,
        hasSecuritySystem: validatedData.hasSecuritySystem,
        securityDetails: validatedData.securityDetails,
        frequency: validatedData.frequency as 'one-time' | 'weekly' | 'bi-weekly' | 'monthly' | undefined,
        preferredDay: validatedData.preferredDay,
        preferredTime: validatedData.preferredTime,
        specificDate: validatedData.specificDate ? new Date(validatedData.specificDate) : undefined,
        specificTime: validatedData.specificTime,
        flexibleTiming: validatedData.flexibleTiming,
        sameCleaner: validatedData.sameCleaner,
        budgetRange: validatedData.budgetRange,
        estimatedPrice: validatedData.estimatedPrice,
        paymentMethod: validatedData.paymentMethod,
        interestedInDiscount: validatedData.interestedInDiscount,
        utmSource: validatedData.utmSource,
        utmMedium: validatedData.utmMedium,
        utmCampaign: validatedData.utmCampaign,
        notes: validatedData.notes,
        status: 'pending',
      })
      .returning()
    
    return NextResponse.json({
      success: true,
      booking: newBooking[0],
      customerId,
      message: 'Booking created successfully',
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating booking:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// GET - List bookings
export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let allBookings
    
    if (status) {
      allBookings = await db
        .select()
        .from(bookings)
        .where(eq(bookings.status, status as 'pending' | 'assigned' | 'en-route' | 'in-progress' | 'completed' | 'cancelled'))
        .limit(limit)
        .offset(offset)
    } else {
      allBookings = await db
        .select()
        .from(bookings)
        .limit(limit)
        .offset(offset)
    }
    
    return NextResponse.json({
      success: true,
      bookings: allBookings,
      count: allBookings.length,
    })
    
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

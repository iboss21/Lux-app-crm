import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { timeTracking, bookings } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.userType !== 'cleaner') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { bookingId, lat, lng } = await request.json()
    
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }
    
    const db = getDb()
    if (!db) {
      // Demo mode
      return NextResponse.json({
        success: true,
        message: 'Clocked in successfully (demo mode)',
        clockIn: new Date().toISOString(),
      })
    }
    
    // Verify booking exists and is assigned to this cleaner
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1)
    
    if (booking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    if (booking[0].assignedTo !== session.id) {
      return NextResponse.json(
        { error: 'This booking is not assigned to you' },
        { status: 403 }
      )
    }
    
    // Create time tracking record
    const timeRecord = await db
      .insert(timeTracking)
      .values({
        bookingId,
        cleanerId: session.id,
        clockIn: new Date(),
        clockInLat: lat?.toString(),
        clockInLng: lng?.toString(),
      })
      .returning()
    
    // Update booking status
    await db
      .update(bookings)
      .set({ status: 'in-progress', updatedAt: new Date() })
      .where(eq(bookings.id, bookingId))
    
    return NextResponse.json({
      success: true,
      message: 'Clocked in successfully',
      timeRecord: timeRecord[0],
    })
    
  } catch (error) {
    console.error('Clock in error:', error)
    return NextResponse.json(
      { error: 'Failed to clock in' },
      { status: 500 }
    )
  }
}

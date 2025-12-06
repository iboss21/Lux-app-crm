import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { timeTracking } from '@/lib/schema'
import { eq, and, isNull } from 'drizzle-orm'
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
        message: 'Clocked out successfully (demo mode)',
        clockOut: new Date().toISOString(),
        workTime: 120, // 2 hours in demo
      })
    }
    
    // Find the open time tracking record
    const openRecord = await db
      .select()
      .from(timeTracking)
      .where(
        and(
          eq(timeTracking.bookingId, bookingId),
          eq(timeTracking.cleanerId, session.id),
          isNull(timeTracking.clockOut)
        )
      )
      .limit(1)
    
    if (openRecord.length === 0) {
      return NextResponse.json(
        { error: 'No open clock-in record found' },
        { status: 404 }
      )
    }
    
    const record = openRecord[0]
    const clockOut = new Date()
    const clockIn = record.clockIn ? new Date(record.clockIn) : new Date()
    const workTimeMinutes = Math.round((clockOut.getTime() - clockIn.getTime()) / 60000)
    
    // Update time tracking record
    const updatedRecord = await db
      .update(timeTracking)
      .set({
        clockOut,
        clockOutLat: lat?.toString(),
        clockOutLng: lng?.toString(),
        workTime: workTimeMinutes,
        totalTime: workTimeMinutes + (record.travelTime || 0),
      })
      .where(eq(timeTracking.id, record.id))
      .returning()
    
    return NextResponse.json({
      success: true,
      message: 'Clocked out successfully',
      timeRecord: updatedRecord[0],
      workTime: workTimeMinutes,
    })
    
  } catch (error) {
    console.error('Clock out error:', error)
    return NextResponse.json(
      { error: 'Failed to clock out' },
      { status: 500 }
    )
  }
}

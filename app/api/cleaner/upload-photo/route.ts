import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { jobPhotos } from '@/lib/schema'
import { getSession } from '@/lib/auth'
// In production, would import AWS SDK
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
// import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.userType !== 'cleaner') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bookingId = formData.get('bookingId') as string
    const photoType = formData.get('type') as 'before' | 'during' | 'after'
    const caption = formData.get('caption') as string | null
    const location = formData.get('location') as string | null
    
    if (!file || !bookingId || !photoType) {
      return NextResponse.json(
        { error: 'File, booking ID, and photo type are required' },
        { status: 400 }
      )
    }
    
    // In production, upload to S3
    // const s3Client = new S3Client({
    //   region: env.AWS_REGION,
    //   credentials: {
    //     accessKeyId: env.AWS_ACCESS_KEY_ID || '',
    //     secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
    //   },
    // })
    //
    // const key = `job-photos/${bookingId}/${photoType}/${Date.now()}-${file.name}`
    // const buffer = Buffer.from(await file.arrayBuffer())
    //
    // await s3Client.send(new PutObjectCommand({
    //   Bucket: env.AWS_BUCKET_NAME,
    //   Key: key,
    //   Body: buffer,
    //   ContentType: file.type,
    // }))
    //
    // const photoUrl = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`
    
    // Demo mode - generate a placeholder URL with unique seed
    const uniqueSeed = `${bookingId}-${photoType}-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const photoUrl = `https://picsum.photos/seed/${uniqueSeed}/800/600`
    
    const db = getDb()
    if (db) {
      // Save to database
      const photo = await db
        .insert(jobPhotos)
        .values({
          bookingId,
          cleanerId: session.id,
          photoType,
          photoUrl,
          caption,
          location,
        })
        .returning()
      
      return NextResponse.json({
        success: true,
        photo: photo[0],
      })
    }
    
    // Demo mode response
    return NextResponse.json({
      success: true,
      photo: {
        id: `demo-${Date.now()}`,
        bookingId,
        cleanerId: session.id,
        photoType,
        photoUrl,
        caption,
        location,
        createdAt: new Date().toISOString(),
      },
    })
    
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    )
  }
}

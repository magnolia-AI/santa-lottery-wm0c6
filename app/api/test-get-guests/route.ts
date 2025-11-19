import { getGuests } from '@/app/actions/guests'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('[API ROUTE] test-get-guests GET', {
    timestamp: new Date().toISOString(),
    status: 'started'
  })

  try {
    const guestsList = await getGuests()
    
    console.log('[API ROUTE] test-get-guests GET', {
      timestamp: new Date().toISOString(),
      status: 'completed',
      count: guestsList.length
    })
    
    return NextResponse.json({ success: true, guests: guestsList })
  } catch (error) {
    console.log('[API ROUTE] test-get-guests GET', {
      timestamp: new Date().toISOString(),
      status: 'error',
      error: (error as Error).message
    })
    
    return NextResponse.json({ success: false, error: (error as Error).message })
  }
}


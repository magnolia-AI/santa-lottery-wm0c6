import { addGuest } from '@/app/actions/guests'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log('[API ROUTE] test-add-guest POST', {
    timestamp: new Date().toISOString(),
    status: 'started'
  })

  try {
    const { name, email } = await request.json()
    
    console.log('[API ROUTE] test-add-guest POST', {
      timestamp: new Date().toISOString(),
      status: 'adding guest',
      name,
      email
    })
    
    const newGuest = await addGuest(name, email)
    
    console.log('[API ROUTE] test-add-guest POST', {
      timestamp: new Date().toISOString(),
      status: 'completed',
      guestId: newGuest.id
    })
    
    return NextResponse.json({ success: true, guest: newGuest })
  } catch (error) {
    console.log('[API ROUTE] test-add-guest POST', {
      timestamp: new Date().toISOString(),
      status: 'error',
      error: (error as Error).message
    })
    
    return NextResponse.json({ success: false, error: (error as Error).message })
  }
}

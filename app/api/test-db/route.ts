import { testDatabaseConnection } from '@/app/actions/test'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('[API ROUTE] test-db GET', {
    timestamp: new Date().toISOString(),
    status: 'started'
  })

  try {
    const result = await testDatabaseConnection()
    
    console.log('[API ROUTE] test-db GET', {
      timestamp: new Date().toISOString(),
      status: 'completed',
      result
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.log('[API ROUTE] test-db GET', {
      timestamp: new Date().toISOString(),
      status: 'error',
      error: (error as Error).message
    })
    
    return NextResponse.json({ success: false, error: (error as Error).message })
  }
}

export async function POST() {
  console.log('[API ROUTE] test-db POST', {
    timestamp: new Date().toISOString(),
    status: 'started'
  })

  try {
    // Simple test to add a guest
    const result = await testDatabaseConnection()
    
    console.log('[API ROUTE] test-db POST', {
      timestamp: new Date().toISOString(),
      status: 'completed',
      result
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.log('[API ROUTE] test-db POST', {
      timestamp: new Date().toISOString(),
      status: 'error',
      error: (error as Error).message
    })
    
    return NextResponse.json({ success: false, error: (error as Error).message })
  }
}



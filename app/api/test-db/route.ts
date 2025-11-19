import { testDatabaseConnection } from '@/app/actions/test'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await testDatabaseConnection()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message })
  }
}

export async function POST() {
  try {
    // Simple test to add a guest
    const result = await testDatabaseConnection()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message })
  }
}


import { testRemoveGuest } from '@/app/actions/test-remove'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const result = await testRemoveGuest()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message })
  }
}

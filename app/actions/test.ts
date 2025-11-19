'use server'

import db from '@/lib/db'
import { guests } from '@/lib/schema'

export async function testDatabaseConnection() {
  try {
    // Try to fetch guests to test the database connection
    const result = await db.select().from(guests).limit(1)
    return { success: true, message: 'Database connection successful', count: result.length }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

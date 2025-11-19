'use server'

import db from '@/lib/db'
import { guests } from '@/lib/schema'

export async function testDatabaseConnection() {
  console.log('[SERVER ACTION] testDatabaseConnection', {
    timestamp: new Date().toISOString(),
    status: 'started'
  })

  try {
    console.log('[SERVER ACTION] testDatabaseConnection', {
      timestamp: new Date().toISOString(),
      status: 'querying database'
    })
    
    // Try to fetch guests to test the database connection
    const result = await db.select().from(guests).limit(1)
    
    console.log('[SERVER ACTION] testDatabaseConnection', {
      timestamp: new Date().toISOString(),
      status: 'success',
      count: result.length
    })
    
    return { success: true, message: 'Database connection successful', count: result.length }
  } catch (error) {
    console.log('[SERVER ACTION] testDatabaseConnection', {
      timestamp: new Date().toISOString(),
      status: 'error',
      error: (error as Error).message
    })
    
    return { success: false, error: (error as Error).message }
  }
}


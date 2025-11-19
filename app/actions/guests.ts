'use server'

import db from '@/lib/db'
import { guests } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// Type for guest data
export type Guest = {
  id: number
  name: string
  email: string | null
  isEligible: boolean
  createdAt: Date
  updatedAt: Date
}

// Enhanced logging function
function logAction(action: string, details: any = {}) {
  console.log(`[SERVER ACTION] ${action}`, {
    timestamp: new Date().toISOString(),
    ...details
  })
}

// Get all guests from the database
export async function getGuests(): Promise<Guest[]> {
  logAction('getGuests', { status: 'started' })
  
  try {
    logAction('getGuests', { status: 'querying database' })
    const result = await db.select().from(guests)
    logAction('getGuests', { status: 'query successful', count: result.length })
    
    const guestsList = result.map(guest => ({
      ...guest,
      createdAt: new Date(guest.createdAt),
      updatedAt: new Date(guest.updatedAt)
    }))
    
    logAction('getGuests', { status: 'completed', count: guestsList.length })
    return guestsList
  } catch (error) {
    logAction('getGuests', { status: 'error', error: (error as Error).message })
    console.error('Error fetching guests:', error)
    // Re-throw the error so the client can handle it properly
    throw new Error('Failed to fetch guests: ' + (error as Error).message)
  }
}

// Add a new guest to the database (form action)
export async function addGuestAction(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string || null

  logAction('addGuestAction', { name, email, hasName: !!name?.trim() })

  if (!name?.trim()) {
    logAction('addGuestAction', { status: 'validation failed', reason: 'name is required' })
    return
  }

  try {
    logAction('addGuestAction', { status: 'inserting guest' })
    await db.insert(guests).values({
      name: name.trim(),
      email: email?.trim() || null,
      isEligible: true
    })
    
    logAction('addGuestAction', { status: 'success' })
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    logAction('addGuestAction', { status: 'error', error: (error as Error).message })
    console.error('Error adding guest:', error)
  }
}

// Remove a guest from the database (form action)
export async function removeGuestAction(formData: FormData) {
  const id = Number(formData.get('id'))
  
  logAction('removeGuestAction', { id, hasId: !!id })

  if (!id) {
    logAction('removeGuestAction', { status: 'validation failed', reason: 'id is required' })
    return
  }

  try {
    logAction('removeGuestAction', { status: 'deleting guest' })
    await db.delete(guests).where(eq(guests.id, id))
    logAction('removeGuestAction', { status: 'success' })
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    logAction('removeGuestAction', { status: 'error', error: (error as Error).message })
    console.error('Error removing guest:', error)
  }
}

// Toggle guest eligibility (form action)
export async function toggleEligibilityAction(formData: FormData) {
  const id = Number(formData.get('id'))
  
  logAction('toggleEligibilityAction', { id, hasId: !!id })

  if (!id) {
    logAction('toggleEligibilityAction', { status: 'validation failed', reason: 'id is required' })
    return
  }

  try {
    logAction('toggleEligibilityAction', { status: 'fetching guest' })
    // First get the current guest to toggle the eligibility
    const existingGuests = await db.select().from(guests).where(eq(guests.id, id)).limit(1)
    
    if (existingGuests.length === 0) {
      logAction('toggleEligibilityAction', { status: 'validation failed', reason: 'guest not found' })
      return
    }
    
    const currentEligibility = existingGuests[0].isEligible
    logAction('toggleEligibilityAction', { status: 'updating guest', currentEligibility })
    
    // Update the guest with toggled eligibility
    await db.update(guests)
      .set({ 
        isEligible: !currentEligibility,
        updatedAt: new Date()
      })
      .where(eq(guests.id, id))
      
    logAction('toggleEligibilityAction', { status: 'success', newEligibility: !currentEligibility })
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    logAction('toggleEligibilityAction', { status: 'error', error: (error as Error).message })
    console.error('Error toggling eligibility:', error)
  }
}

// Clear all guests from the database (form action)
export async function clearAllGuestsAction() {
  logAction('clearAllGuestsAction', { status: 'started' })

  try {
    logAction('clearAllGuestsAction', { status: 'deleting all guests' })
    await db.delete(guests)
    logAction('clearAllGuestsAction', { status: 'success' })
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    logAction('clearAllGuestsAction', { status: 'error', error: (error as Error).message })
    console.error('Error clearing guests:', error)
  }
}

// Add a new guest to the database (programmatic action)
export async function addGuest(name: string, email?: string | null) {
  logAction('addGuest', { name, email, hasName: !!name?.trim() })

  if (!name?.trim()) {
    logAction('addGuest', { status: 'validation failed', reason: 'name is required' })
    throw new Error('Name is required')
  }

  try {
    logAction('addGuest', { status: 'inserting guest' })
    const result = await db.insert(guests).values({
      name: name.trim(),
      email: email?.trim() || null,
      isEligible: true
    }).returning()
    
    logAction('addGuest', { status: 'success', guestId: result[0].id })
    revalidatePath('/admin')
    revalidatePath('/wheel')
    return result[0]
  } catch (error) {
    logAction('addGuest', { status: 'error', error: (error as Error).message })
    console.error('Error adding guest:', error)
    throw new Error('Failed to add guest')
  }
}

// Remove a guest from the database (programmatic action)
export async function removeGuestById(id: number) {
  logAction('removeGuestById', { id, hasId: !!id })

  if (!id) {
    logAction('removeGuestById', { status: 'validation failed', reason: 'invalid guest ID' })
    throw new Error('Invalid guest ID')
  }

  try {
    logAction('removeGuestById', { status: 'deleting guest' })
    await db.delete(guests).where(eq(guests.id, id))
    logAction('removeGuestById', { status: 'success' })
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    logAction('removeGuestById', { status: 'error', error: (error as Error).message })
    console.error('Error removing guest:', error)
    throw new Error('Failed to remove guest')
  }
}

// Toggle guest eligibility (programmatic action)
export async function toggleGuestEligibility(id: number) {
  logAction('toggleGuestEligibility', { id, hasId: !!id })

  if (!id) {
    logAction('toggleGuestEligibility', { status: 'validation failed', reason: 'invalid guest ID' })
    throw new Error('Invalid guest ID')
  }

  try {
    logAction('toggleGuestEligibility', { status: 'fetching guest' })
    // First get the current guest to toggle the eligibility
    const existingGuests = await db.select().from(guests).where(eq(guests.id, id)).limit(1)
    
    if (existingGuests.length === 0) {
      logAction('toggleGuestEligibility', { status: 'validation failed', reason: 'guest not found' })
      throw new Error('Guest not found')
    }
    
    const currentEligibility = existingGuests[0].isEligible
    logAction('toggleGuestEligibility', { status: 'updating guest', currentEligibility })
    
    // Update the guest with toggled eligibility
    const result = await db.update(guests)
      .set({ 
        isEligible: !currentEligibility,
        updatedAt: new Date()
      })
      .where(eq(guests.id, id))
      .returning()
      
    logAction('toggleGuestEligibility', { status: 'success', newEligibility: result[0].isEligible })
    revalidatePath('/admin')
    revalidatePath('/wheel')
    return result[0]
  } catch (error) {
    logAction('toggleGuestEligibility', { status: 'error', error: (error as Error).message })
    console.error('Error toggling eligibility:', error)
    throw new Error('Failed to toggle eligibility')
  }
}

// Clear all guests from the database (programmatic action)
export async function clearAllGuestsProgrammatic() {
  logAction('clearAllGuestsProgrammatic', { status: 'started' })

  try {
    logAction('clearAllGuestsProgrammatic', { status: 'deleting all guests' })
    await db.delete(guests)
    logAction('clearAllGuestsProgrammatic', { status: 'success' })
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    logAction('clearAllGuestsProgrammatic', { status: 'error', error: (error as Error).message })
    console.error('Error clearing guests:', error)
    throw new Error('Failed to clear guests')
  }
}

















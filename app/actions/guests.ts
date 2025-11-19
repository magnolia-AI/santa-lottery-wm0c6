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

// Get all guests from the database
export async function getGuests(): Promise<Guest[]> {
  try {
    const result = await db.select().from(guests)
    return result.map(guest => ({
      ...guest,
      createdAt: new Date(guest.createdAt),
      updatedAt: new Date(guest.updatedAt)
    }))
  } catch (error) {
    console.error('Error fetching guests:', error)
    // Re-throw the error so the client can handle it properly
    throw new Error('Failed to fetch guests: ' + (error as Error).message)
  }
}

// Add a new guest to the database (form action)
export async function addGuestAction(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string || null

  if (!name?.trim()) {
    return
  }

  try {
    await db.insert(guests).values({
      name: name.trim(),
      email: email?.trim() || null,
      isEligible: true
    })
    
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    console.error('Error adding guest:', error)
  }
}

// Remove a guest from the database (form action)
export async function removeGuestAction(formData: FormData) {
  const id = Number(formData.get('id'))
  
  if (!id) {
    return
  }

  try {
    await db.delete(guests).where(eq(guests.id, id))
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    console.error('Error removing guest:', error)
  }
}

// Toggle guest eligibility (form action)
export async function toggleEligibilityAction(formData: FormData) {
  const id = Number(formData.get('id'))
  
  if (!id) {
    return
  }

  try {
    // First get the current guest to toggle the eligibility
    const existingGuests = await db.select().from(guests).where(eq(guests.id, id)).limit(1)
    
    if (existingGuests.length === 0) {
      return
    }
    
    const currentEligibility = existingGuests[0].isEligible
    
    // Update the guest with toggled eligibility
    await db.update(guests)
      .set({ 
        isEligible: !currentEligibility,
        updatedAt: new Date()
      })
      .where(eq(guests.id, id))
      
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    console.error('Error toggling eligibility:', error)
  }
}

// Clear all guests from the database (form action)
export async function clearAllGuestsAction() {
  try {
    await db.delete(guests)
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    console.error('Error clearing guests:', error)
  }
}

// Add a new guest to the database (programmatic action)
export async function addGuest(name: string, email?: string | null) {
  if (!name?.trim()) {
    throw new Error('Name is required')
  }

  try {
    const result = await db.insert(guests).values({
      name: name.trim(),
      email: email?.trim() || null,
      isEligible: true
    }).returning()
    
    revalidatePath('/admin')
    revalidatePath('/wheel')
    return result[0]
  } catch (error) {
    console.error('Error adding guest:', error)
    throw new Error('Failed to add guest')
  }
}

// Remove a guest from the database (programmatic action)
export async function removeGuestById(id: number) {
  if (!id) {
    throw new Error('Invalid guest ID')
  }

  try {
    await db.delete(guests).where(eq(guests.id, id))
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    console.error('Error removing guest:', error)
    throw new Error('Failed to remove guest')
  }
}

// Toggle guest eligibility (programmatic action)
export async function toggleGuestEligibility(id: number) {
  if (!id) {
    throw new Error('Invalid guest ID')
  }

  try {
    // First get the current guest to toggle the eligibility
    const existingGuests = await db.select().from(guests).where(eq(guests.id, id)).limit(1)
    
    if (existingGuests.length === 0) {
      throw new Error('Guest not found')
    }
    
    const currentEligibility = existingGuests[0].isEligible
    
    // Update the guest with toggled eligibility
    const result = await db.update(guests)
      .set({ 
        isEligible: !currentEligibility,
        updatedAt: new Date()
      })
      .where(eq(guests.id, id))
      .returning()
      
    revalidatePath('/admin')
    revalidatePath('/wheel')
    return result[0]
  } catch (error) {
    console.error('Error toggling eligibility:', error)
    throw new Error('Failed to toggle eligibility')
  }
}

// Clear all guests from the database (programmatic action)
export async function clearAllGuestsProgrammatic() {
  try {
    await db.delete(guests)
    revalidatePath('/admin')
    revalidatePath('/wheel')
  } catch (error) {
    console.error('Error clearing guests:', error)
    throw new Error('Failed to clear guests')
  }
}






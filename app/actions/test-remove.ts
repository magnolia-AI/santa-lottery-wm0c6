'use server'

import { removeGuestById } from '@/app/actions/guests'

export async function testRemoveGuest() {
  try {
    console.log('Testing remove guest with ID 2')
    await removeGuestById(2)
    console.log('Successfully removed guest with ID 2')
    return { success: true, message: 'Guest removed successfully' }
  } catch (error) {
    console.error('Error removing guest:', error)
    return { success: false, error: (error as Error).message }
  }
}

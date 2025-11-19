'use client'

import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import { toggleGuestEligibility } from '@/app/actions/guests'

export function ToggleSwitch({ 
  id, 
  isEligible 
}: { 
  id: number, 
  isEligible: boolean 
}) {
  const router = useRouter()
  
  const handleToggle = async () => {
    try {
      await toggleGuestEligibility(id)
      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Error toggling eligibility:', error)
    }
  }

  return (
    <Switch
      checked={isEligible}
      onCheckedChange={handleToggle}
    />
  )
}



'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { getGuests, type Guest } from '@/app/actions/guests'
import SuspenseWheel from '@/app/components/suspense-wheel'

export default function WheelPage() {
  const [guests, setGuests] = useState<Guest[]>([])

  // Load guests from database on component mount
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const fetchedGuests = await getGuests()
        setGuests(fetchedGuests)
      } catch (error) {
        console.error('Error fetching guests:', error)
        // Fallback to sample guests if database fetch fails
        const sampleGuests: Guest[] = [
          { id: 1, name: 'anton', isEligible: true, email: null, createdAt: new Date(), updatedAt: new Date() },
          { id: 2, name: 'Carl', isEligible: true, email: null, createdAt: new Date(), updatedAt: new Date() },
          { id: 3, name: 'Lina', isEligible: true, email: null, createdAt: new Date(), updatedAt: new Date() },
          { id: 4, name: 'Rebecca', isEligible: true, email: null, createdAt: new Date(), updatedAt: new Date() },
          { id: 5, name: 'Sofia', isEligible: true, email: null, createdAt: new Date(), updatedAt: new Date() },
          { id: 6, name: 'Clara Yström', isEligible: true, email: null, createdAt: new Date(), updatedAt: new Date() },
        ]
        setGuests(sampleGuests)
      }
    }
    
    fetchGuests()
  }, [])

  const handleSpinStart = async (): Promise<Guest | null> => {
    try {
      const response = await fetch('/api/rigging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests })
      })
      
      if (!response.ok) {
        throw new Error('Failed to select Santa')
      }
      
      const data = await response.json()
      return data.selectedGuest
    } catch (error) {
      console.error('Error selecting Santa:', error)
      // Fallback to random eligible guest
      const eligibleGuests = guests.filter(g => g.isEligible)
      if (eligibleGuests.length === 0) return null
      return eligibleGuests[Math.floor(Math.random() * eligibleGuests.length)]
    }
  }

  const handleSpinComplete = (guest: Guest) => {
    console.log('Winner:', guest.name)
    // Add confetti or other effects here if needed
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <section className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        <div className="max-w-4xl mx-auto flex-grow flex flex-col w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
              Santa Picker Wheel
            </h1>
            <p className="text-muted-foreground text-lg">
              Spin to find this year's Santa!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 flex-grow">
            {/* Wheel Section - full width */}
            <div className="flex flex-col items-center w-full">
              <Card className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-none shadow-none">
                <CardContent className="flex flex-col items-center justify-center p-0 md:p-6">
                  <SuspenseWheel 
                    guests={guests} 
                    onSpinStart={handleSpinStart}
                    onSpinComplete={handleSpinComplete}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-auto pt-8 text-center pb-8">
            <Button variant="outline" asChild className="hover:bg-slate-100">
              <Link href="/admin">Manage Guests</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

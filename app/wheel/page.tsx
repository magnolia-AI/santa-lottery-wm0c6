'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { getGuests, type Guest } from '@/app/actions/guests'
import NewWheel from '@/app/components/new-wheel'

export default function WheelPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [spinning, setSpinning] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)

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

  const handleSpin = (guest: Guest | null) => {
    if (guest === null) {
      // Start spinning
      setSpinning(true)
      setSelectedGuest(null)
    } else {
      // Finish spinning with result
      setSelectedGuest(guest)
      setSpinning(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <section className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        <div className="max-w-4xl mx-auto flex-grow flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-[oklch(55% 0.1 286)] bg-clip-text text-transparent">
              Santa Picker Wheel
            </h1>
            <p className="text-muted-foreground">
              Spin to find this year's Santa!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 flex-grow">
            {/* Wheel Section - full width */}
            <div className="flex flex-col">
              <Card className="flex-grow flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Santa Wheel</CardTitle>
                  <CardDescription>
                    Spin to select this year's Santa
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center flex-grow">
                  <NewWheel 
                    guests={guests} 
                    onSpin={handleSpin} 
                    spinning={spinning}
                    selectedGuest={selectedGuest}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-auto pt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/admin">Manage Guests</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}







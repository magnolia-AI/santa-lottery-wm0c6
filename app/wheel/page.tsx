'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getGuests } from '@/app/actions/guests'

export default function WheelPage() {
  const [guests, setGuests] = useState([])
  const [spinning, setSpinning] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [rotation, setRotation] = useState(0)

  // Load guests from database on component mount
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const fetchedGuests = await getGuests()
        setGuests(fetchedGuests)
      } catch (error) {
        console.error('Error fetching guests:', error)
        // Fallback to sample guests if database fetch fails
        const sampleGuests = [
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

  const spinWheel = async () => {
    if (spinning) return
    
    const eligibleGuests = guests.filter(guest => guest.isEligible)
    if (eligibleGuests.length === 0) {
      alert('No eligible guests to pick from!')
      return
    }
    
    setSpinning(true)
    setSelectedGuest(null)
    
    // Determine the selected guest using our API
    try {
      const response = await fetch('/api/rigging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests })
      })
      
      if (!response.ok) {
        throw new Error('Failed to select Santa')
      }
      
      const { selectedGuest } = await response.json()
      
      // Calculate rotation to land on the selected guest
      const selectedIndex = guests.findIndex(guest => guest.id === selectedGuest.id)
      if (selectedIndex === -1) {
        throw new Error('Selected guest not found in guest list')
      }
      
      // Calculate the angle for the selected segment
      const segmentAngle = 360 / guests.length
      const targetAngle = selectedIndex * segmentAngle
      
      // Calculate rotation to land on the selected segment (5-10 full rotations + precise landing)
      const fullRotations = 5 + Math.floor(Math.random() * 5)
      const totalRotation = fullRotations * 360 + (360 - targetAngle) - (segmentAngle / 2)
      
      // Add to current rotation for continuous spinning effect
      const newRotation = rotation + totalRotation
      setRotation(newRotation)
      
      // Set the winner after the animation completes
      setTimeout(() => {
        setSelectedGuest(selectedGuest)
        setSpinning(false)
      }, 3000)
    } catch (error) {
      console.error('Error selecting Santa:', error)
      // Fallback to random selection if API fails
      const selectedIndex = Math.floor(Math.random() * eligibleGuests.length)
      const winner = eligibleGuests[selectedIndex]
      
      // Calculate rotation to land on the selected guest
      const guestIndex = guests.findIndex(guest => guest.id === winner.id)
      const segmentAngle = 360 / guests.length
      const targetAngle = guestIndex * segmentAngle
      const fullRotations = 5 + Math.floor(Math.random() * 5)
      const totalRotation = fullRotations * 360 + (360 - targetAngle) - (segmentAngle / 2)
      const newRotation = rotation + totalRotation
      setRotation(newRotation)
      
      setTimeout(() => {
        setSelectedGuest(winner)
        setSpinning(false)
      }, 3000)
    }
  }

  const toggleEligibility = (id) => {
    // This function is only for admin panel now
    // Keeping it for type safety but it won't be used on this page
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, isEligible: !guest.isEligible } : guest
    ))
  }

  // Create wheel segments
  const createWheelSegments = () => {
    // Display all guests on the wheel for presentation purposes
    // but visually indicate eligibility status
    if (guests.length === 0) return []
    
    const segmentAngle = 360 / guests.length
    return guests.map((guest, index) => {
      const rotate = index * segmentAngle
      const skew = 90 - segmentAngle
      return {
        ...guest,
        rotate,
        skew,
        segmentAngle
      }
    })
  }

  const wheelSegments = createWheelSegments()

  return (
    <div className="min-h-full">
      <section className="container mx-auto px-4 pt-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Santa Picker Wheel
            </h1>
            <p className="text-muted-foreground">
              Spin to find this year's Santa!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Wheel Section - full width */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Santa Wheel</CardTitle>
                  <CardDescription>
                    Spin to select this year's Santa
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  {/* Wheel Container - made bigger */}
                  <div className="relative w-80 h-80 md:w-96 md:h-96 mb-8">
                    {/* Wheel */}
                    <div className="relative w-full h-full">
                      <motion.div
                        className="w-full h-full rounded-full border-8 border-white shadow-xl overflow-hidden relative"
                        animate={{ rotate: rotation }}
                        transition={{ 
                          duration: 3, 
                          ease: "easeOut"
                        }}
                        style={{ transformOrigin: 'center' }}
                      >
                        {wheelSegments.length > 0 ? (
                          wheelSegments.map((segment, index) => {
                            // Generate distinct colors for each segment
                            const hue = (index * 360) / wheelSegments.length;
                            const backgroundColor = segment.isEligible 
                              ? `hsl(${hue}, 70%, 40%)` 
                              : `hsl(${hue}, 30%, 70%)`;
                            
                            return (
                              <div
                                key={segment.id}
                                className="absolute top-0 right-0 w-1/2 h-1/2 origin-[0%_100%]"
                                style={{
                                  transform: `rotate(${segment.rotate}deg) skew(${segment.skew}deg)`,
                                  backgroundColor: backgroundColor,
                                  border: '1px solid rgba(255, 255, 255, 0.3)',
                                  boxShadow: segment.isEligible 
                                    ? 'inset 0 0 10px rgba(255, 255, 255, 0.3)' 
                                    : 'inset 0 0 5px rgba(255, 255, 255, 0.1)',
                                }}
                              >
                                <div 
                                  className="flex items-center justify-center h-full w-full"
                                  style={{ 
                                    transform: `skew(-${segment.skew}deg) rotate(-${segment.rotate - segment.segmentAngle/2}deg)`,
                                    transformOrigin: 'center'
                                  }}
                                >
                                  <span 
                                    className={`text-xs font-bold text-center px-1 ${segment.isEligible ? 'text-white' : 'text-gray-400'}`}
                                    style={{ 
                                      transform: 'rotate(90deg)',
                                      writingMode: 'vertical-rl',
                                      textShadow: segment.isEligible 
                                        ? '1px 1px 2px rgba(0, 0, 0, 0.7)' 
                                        : '1px 1px 1px rgba(0, 0, 0, 0.3)'
                                    }}
                                  >
                                    {segment.name}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/20">
                            <span className="text-muted-foreground">No eligible guests</span>
                          </div>
                        )}
                      </motion.div>
                      
                      {/* Pointer */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-16 border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg"></div>
                      </div>
                      
                      {/* Center circle */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center z-10 shadow-lg border-4 border-white">
                        <span className="text-white font-bold text-sm">SPIN</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={spinWheel} 
                    disabled={spinning || wheelSegments.length === 0}
                    className="w-full max-w-xs"
                    size="lg"
                  >
                    {spinning ? 'Spinning...' : 'Spin the Wheel'}
                  </Button>

                  {selectedGuest && (
                    <div className="mt-6 text-center p-4 bg-primary/10 rounded-lg w-full">
                      <h3 className="text-xl font-bold">🎉 This Year's Santa 🎉</h3>
                      <p className="text-2xl font-bold text-primary mt-2">{selectedGuest.name}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Congratulations! You get free drinks at the bar.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/admin">Manage Guests</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}





















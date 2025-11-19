'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function WheelPage() {
  const [guests, setGuests] = useState([])
  const [spinning, setSpinning] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [rotation, setRotation] = useState(0)

  // Load guests from localStorage on component mount
  useEffect(() => {
    const savedGuests = localStorage.getItem('santaGuests')
    if (savedGuests) {
      setGuests(JSON.parse(savedGuests))
    } else {
      // Initialize with sample guests
      const sampleGuests = [
        { id: 1, name: 'Alex Johnson', isEligible: true },
        { id: 2, name: 'Maria Garcia', isEligible: true },
        { id: 3, name: 'Sam Wilson', isEligible: true },
        { id: 4, name: 'Jordan Lee', isEligible: false },
        { id: 5, name: 'Taylor Kim', isEligible: true },
      ]
      setGuests(sampleGuests)
      localStorage.setItem('santaGuests', JSON.stringify(sampleGuests))
    }
  }, [])

  // Save guests to localStorage whenever they change
  useEffect(() => {
    if (guests.length >= 0) {
      localStorage.setItem('santaGuests', JSON.stringify(guests))
    }
  }, [guests])

  const spinWheel = async () => {
    if (spinning) return
    
    const eligibleGuests = guests.filter(guest => guest.isEligible)
    if (eligibleGuests.length === 0) {
      alert('No eligible guests to pick from!')
      return
    }
    
    setSpinning(true)
    setSelectedGuest(null)
    
    // Calculate random rotation (5-10 full rotations + random offset)
    const fullRotations = 5 + Math.floor(Math.random() * 5)
    const randomAngle = Math.floor(Math.random() * 360)
    const totalRotation = fullRotations * 360 + randomAngle
    
    // Add to current rotation for continuous spinning effect
    const newRotation = rotation + totalRotation
    setRotation(newRotation)
    
    // Determine the selected guest using our API
    try {
      // In a real implementation with a database, we would call our API
      // For now, we'll simulate the API call
      setTimeout(async () => {
        // Simulate API call delay
        // const response = await fetch('/api/rigging', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ guests })
        // })
        // const { selectedGuest } = await response.json()
        
        // For demo purposes, we'll just select a random eligible guest
        const selectedIndex = Math.floor(Math.random() * eligibleGuests.length)
        const winner = eligibleGuests[selectedIndex]
        setSelectedGuest(winner)
        setSpinning(false)
      }, 3000)
    } catch (error) {
      // Fallback to random selection if API fails
      setTimeout(() => {
        const selectedIndex = Math.floor(Math.random() * eligibleGuests.length)
        const winner = eligibleGuests[selectedIndex]
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wheel Section - spans 2 columns on large screens */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Santa Wheel</CardTitle>
                  <CardDescription>
                    Spin to select this year's Santa
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  {/* Wheel Container */}
                  <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
                    {/* Wheel */}
                    <div className="relative w-full h-full">
                      <motion.div
                        className="w-full h-full rounded-full border-4 border-primary overflow-hidden relative"
                        animate={{ rotate: rotation }}
                        transition={{ 
                          duration: 3, 
                          ease: "easeOut"
                        }}
                        style={{ transformOrigin: 'center' }}
                      >
                        {wheelSegments.length > 0 ? (
                          wheelSegments.map((segment, index) => (
                            <div
                              key={segment.id}
                              className="absolute top-0 right-0 w-1/2 h-1/2 origin-[0%_100%]"
                              style={{
                                transform: `rotate(${segment.rotate}deg) skew(${segment.skew}deg)`,
                                backgroundColor: segment.isEligible 
                                  ? (index % 2 === 0 ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--secondary) / 0.2)') 
                                  : 'hsl(var(--muted) / 0.3)',
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
                                  className={`text-xs font-medium text-center px-1 ${segment.isEligible ? '' : 'opacity-50'}`}
                                  style={{ 
                                    transform: 'rotate(90deg)',
                                    writingMode: 'vertical-rl'
                                  }}
                                >
                                  {segment.name.split(' ')[0]}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/20">
                            <span className="text-muted-foreground">No eligible guests</span>
                          </div>
                        )}
                      </motion.div>
                      
                      {/* Pointer */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-primary"></div>
                      </div>
                      
                      {/* Center circle */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center z-10">
                        <span className="text-white font-bold text-xs">SPIN</span>
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

            {/* Guest List Section */}
            <Card>
              <CardHeader>
                <CardTitle>Party Guests</CardTitle>
                <CardDescription>
                  All guests in this year's Christmas party
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {guests.map((guest) => (
                    <div 
                      key={guest.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-input"
                    >
                      <span className="font-medium">{guest.name}</span>
                    </div>
                  ))}
                </div>
                
                {guests.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No guests added yet.</p>
                    <Button variant="link" asChild className="p-0 mt-2">
                      <Link href="/admin">Add guests in admin panel</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
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








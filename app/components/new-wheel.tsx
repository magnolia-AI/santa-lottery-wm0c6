'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Guest } from '@/app/actions/guests'
import { useSoundEffect } from '@/app/components/use-sound-effect'

interface NewWheelProps {
  guests: Guest[]
  onSpin: (selectedGuest: Guest | null) => void
  spinning: boolean
  selectedGuest: Guest | null
}

export default function NewWheel({ guests, onSpin, spinning, selectedGuest }: NewWheelProps) {
  const [visibleGuests, setVisibleGuests] = useState<Guest[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const radius = 200 // Radius of the wheel
  const wheelRotation = useMotionValue(0)
  const { initAudioContext, playSpinSound, playWinSound } = useSoundEffect()

  // Filter eligible guests
  const eligibleGuests = guests.filter(guest => guest.isEligible)

  // Set up visible guests (show all guests but highlight eligibility)
  useEffect(() => {
    setVisibleGuests(guests)
  }, [guests])

  // Handle spinning animation
  useEffect(() => {
    if (spinning) {
      // Create a more suspenseful spinning animation
      // Start with a fast spin, then slow down dramatically
      const initialRotation = wheelRotation.get()
      const targetRotation = initialRotation + 3600 + Math.random() * 360 // Add some randomness
      
      // Animate with a custom easing for more realistic spin
      const rotationAnimation = animate(wheelRotation, targetRotation, {
        duration: 6, // Longer duration for more suspense
        ease: [0.2, 0.8, 0.3, 1.0] // Custom easing for more natural feel
      })
      
      return () => rotationAnimation.stop()
    }
  }, [spinning, wheelRotation])

  const handleSpin = async () => {
    if (spinning || eligibleGuests.length === 0) return
    
    // Initialize audio context on user interaction
    initAudioContext()
    
    // Play spin sound
    playSpinSound()
    
    // Start spinning animation
    onSpin(null) // Reset selected guest
    
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
      
      // Add suspense by delaying the reveal
      setTimeout(() => {
        playWinSound() // Play win sound when revealing winner
        onSpin(selectedGuest)
      }, 2000) // 2 second delay for suspense
    } catch (error) {
      console.error('Error selecting Santa:', error)
      // Fallback to random selection if API fails
      const selectedIndex = Math.floor(Math.random() * eligibleGuests.length)
      const winner = eligibleGuests[selectedIndex]
      
      // Add suspense even for fallback
      setTimeout(() => {
        playWinSound() // Play win sound when revealing winner
        onSpin(winner)
      }, 2000) // 2 second delay for suspense
    }
  }

  // Calculate position for each guest on the wheel
  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return { x, y, angle }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full py-8">
      {/* Wheel Container */}
      <div 
        ref={containerRef}
        className="relative w-80 h-80 md:w-[500px] md:h-[500px] mb-8 flex items-center justify-center"
      >
        {/* Wheel Visualization */}
        <motion.div 
          className="relative w-full h-full rounded-full border-4 border-primary/20 bg-gradient-to-br from-primary/5 to-[oklch(55% 0.1 286)/0.05] flex items-center justify-center shadow-xl"
          style={{ rotate: wheelRotation }}
          animate={spinning ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-primary to-[oklch(55% 0.1 286)] rounded-full flex items-center justify-center z-10 shadow-lg border-4 border-white animate-pulse">
            <span className="text-white font-bold text-xs md:text-sm">SPIN</span>
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div 
              className={`w-0 h-0 border-l-6 border-r-6 border-t-12 border-l-transparent border-r-transparent border-t-primary drop-shadow-lg ${
                spinning ? 'animate-bounce' : ''
              }`}
            ></div>
          </div>
          
          {/* Guest Items */}
          {visibleGuests.map((guest, index) => {
            const position = getPosition(index, visibleGuests.length)
            const isSelected = selectedGuest?.id === guest.id
            
            return (
              <motion.div
                key={guest.id}
                className={`absolute flex items-center justify-center rounded-full w-12 h-12 md:w-16 md:h-16 border-2 shadow-md transition-all duration-300 ${
                  guest.isEligible 
                    ? isSelected 
                      ? 'bg-primary border-primary text-white shadow-lg scale-110' 
                      : 'bg-white border-primary text-primary'
                    : 'bg-muted border-muted-foreground text-muted-foreground opacity-50'
                }`}
                style={{
                  left: `calc(50% + ${position.x}px)`,
                  top: `calc(50% + ${position.y}px)`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isSelected ? 20 : 10
                }}
                animate={{
                  scale: spinning ? [1, 1.1, 1] : isSelected ? 1.2 : 1,
                  boxShadow: isSelected 
                    ? '0 10px 25px rgba(0, 0, 0, 0.2)' 
                    : spinning 
                      ? '0 4px 10px rgba(0, 0, 0, 0.15)' 
                      : '0 2px 5px rgba(0, 0, 0, 0.1)'
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20,
                  scale: { repeat: spinning ? Infinity : 0, duration: spinning ? 0.5 : 0.2 }
                }}
              >
                <span className="font-bold text-xs md:text-sm flex items-center justify-center w-full h-full">
                  {guest.name.charAt(0)}
                </span>
                {isSelected && (
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-yellow-400"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.3, opacity: 1 }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: "loop", 
                      duration: 1.5 
                    }}
                  />
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Spin Button */}
      <Button 
        onClick={handleSpin} 
        disabled={spinning || eligibleGuests.length === 0}
        className="w-full max-w-xs bg-gradient-to-r from-primary to-[oklch(55% 0.1 286)] hover:from-primary/90 hover:to-[oklch(50% 0.1 286)] text-white"
        size="lg"
      >
        {spinning ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2">🎄</span>
            Spinning...
          </span>
        ) : eligibleGuests.length === 0 ? (
          'No Eligible Guests'
        ) : (
          'Spin the Wheel'
        )}
      </Button>

      {/* Spinning indicator */}
      {spinning && (
        <div className="mt-4 text-center">
          <p className="text-muted-foreground animate-pulse">
            The wheel is spinning... Who will be Santa? 🎁
          </p>
        </div>
      )}

      {/* Guest Counter */}
      <div className="mt-4 text-center">
        <Badge variant="secondary">
          {eligibleGuests.length} eligible out of {guests.length} guests
        </Badge>
      </div>

      {/* Selected Guest Display */}
      {selectedGuest && (
        <motion.div 
          className="mt-6 text-center p-6 bg-gradient-to-r from-primary/10 to-[oklch(55% 0.1 286)/0.1] rounded-xl border border-primary/20 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold">🎉 This Year's Santa 🎉</h3>
          <p className="text-3xl font-bold text-primary mt-3 mb-2">{selectedGuest.name}</p>
          <p className="text-sm text-muted-foreground">
            Congratulations! You get free drinks at the bar.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🎅</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}


















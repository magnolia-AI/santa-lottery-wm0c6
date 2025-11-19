'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useMotionValue, AnimatePresence } from 'framer-motion'
import { Guest } from '@/app/actions/guests'
import { useSoundEffect } from '@/app/components/use-sound-effect'
import { Button } from '@/components/ui/button'
import confetti from 'canvas-confetti'

interface SuspenseWheelProps {
  guests: Guest[]
  onSpinStart: () => Promise<Guest | null> // Function to start spin and get winner
  onSpinComplete: (guest: Guest) => void   // Function called when animation ends
}

const COLORS = [
  '#D42426', // Red
  '#146B3A', // Green
  '#F8B229', // Gold
  '#165B33', // Dark Green
  '#BB2528', // Dark Red
  '#EA4630', // Bright Red
  '#146B3A', // Green
  '#F8B229', // Gold
]

export default function SuspenseWheel({ guests, onSpinStart, onSpinComplete }: SuspenseWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<Guest | null>(null)
  const controls = useAnimation()
  const { initAudioContext, playSpinSound, playWinSound } = useSoundEffect()
  
  // Calculate wheel segments
  const totalGuests = guests.length
  const sliceAngle = 360 / (totalGuests || 1)
  const radius = 50
  const center = 50

  // Sound effect interval
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const getCoordinatesForAngle = (angle: number) => {
    const radian = (angle - 90) * (Math.PI / 180)
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian)
    }
  }

  const fireConfetti = () => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const random = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) {
        return clearInterval(interval)
      }
      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)
  }

  const handleSpin = async () => {
    if (isSpinning || guests.length === 0) return
    
    setIsSpinning(true)
    setWinner(null)
    initAudioContext()
    
    // Start a fast initial spin immediately to show activity
    controls.start({
      rotate: 360 * 5,
      transition: { duration: 2, ease: "linear", repeat: Infinity }
    })

    // Play spin sound
    const playTick = () => playSpinSound()
    let tickRate = 100
    soundIntervalRef.current = setInterval(playTick, tickRate)
    
    try {
      const selectedGuest = await onSpinStart()
      
      if (!selectedGuest) {
        throw new Error('No winner selected')
      }
      
      // Calculate target rotation
      const winnerIndex = guests.findIndex(g => g.id === selectedGuest.id)
      const winnerAngle = winnerIndex * sliceAngle + sliceAngle / 2
      
      // We want ~15 seconds of spinning
      const totalSpins = 20 // Adjust for speed
      const finalRotation = (360 * totalSpins) - winnerAngle
      
      // Stop the infinite spin
      controls.stop()
      
      clearInterval(soundIntervalRef.current!)
      
      // Animate to the target
      await controls.start({
        rotate: finalRotation,
        transition: { 
          duration: 15,
          ease: [0.1, 0, 0.1, 1], // Custom bezier for "spin" feel
        }
      })
      
      playWinSound()
      fireConfetti()
      setWinner(selectedGuest)
      setIsSpinning(false) // Fixed: Reset spinning state
      onSpinComplete(selectedGuest)
      
    } catch (error) {
      console.error('Spin failed:', error)
      setIsSpinning(false)
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current)
    } finally {
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current)
    }
  }

  // Cleanup sounds
  useEffect(() => {
    return () => {
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
      <div className="relative w-full max-w-[600px] aspect-square mb-8">
        {/* Pointer / Indicator - Static at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-12 pointer-events-none">
          <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[32px] border-t-zinc-800 drop-shadow-lg" />
        </div>

        {/* The Wheel */}
        <motion.div 
          className="w-full h-full"
          animate={controls}
          initial={{ rotate: 0 }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl transform-gpu">
            <circle cx="50" cy="50" r="49" fill="#333" />
            <g>
              {guests.length === 1 ? (
                <g>
                  <circle cx={center} cy={center} r={radius} fill={COLORS[0]} stroke="white" strokeWidth="0.5" />
                  <text
                    x={center}
                    y={center}
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {guests[0].name}
                  </text>
                </g>
              ) : (
                guests.map((guest, i) => {
                  const startAngle = i * sliceAngle
                  const endAngle = (i + 1) * sliceAngle
                  const start = getCoordinatesForAngle(startAngle)
                  const end = getCoordinatesForAngle(endAngle)
                  const isLargeArc = sliceAngle > 180 ? 1 : 0
                  
                  // Create path for the slice
                  const pathData = [
                    `M ${center} ${center}`,
                    `L ${start.x} ${start.y}`,
                    `A ${radius} ${radius} 0 ${isLargeArc} 1 ${end.x} ${end.y}`,
                    'Z'
                  ].join(' ')
                  
                  // Text position (midpoint of slice)
                  const midAngle = startAngle + sliceAngle / 2
                  // Place text at 75% radius
                  const textRadius = radius * 0.75
                  const textRad = (midAngle - 90) * (Math.PI / 180)
                  const textX = center + textRadius * Math.cos(textRad)
                  const textY = center + textRadius * Math.sin(textRad)
                  
                  return (
                    <g key={guest.id}>
                      <path 
                        d={pathData} 
                        fill={COLORS[i % COLORS.length]} 
                        stroke="white" 
                        strokeWidth="0.5"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="3"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${midAngle - 90}, ${textX}, ${textY})`} // Rotate text to align with slice (radial)
                        style={{ pointerEvents: 'none' }}
                      >
                        {guest.name.length > 12 ? guest.name.substring(0, 10) + '...' : guest.name}
                      </text>
                    </g>
                  )
                })
              )}
            </g>
          </svg>
        </motion.div>
        
        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center z-10 border-4 border-gray-200">
          <span className="text-2xl">🎅</span>
        </div>
      </div>

      <div className="text-center space-y-6 relative z-50">
        <Button 
          size="lg"
          onClick={handleSpin}
          disabled={isSpinning || guests.length === 0}
          className="bg-red-600 hover:bg-red-700 text-white text-xl px-12 py-6 rounded-full shadow-lg transform transition hover:scale-105"
        >
          {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
        </Button>
        
        <AnimatePresence>
          {winner && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 100 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setWinner(null)}
            >
              <motion.div 
                className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl border-8 border-gold text-center max-w-2xl w-full relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                initial={{ rotate: -5 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-red-500 via-green-500 to-red-500" />
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-8xl mb-6"
                >
                  🎅
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4 font-serif">
                  Ho Ho Ho!
                </h2>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  The wheel has spoken! This year's Santa is...
                </p>
                
                <motion.div 
                  className="text-5xl md:text-7xl font-extrabold text-red-600 drop-shadow-md mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {winner.name}
                </motion.div>

                <p className="text-lg text-muted-foreground italic mb-8">
                  "Drinks are on the house for you!" 🍻
                </p>

                <Button 
                  onClick={() => setWinner(null)}
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 rounded-full shadow-lg"
                >
                  Celebrate & Close 🎉
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'

// Simple sound effect generator using Web Audio API
export function useSoundEffect() {
  const audioContextRef = useRef<AudioContext | null>(null)
  
  // Initialize audio context on user interaction
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }
  
  // Play a spinning sound effect
  const playSpinSound = () => {
    if (!audioContextRef.current) return
    
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    // Configure the sound
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(200, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1)
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)
    
    // Play the sound
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 1)
  }
  
  // Play a winning sound effect
  const playWinSound = () => {
    if (!audioContextRef.current) return
    
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    // Configure the sound
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2) // E5
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.4) // G5
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime + 0.4)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
    
    // Play the sound
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.8)
  }
  
  // Clean up audio context
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])
  
  return {
    initAudioContext,
    playSpinSound,
    playWinSound
  }
}

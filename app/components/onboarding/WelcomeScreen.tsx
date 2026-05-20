'use client'
// Screen 0c — Welcome
// Personalised "hi, {name}" greeting; auto-advances to Tracking Home after 2 s.

import { useEffect } from 'react'

interface WelcomeScreenProps {
  userName: string
  onComplete: () => void
}

export default function WelcomeScreen({ userName, onComplete }: WelcomeScreenProps) {
  useEffect(() => {
    const id = setTimeout(onComplete, 2000)
    return () => clearTimeout(id)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Soft iridescent gradient blob */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)',
          filter: 'blur(40px)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      <h1
        style={{
          position: 'relative',
          fontSize: 26,
          fontWeight: 700,
          color: '#000000',
          letterSpacing: '-1px',
          textAlign: 'center',
          fontFamily: 'inherit',
        }}
      >
        hi, {userName}
      </h1>
      <p style={{ position: 'relative', fontSize: 13, color: '#999999', textAlign: 'center' }}>
        your smile journey starts now
      </p>
    </div>
  )
}

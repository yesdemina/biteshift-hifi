'use client'
// Screen 2b — Active Scanning
// No tab bar. Progress bar auto-fills over ~6 seconds then calls onComplete.

import { useState, useEffect, useRef } from 'react'

interface ActiveScanningProps {
  onClose: () => void
  onComplete: () => void
}

export default function ActiveScanning({ onClose, onComplete }: ActiveScanningProps) {
  const [progress, setProgress] = useState(0) // 0–100
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    // Animate progress 0 → 100 over ~6 seconds (60 steps × 100ms)
    let current = 0
    const STEPS = 60
    const INTERVAL_MS = 100

    const id = setInterval(() => {
      current += 1
      setProgress(Math.min((current / STEPS) * 100, 100))
      if (current >= STEPS) {
        clearInterval(id)
        setTimeout(() => onCompleteRef.current(), 400)
      }
    }, INTERVAL_MS)

    return () => clearInterval(id)
  }, [])

  const elapsedSeconds = Math.round((progress / 100) * 60)
  const timeLabel = `0:${String(elapsedSeconds).padStart(2, '0')}`

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '0 24px',
        background: '#FFFFFF',
      }}
    >
      {/* Close button row */}
      <div style={{ paddingTop: 14, paddingBottom: 4 }}>
        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#F5F5F5',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 18,
            color: '#999999',
          }}
          aria-label="Close scanner"
        >
          ✕
        </button>
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', marginTop: 12, letterSpacing: '-0.4px' }}>
        hold steady
      </h1>

      {/* Large square hero — scanner preview */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 280,
            height: 280,
            borderRadius: 20,
            background: '#FFFFFF',
            border: '1px solid #F0F0F0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,179,209,0.35) 0%, rgba(224,200,255,0.25) 55%, transparent 100%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ position: 'relative' }}>
            <rect x="13" y="6" width="14" height="6" rx="2" stroke="#999999" strokeWidth="1.8" />
            <rect x="4" y="11" width="32" height="24" rx="4" stroke="#999999" strokeWidth="1.8" />
            <circle cx="20" cy="23" r="7" stroke="#999999" strokeWidth="1.8" />
          </svg>
          <span style={{ position: 'relative', fontSize: 12, color: '#999999' }}>
            live scanner preview
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <p style={{ fontSize: 12, color: '#999999', textAlign: 'center', marginBottom: 16 }}>
        move slowly along your upper arch
      </p>

      {/* Progress bar + time */}
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
            fontSize: 12,
            color: '#999999',
          }}
        >
          <span>{timeLabel}</span>
          <span>1:00</span>
        </div>
        <div
          style={{
            height: 8,
            background: '#F5F5F5',
            borderRadius: 999,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 100%)',
              borderRadius: 999,
              transition: 'width 80ms linear',
            }}
          />
        </div>
      </div>
    </div>
  )
}

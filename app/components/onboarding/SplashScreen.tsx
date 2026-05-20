'use client'
// Screen 0 — Splash
// Full-bleed white; "shift happens" centered; no status bar, no tab bar.
// Auto-advances after 2.5 s: → Onboarding (no userName) or Tracking (has userName).

import { useEffect, type CSSProperties } from 'react'

interface SplashScreenProps {
  hasUser: boolean          // if true, skip onboarding and go straight to main app
  onComplete: () => void    // called after 2.5 s
}

// "shift happens" — per-letter initial misalignment offsets (left-to-right).
// `null` marks the non-breaking space between the two words (not animated).
const SLOGAN_LETTERS: ({ char: string; y: number; rot: number } | null)[] = [
  { char: 's', y: -6, rot: -7 },
  { char: 'h', y:  4, rot:  5 },
  { char: 'i', y: -3, rot: -4 },
  { char: 'f', y:  7, rot:  6 },
  { char: 't', y: -5, rot: -3 },
  null,
  { char: 'h', y:  3, rot:  4 },
  { char: 'a', y: -7, rot: -6 },
  { char: 'p', y:  5, rot:  7 },
  { char: 'p', y: -4, rot: -5 },
  { char: 'e', y:  6, rot:  3 },
  { char: 'n', y: -3, rot: -4 },
  { char: 's', y:  4, rot:  5 },
]

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const id = setTimeout(onComplete, 2500)
    return () => clearTimeout(id)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: '#1A1A1A',
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
            userSelect: 'none',
          }}
        >
          biteshift
        </span>
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#1A1A1A',
            letterSpacing: '-2.5px',
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
            userSelect: 'none',
          }}
        >
          {SLOGAN_LETTERS.map((letter, i) =>
            letter === null ? (
              <span key={i}>{' '}</span>
            ) : (
              <span
                key={i}
                className="settle-letter"
                style={{
                  '--start-y': `${letter.y}px`,
                  '--start-rot': `${letter.rot}deg`,
                } as CSSProperties}
              >
                {letter.char}
              </span>
            )
          )}
        </span>
      </div>
    </div>
  )
}

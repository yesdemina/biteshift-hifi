'use client'
// Screen 0b — Onboarding / Auth
// Collects name + password (wireframe only). "let's go" disabled until name ≥ 1 char.
// Saves name into app state and advances to Welcome (0c).

import { useState } from 'react'

interface OnboardingScreenProps {
  onSubmit: (name: string) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  fontSize: 16,
  color: '#000000',
  background: '#FFFFFF',
  borderRadius: 12,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  WebkitTapHighlightColor: 'transparent',
}

export default function OnboardingScreen({ onSubmit }: OnboardingScreenProps) {
  const [name, setName]         = useState('')
  const [password, setPassword] = useState('')

  const canSubmit = name.trim().length >= 2

  const handleSubmit = () => {
    if (!canSubmit) return
    const trimmed = name.trim()
    // Auto-capitalize the first letter — proper names get a capital.
    onSubmit(trimmed.charAt(0).toUpperCase() + trimmed.slice(1))
  }

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
        padding: '0 40px',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Iridescent gradient blob — subtle */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)',
          filter: 'blur(50px)',
          opacity: 0.28,
          pointerEvents: 'none',
        }}
      />

      {/* Wordmark — pinned near top */}
      <span
        style={{
          position: 'absolute',
          top: 52,
          fontSize: 14,
          fontWeight: 400,
          color: '#999999',
          fontFamily: 'inherit',
          userSelect: 'none',
        }}
      >
        biteshift
      </span>

      {/* Headline */}
      <h1
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: '#000000',
          letterSpacing: '-1px',
          marginBottom: 8,
          textAlign: 'center',
          fontFamily: 'inherit',
        }}
      >
        welcome
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 13,
          color: '#999999',
          marginBottom: 28,
          textAlign: 'center',
        }}
      >
        let&apos;s set you up
      </p>

      {/* Name field */}
      <div style={{ width: '100%', marginBottom: 12 }}>
        <input
          type="text"
          className="field-input"
          placeholder="your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          autoComplete="off"
          style={inputStyle}
        />
      </div>

      {/* Password field */}
      <div style={{ width: '100%', marginBottom: 24 }}>
        <input
          type="password"
          className="field-input"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          style={inputStyle}
        />
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          width: '100%',
          padding: '14px 0',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'inherit',
          letterSpacing: '-0.2px',
          background: canSubmit ? '#000000' : '#E0E0E0',
          color: canSubmit ? '#FFFFFF' : '#999999',
          border: 'none',
          borderRadius: 14,
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        let&apos;s go
      </button>
    </div>
  )
}

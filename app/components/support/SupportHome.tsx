'use client'
// Screen 4a — Support Home

import { useState, useRef, useEffect } from 'react'
import { reminderCards, supplies } from '@/lib/mockData'

interface SupportHomeProps {
  userName:  string
  onProfile: () => void
}

const CARD_BGS = ['#FFD9E5', '#EFE0FF', '#E0EEEE']

// Toast copy keyed by data id.
const REMINDER_TOASTS: Record<string, string> = {
  tip:     'order placed · arriving in 3-5 days',
  brush:   'opening shop · coming soon',
  checkup: "we'll remind you closer to the date",
}
const SUPPLY_TOASTS: Record<string, string> = {
  tips:     'scanner tips · coming soon',
  brackets: 'brackets care kit · coming soon',
  cleaning: 'cleaning brushes · coming soon',
}

function ChevronRight() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
      <path d="M1.5 1.5L6.5 6.5L1.5 11.5" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function SupportHome({ userName, onProfile }: SupportHomeProps) {
  const trimmed = userName.trim()
  const greeting = trimmed ? `hi, ${trimmed}` : 'hi there'

  // ── Toast — single instance, slides up from the bottom, holds 2s ───────────
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [toastOn,  setToastOn]  = useState(false)
  const hideRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const unmountRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (hideRef.current) clearTimeout(hideRef.current)
    if (unmountRef.current) clearTimeout(unmountRef.current)
  }, [])

  const triggerToast = (msg: string) => {
    if (hideRef.current) clearTimeout(hideRef.current)
    if (unmountRef.current) clearTimeout(unmountRef.current)
    // Mount hidden, then animate in on the next frame (replaces any current toast).
    setToastMsg(msg)
    setToastOn(false)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setToastOn(true))
    )
    hideRef.current = setTimeout(() => {
      setToastOn(false)
      unmountRef.current = setTimeout(() => setToastMsg(null), 220)
    }, 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24, background: '#FFFFFF' }}>
      {/* Headline + avatar — headline absolutely centered across the screen while
          the avatar stays pinned to the right (so the title reads centered like
          every other screen without shifting the avatar). */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '14px 24px 0',
        }}
      >
        <h1
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: 14,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            color: '#000000',
            letterSpacing: '-0.4px',
            margin: 0,
            // Full-width overlay sits over the avatar; let taps pass through to it.
            pointerEvents: 'none',
          }}
        >
          {greeting}
        </h1>
        <button
          onClick={onProfile}
          aria-label="Profile"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#FFD9E5',
            border: 'none',
            cursor: 'pointer',
            overflow: 'hidden',
            flexShrink: 0,
            padding: 0,
          }}
        >
          <img
            src="/user.png"
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '50% 25%',
              display: 'block',
            }}
          />
        </button>
      </div>

      {/* Reminder cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 24px 0' }}>
        {reminderCards.map((card, i) => (
          <div
            key={card.id}
            style={{
              background: CARD_BGS[i % CARD_BGS.length],
              borderRadius: 20,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <p style={{ fontSize: 13, color: '#000000', lineHeight: 1.28, flex: 1 }}>
              {card.text}
            </p>
            <button
              className="press-dim"
              onClick={() => triggerToast(REMINDER_TOASTS[card.id] ?? '')}
              style={{
                background: '#000000',
                border: 'none',
                borderRadius: 12,
                padding: '7px 14px',
                fontSize: 12,
                color: '#FFFFFF',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {card.action.toLowerCase()}
            </button>
          </div>
        ))}
      </div>

      {/* Supplies section */}
      <div style={{ padding: '20px 24px 0' }}>
        <div
          style={{
            fontSize: 9,
            color: '#999999',
            fontWeight: 600,
            letterSpacing: '0.5px',
            marginBottom: 6,
          }}
        >
          SUPPLIES
        </div>
        <div>
          {supplies.map((item, i) => (
            <button
              key={item.id}
              className="press-dim"
              onClick={() => triggerToast(SUPPLY_TOASTS[item.id] ?? '')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 4px',
                background: 'none',
                border: 'none',
                borderBottom: i === supplies.length - 1 ? 'none' : '0.5px solid rgba(0,0,0,0.06)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 13, color: '#000000' }}>{item.label.toLowerCase()}</span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </div>

      {/* Toast — black pill, anchored above the tab bar (bottom-center of frame) */}
      {toastMsg && (
        <div
          style={{
            position: 'absolute',
            bottom: 92,
            left: '50%',
            transform: toastOn
              ? 'translateX(-50%) translateY(0)'
              : 'translateX(-50%) translateY(8px)',
            opacity: toastOn ? 1 : 0,
            transition: 'opacity 200ms ease, transform 200ms ease',
            maxWidth: 320,
            padding: '12px 20px',
            background: '#000000',
            color: '#FFFFFF',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            zIndex: 40,
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  )
}

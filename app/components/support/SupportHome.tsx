// Screen 4a — Support Home

import { reminderCards, supplies } from '@/lib/mockData'

interface SupportHomeProps {
  userName:  string
  onProfile: () => void
}

const CARD_BGS = ['#FFD9E5', '#EFE0FF', '#E0EEEE']

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24, background: '#FFFFFF' }}>
      {/* Headline + avatar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px 0',
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', letterSpacing: '-0.4px', margin: 0 }}>
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
            <p style={{ fontSize: 13, color: '#000000', lineHeight: 1.45, flex: 1 }}>
              {card.text}
            </p>
            <button
              style={{
                background: '#000000',
                border: 'none',
                borderRadius: 999,
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
    </div>
  )
}

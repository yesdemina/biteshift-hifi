// Screen 3a — Camera Disarmed (default state)
// Tapping the toggle row OR any duration chip arms the camera → 3b.

import HowItWorks from '@/app/components/camera/HowItWorks'

interface CameraDisarmedProps {
  onArm: (duration: string) => void
}

const CHIPS = ['arm for 15 min', 'arm for 1 hour', 'arm until I turn off'] as const

// Small pill toggle — OFF state
function Toggle() {
  return (
    <div
      style={{
        width: 48,
        height: 28,
        borderRadius: 999,
        background: '#E0E0E0',
        position: 'relative',
        flexShrink: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 0 0 0.5px rgba(0,0,0,0.05)',
          transition: 'left 0.2s ease',
        }}
      />
    </div>
  )
}

export default function CameraDisarmed({ onArm }: CameraDisarmedProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 16, background: '#FFFFFF' }}>
      {/* Headline */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', padding: '14px 24px 0', letterSpacing: '-0.4px' }}>
        hands-free camera
      </h1>

      {/* Hero — sleeping camera visual */}
      <div style={{ padding: '12px 24px 0' }}>
        <div
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            background: '#1A1A1A',
            borderRadius: 12,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="11" y="5" width="10" height="5" rx="1.5" stroke="#666666" strokeWidth="1.5" />
            <rect x="3" y="9" width="26" height="19" rx="3" stroke="#666666" strokeWidth="1.5" />
            <circle cx="16" cy="18.5" r="6" stroke="#666666" strokeWidth="1.5" />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span
              className="sleep-dot"
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#999999', display: 'block' }}
            />
            <span style={{ fontSize: 12, color: '#999999', fontWeight: 300 }}>
              your bracket camera is asleep
            </span>
          </div>
        </div>
        {/* Caption */}
        <p style={{ fontSize: 12, color: '#999999', marginTop: 6, textAlign: 'center' }}>
          your camera is sleeping
        </p>
      </div>

      {/* Status row — clickable to arm */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Arm camera"
        onClick={() => onArm('toggle')}
        onKeyDown={(e) => e.key === 'Enter' && onArm('toggle')}
        style={{
          margin: '12px 24px 0',
          height: 56,
          background: '#FFFFFF',
          border: '0.5px solid rgba(0,0,0,0.15)',
          borderRadius: 20,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none' }}>
          <Toggle />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#000000', letterSpacing: '0.5px' }}>
            DISARMED
          </span>
        </div>
      </div>

      {/* How it works */}
      <HowItWorks />

      {/* Duration chip row */}
      <div style={{ padding: '14px 24px 0' }}>
        <div
          style={{
            fontSize: 9,
            color: '#999999',
            fontWeight: 600,
            letterSpacing: '0.5px',
            marginBottom: 8,
          }}
        >
          ARM FOR
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => onArm(chip)}
              style={{
                padding: '7px 13px',
                background: '#FFD9E5',
                border: 'none',
                borderRadius: 999,
                fontSize: 12,
                color: '#000000',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

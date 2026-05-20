// Screen 3a — Camera Disarmed (default state)
// Tapping the toggle card OR any duration chip arms the camera → 3b.

interface CameraDisarmedProps {
  onArm: (duration: string) => void
}

const CHIPS = ['Arm for 15 min', 'Arm for 1 hour', 'Arm until I turn off'] as const

// Pill toggle — OFF state (pure visual)
function ToggleOff() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'none' }}>
      {/* Track */}
      <div
        style={{
          width: 56,
          height: 30,
          borderRadius: 15,
          background: '#E0E0E0',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* Thumb — left side = OFF */}
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: 3,
            width: 24,
            height: 24,
            borderRadius: 12,
            background: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          }}
        />
      </div>
      <span style={{ fontSize: 22, fontWeight: 800, color: '#AAAAAA', letterSpacing: '0.5px' }}>
        DISARMED
      </span>
    </div>
  )
}

export default function CameraDisarmed({ onArm }: CameraDisarmedProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24 }}>
      {/* Headline */}
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', padding: '16px 24px 0' }}>
        Hands-free camera
      </h1>

      {/* Hero — sleeping camera visual */}
      <div style={{ padding: '14px 24px 0' }}>
        <div
          style={{
            width:          '100%',
            aspectRatio:    '1 / 1',
            background:     '#1A1A1A',
            borderRadius:   12,
            overflow:       'hidden',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            12,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="11" y="5" width="10" height="5" rx="1.5" stroke="#666666" strokeWidth="1.6" />
            <rect x="3" y="9" width="26" height="19" rx="3" stroke="#666666" strokeWidth="1.6" />
            <circle cx="16" cy="18.5" r="6" stroke="#666666" strokeWidth="1.6" />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span
              className="sleep-dot"
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#999999', display: 'block' }}
            />
            <span style={{ fontSize: 13, color: '#999999', fontWeight: 300 }}>
              your bracket camera is asleep
            </span>
          </div>
        </div>
      </div>

      {/* ── Status card — entire card is clickable to arm ── */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Arm camera"
        onClick={() => onArm('toggle')}
        onKeyDown={(e) => e.key === 'Enter' && onArm('toggle')}
        style={{
          margin: '16px 24px 0',
          background: '#F5F5F5',
          border: '1px solid #E0E0E0',
          borderRadius: 14,
          padding: '18px 20px',
          cursor: 'pointer',
          // Subtle press feedback via active pseudo-class is not possible inline;
          // the cursor change gives sufficient affordance for a lo-fi prototype.
        }}
      >
        <ToggleOff />
      </div>

      {/* Mechanics text */}
      <div style={{ padding: '14px 24px 0' }}>
        <p style={{ fontSize: 13, color: '#666666', lineHeight: 1.55 }}>
          Arm the camera to capture hands-free.{' '}
          <strong style={{ color: '#1A1A1A', fontWeight: 600 }}>Triple-click your teeth</strong>{' '}
          for a photo.{' '}
          <strong style={{ color: '#1A1A1A', fontWeight: 600 }}>Press and hold (bite 2s)</strong>{' '}
          for video.
        </p>
      </div>

      {/* Duration chip row */}
      <div style={{ padding: '16px 24px 0' }}>
        <div
          style={{
            fontSize: 11,
            color: '#999999',
            fontWeight: 600,
            letterSpacing: '0.5px',
            marginBottom: 10,
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
                padding: '9px 14px',
                background: '#FFFFFF',
                border: '1px solid #C8C8C8',
                borderRadius: 20,
                fontSize: 13,
                color: '#1A1A1A',
                fontWeight: 500,
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

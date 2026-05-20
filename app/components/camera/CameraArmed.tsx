// Screen 3b — Camera Armed
// Toggle row is clickable → disarms. "disarm now" also disarms. "view drafts" → 3c.

import HowItWorks from '@/app/components/camera/HowItWorks'

interface CameraArmedProps {
  onDisarm: () => void
  onViewDrafts: () => void
  draftsCount: number
}

// Small pill toggle — ON state
function Toggle() {
  return (
    <div
      style={{
        width: 48,
        height: 28,
        borderRadius: 999,
        background: '#FFB3D1',
        position: 'relative',
        flexShrink: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          right: 3,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 0 0 0.5px rgba(0,0,0,0.05)',
          transition: 'right 0.2s ease',
        }}
      />
    </div>
  )
}

export default function CameraArmed({ onDisarm, onViewDrafts, draftsCount }: CameraArmedProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 16, background: '#FFFFFF' }}>
      {/* Headline */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', padding: '14px 24px 0', letterSpacing: '-0.4px' }}>
        hands-free camera
      </h1>

      {/* Hero — live POV with mouth vignette */}
      <div style={{ padding: '12px 24px 0' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <img
            src="/camera-pov.jpg"
            alt="Live POV preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Mouth vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 70% 80% at center, transparent 50%, rgba(0,0,0,0.75) 85%, rgba(0,0,0,0.95) 100%)',
              pointerEvents: 'none',
            }}
          />
          {/* Recording indicator */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ fontSize: 11, color: '#FFFFFF', letterSpacing: '0.5px' }}>REC</span>
            <span
              className="rec-dot"
              style={{ width: 10, height: 10, borderRadius: '50%', background: '#E53935', display: 'block' }}
            />
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#999999', marginTop: 6, textAlign: 'center' }}>
          what your camera sees right now
        </p>
      </div>

      {/* Status row — clickable to disarm */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Disarm camera"
        onClick={onDisarm}
        onKeyDown={(e) => e.key === 'Enter' && onDisarm()}
        style={{
          margin: '12px 24px 0',
          height: 56,
          background: '#E0EEEE',
          border: 'none',
          borderRadius: 20,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none' }}>
          <Toggle />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#000000', letterSpacing: '0.5px' }}>
            ARMED
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#666666', pointerEvents: 'none' }}>
          auto-off in{' '}
          <span style={{ fontWeight: 600, color: '#000000', fontVariantNumeric: 'tabular-nums' }}>58:42</span>
        </span>
      </div>

      {/* How it works */}
      <HowItWorks />

      {/* Captures counter */}
      <p style={{ fontSize: 12, color: '#999999', padding: '8px 24px 0' }}>
        captures in drafts:{' '}
        <span style={{ fontWeight: 600, color: '#000000', fontVariantNumeric: 'tabular-nums' }}>
          {draftsCount}
        </span>
      </p>

      {/* Action button */}
      <div style={{ padding: '14px 24px 0' }}>
        <button
          onClick={onViewDrafts}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#FFFFFF',
            color: '#000000',
            border: '0.5px solid #000000',
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          view drafts
        </button>
      </div>
    </div>
  )
}

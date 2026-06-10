// Screen 2d — Tooth Detail
// "got it" returns to Scan Result (2c).

import type { ToothZone } from '@/lib/mockData'

interface ToothDetailProps {
  onBack: () => void
  zone: ToothZone
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#000000',
        fontSize: 13,
        padding: 0,
      }}
    >
      <svg width="8" height="14" viewBox="0 0 9 15" fill="none">
        <path d="M7.5 1.5L2 7.5L7.5 13.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      back
    </button>
  )
}

const CARD_BGS = ['#FFD9E5', '#EFE0FF', '#E0EEEE']

function InfoCard({ tag, text, bg }: { tag: string; text: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: 20, padding: '16px 18px' }}>
      <span
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: '#666666',
          letterSpacing: '0.5px',
          marginRight: 8,
        }}
      >
        {tag}
      </span>
      <span style={{ fontSize: 13, color: '#000000', lineHeight: 1.3 }}>{text}</span>
    </div>
  )
}

export default function ToothDetail({ onBack, zone }: ToothDetailProps) {
  // Crop focus + zoom come from the tapped zone (image-space %), so the hero
  // frames the exact tooth selected on 2c instead of a hardcoded constant.
  const TOOTH_FOCUS = zone.focus
  const TOOTH_ZOOM = zone.zoom

  // Accent color follows the zone type so 2d matches its 2c marker: gum → mint,
  // plaque → pink. Drives the target ring (stroke / glow / frosted fill), the
  // inner dashed reticle, the zone caption, and the header pill tint.
  const accent =
    zone.type === 'gum'
      ? { ring: '#9AD2D2', innerDash: '#9AD2D2', glowRgb: '154,210,210', caption: '#3C8585', headerPill: '#DCEFEF' }
      : { ring: '#FF8FB8', innerDash: '#FF8FB8', glowRgb: '255,143,184', caption: '#B23A6F', headerPill: '#FFD9E5' }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24, background: '#FFFFFF' }}>
      {/* Top row */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: '16px 24px 0',
        }}
      >
        <BackButton onBack={onBack} />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'inline-flex',
            alignItems: 'center',
            background: accent.headerPill,
            borderRadius: 999,
            padding: '5px 12px',
            fontSize: 12,
            color: '#000000',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {zone.pill.toLowerCase()}
        </div>
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', padding: '14px 24px 0', letterSpacing: '-0.4px', textAlign: 'center' }}>
        {zone.headline.toLowerCase()}
      </h1>

      {/* Hero — zoomed crop of the affected tooth with a target ring on the problem zone */}
      <div style={{ padding: '14px 24px 0' }}>
        <div
          style={{
            position: 'relative',
            height: 190,
            borderRadius: 20,
            background: '#F5F5F5',
            overflow: 'hidden',
          }}
        >
          {/* Zoomed crop of /teeth.png, framed on the affected tooth via background-position */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/teeth.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${TOOTH_ZOOM}%`,
              backgroundPosition: `${TOOTH_FOCUS.x}% ${TOOTH_FOCUS.y}%`,
            }}
          />
          {/* Target ring — matches 2c: outer solid + inner dashed reticle + soft glow */}
          <div
            style={{
              position: 'absolute',
              left: `${TOOTH_FOCUS.x}%`,
              top: `${TOOTH_FOCUS.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: `2px solid ${accent.ring}`,
              background: `radial-gradient(circle, rgba(${accent.glowRgb},0.16) 0%, transparent 66%)`,
              boxShadow: `0 0 12px rgba(${accent.glowRgb},0.55), inset 0 0 8px rgba(${accent.glowRgb},0.5)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              animation: 'problemRingPulse 2.4s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          >
            {/* Concentric inner reticle — thinner dashed ring */}
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: `1px dashed ${accent.innerDash}`,
                boxSizing: 'border-box',
              }}
            />
          </div>
          {/* Zone caption */}
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.82)',
              borderRadius: 999,
              padding: '3px 10px',
              fontSize: 10,
              fontWeight: 600,
              color: accent.caption,
              letterSpacing: '0.04em',
              pointerEvents: 'none',
            }}
          >
            inner surface
          </div>
        </div>
      </div>

      {/* Three info cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 24px 0' }}>
        <InfoCard tag="ISSUE" text={zone.issue} bg={CARD_BGS[0]} />
        <InfoCard tag="WHY"   text={zone.why}   bg={CARD_BGS[1]} />
        <InfoCard tag="FIX"   text={zone.fix}   bg={CARD_BGS[2]} />
      </div>

      {/* Got it */}
      <div style={{ padding: '20px 24px 0' }}>
        <button
          onClick={onBack}
          style={{
            width: '100%',
            padding: '14px 0',
            background: '#000000',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          got it
        </button>
      </div>
    </div>
  )
}

// Screen 2c — Scan Result
// Only the 3 problem-tooth glows are tappable; healthy teeth are inert.

import { hygieneData } from '@/lib/mockData'

interface ScanResultProps {
  onBack: () => void
  onToothDetail: () => void
}

// Pink for PLAQUE, mint for GUM INFLAMED — used by the radial glows.
// Positions are % within the teeth IMAGE box (so they scale with the image).
const PROBLEMS: {
  type: 'plaque' | 'gum'
  left: string
  top: string
}[] = [
  { type: 'plaque', left: '13%', top: '60%' },
  { type: 'plaque', left: '56%', top: '64%' },
  { type: 'gum',    left: '81%', top: '24%' },
]

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

function MintPill() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: '#FFD9E5',
        borderRadius: 999,
        padding: '5px 12px',
        fontSize: 12,
        color: '#000000',
        fontWeight: 600,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF8FBC', display: 'inline-block' }} />
      scan complete · just now
    </div>
  )
}

// Neumorphic white stat card — matches the Tracking screen's metric cards.
function DetectedCard({ value, subtext }: { value: string; subtext: string }) {
  return (
    <div
      style={{
        flex: 1,
        height: 90,
        background: '#FFFFFF',
        borderRadius: 24,
        border: '0.5px solid rgba(0,0,0,0.05)',
        boxShadow:
          '-8px -8px 16px rgba(255,255,255,1), 8px 8px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: '#666666',
          fontWeight: 600,
          letterSpacing: '0.08em',
          flexShrink: 0,
        }}
      >
        DETECTED
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          fontSize: 28,
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#666666', lineHeight: 1.3, flexShrink: 0 }}>
        {subtext}
      </div>
    </div>
  )
}

// Teeth illustration in a 320px-tall container. The image sits centered; the
// problem-tooth glows live in the image box (so they track the image), while
// the floating labels hug the outer container edges.
function TeethZones({ onProblemTap }: { onProblemTap: () => void }) {
  return (
    <div
      style={{
        position: 'relative',
        height: 320,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Image box — overlays positioned relative to the teeth image itself */}
      <div style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
        <img
          src="/teeth.png"
          alt="Dental arch"
          style={{ display: 'block', width: 290, height: 'auto' }}
        />

        {/* Problem-tooth glows — only these are interactive */}
        {PROBLEMS.map((p, i) => (
          <div
            key={i}
            className="problem-glow"
            role="button"
            tabIndex={0}
            aria-label={p.type === 'plaque' ? 'Plaque tooth' : 'Inflamed gum'}
            onClick={onProblemTap}
            onKeyDown={(e) => e.key === 'Enter' && onProblemTap()}
            style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              transform: 'translate(-50%, -50%)',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background:
                p.type === 'plaque'
                  ? 'radial-gradient(circle, #FFB3D1 0%, transparent 70%)'
                  : 'radial-gradient(circle, #C8E0E0 0%, transparent 70%)',
              filter: 'blur(9px)',
            }}
          />
        ))}
      </div>

      {/* Floating PLAQUE label + connector — informational, not tappable */}
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: '56%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#C97FA8' }}>
          PLAQUE
        </span>
        <span style={{ width: 26, height: '0.5px', background: 'rgba(0,0,0,0.25)', display: 'block' }} />
      </div>

      {/* Floating GUM INFLAMED label + connector */}
      <div
        style={{
          position: 'absolute',
          right: 8,
          top: '34%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          pointerEvents: 'none',
        }}
      >
        <span style={{ width: 26, height: '0.5px', background: 'rgba(0,0,0,0.25)', display: 'block' }} />
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#5FA4A4' }}>
          GUM INFLAMED
        </span>
      </div>
    </div>
  )
}

export default function ScanResult({ onBack, onToothDetail }: ScanResultProps) {
  const { plaque, gumCare } = hygieneData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24, background: '#FFFFFF' }}>
      {/* Back button — standalone, top-left */}
      <div style={{ padding: '14px 16px 0' }}>
        <BackButton onBack={onBack} />
      </div>

      {/* Headline — centered */}
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#000000',
          textAlign: 'center',
          marginTop: 24,
          letterSpacing: '-0.4px',
        }}
      >
        here&apos;s what I see
      </h1>

      {/* Status pill — centered, below headline */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <MintPill />
      </div>

      {/* Hero — teeth with tappable problem-tooth glows */}
      <div style={{ padding: '0 24px', marginTop: 24 }}>
        <TeethZones onProblemTap={onToothDetail} />
        <p style={{ fontSize: 11, color: '#999999', textAlign: 'center', marginTop: 12 }}>
          tap a highlighted tooth to inspect →
        </p>
      </div>

      {/* Stat cards — neumorphic white, matching Tracking */}
      <div style={{ display: 'flex', gap: 10, padding: '16px 16px 0' }}>
        <DetectedCard value={String(plaque)} subtext="plaque" />
        <DetectedCard value={String(gumCare)} subtext="gum inflamed" />
      </div>

      {/* INSIGHT — hugs its content (no fixed slot, unlike Tracking) */}
      <div style={{ padding: '16px 16px 0' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)',
            borderRadius: 20,
            padding: 12,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: '#000000',
              fontWeight: 600,
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}
          >
            INSIGHT
          </div>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#000000', lineHeight: 1.3 }}>
            {hygieneData.insight}
          </p>
        </div>
      </div>
    </div>
  )
}

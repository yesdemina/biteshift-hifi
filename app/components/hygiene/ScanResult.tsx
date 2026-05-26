// Screen 2c — Scan Result
// Only the 3 problem-tooth glows are tappable; healthy teeth are inert.

import { hygieneData } from '@/lib/mockData'

interface ScanResultProps {
  onBack: () => void
  onToothDetail: () => void
}

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// Pink for PLAQUE, mint for GUM INFLAMED — used by the radial glows.
const PROBLEMS: {
  type: 'plaque' | 'gum'
  // Position as % within the teeth container box
  left: string
  top: string
}[] = [
  { type: 'plaque', left: '24%', top: '60%' },
  { type: 'plaque', left: '54%', top: '64%' },
  { type: 'gum',    left: '72%', top: '24%' },
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
        background: '#E0EEEE',
        borderRadius: 999,
        padding: '5px 12px',
        fontSize: 12,
        color: '#000000',
        fontWeight: 600,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF7D', display: 'inline-block' }} />
      scan complete · just now
    </div>
  )
}

// Outlined stat card — transparent fill, 0.5px black border
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: 'transparent',
        border: '0.5px solid #000000',
        borderRadius: 20,
        padding: '14px 8px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: '#000000' }}>{value}</div>
      <div style={{ fontSize: 9, color: '#000000', marginTop: 4, letterSpacing: '0.08em', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  )
}

// Teeth illustration with 3 tappable problem-tooth glows and 2 floating labels.
function TeethZones({ onProblemTap }: { onProblemTap: () => void }) {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <img
        src="/teeth.png"
        alt="Dental arch"
        style={{ position: 'relative', width: 240, height: 'auto', display: 'block' }}
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
            width: 40,
            height: 40,
            borderRadius: '50%',
            background:
              p.type === 'plaque'
                ? 'radial-gradient(circle, #FFB3D1 0%, transparent 70%)'
                : 'radial-gradient(circle, #C8E0E0 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      ))}

      {/* Floating PLAQUE label + connector — purely informational, not tappable */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: '26%',
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
          right: 0,
          top: '20%',
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
  const { clean, total, plaque, gumCare } = hygieneData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24, background: '#FFFFFF' }}>
      {/* Top row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px 0',
        }}
      >
        <BackButton onBack={onBack} />
        <MintPill />
        <div style={{ width: 32 }} />
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', padding: '14px 24px 0', letterSpacing: '-0.4px' }}>
        here&apos;s what I see
      </h1>

      {/* Hero — teeth with tappable problem-tooth glows */}
      <div style={{ padding: '16px 24px 0' }}>
        <TeethZones onProblemTap={onToothDetail} />
        <p style={{ fontSize: 11, color: '#999999', textAlign: 'center', marginTop: 6 }}>
          tap a highlighted tooth to inspect →
        </p>
      </div>

      {/* Stat cards — outlined */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 24px 0' }}>
        <StatCard label="CLEAN"        value={`${clean}/${total}`} />
        <StatCard label="PLAQUE"       value={String(plaque)} />
        <StatCard label="GUM INFLAMED" value={String(gumCare)} />
      </div>

      {/* Insight card — bold iridescent */}
      <div style={{ padding: '12px 24px 0' }}>
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)',
            borderRadius: 20,
            padding: '16px 18px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: NOISE_URI,
              opacity: 0.04,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'relative',
              fontSize: 9,
              color: '#000000',
              fontWeight: 600,
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}
          >
            INSIGHT
          </div>
          <p style={{ position: 'relative', fontSize: 13, color: '#000000', lineHeight: 1.45 }}>
            {hygieneData.insight}
          </p>
        </div>
      </div>
    </div>
  )
}

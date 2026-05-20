// Screen 2c — Scan Result
// Tapping the hero advances to Tooth Detail (2d).

import { hygieneData } from '@/lib/mockData'

interface ScanResultProps {
  onBack: () => void
  onToothDetail: () => void
}

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

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

function Halo() {
  return (
    <div
      className="halo-in"
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 43,
          height: 43,
          borderRadius: '50%',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M4 10.5L8 14.5L16 5.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

function StatCard({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div style={{ flex: 1, background: bg, borderRadius: 16, padding: '12px 8px', textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#000000' }}>{value}</div>
      <div style={{ fontSize: 9, color: '#666666', marginTop: 3, letterSpacing: '0.5px', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  )
}

// Zone-based diagnostic glows over the teeth image
function TeethZones() {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      {/* PLAQUE glow — lower-left quadrant */}
      <div
        style={{
          position: 'absolute',
          left: '22%',
          bottom: '18%',
          width: 100,
          height: 80,
          borderRadius: '50%',
          background: '#FFB3D1',
          opacity: 0.5,
          filter: 'blur(25px)',
          pointerEvents: 'none',
        }}
      />
      {/* GUM CARE glow — upper-right quadrant */}
      <div
        style={{
          position: 'absolute',
          right: '22%',
          top: '20%',
          width: 100,
          height: 80,
          borderRadius: '50%',
          background: '#C8E0E0',
          opacity: 0.5,
          filter: 'blur(25px)',
          pointerEvents: 'none',
        }}
      />

      <img
        src="/teeth.png"
        alt="Dental arch"
        style={{ position: 'relative', width: 240, height: 'auto', display: 'block' }}
      />

      {/* PLAQUE label + connector — left */}
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
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', color: '#C97FA8' }}>
          PLAQUE
        </span>
        <span style={{ width: 26, height: '0.5px', background: 'rgba(0,0,0,0.25)', display: 'block' }} />
      </div>

      {/* GUM CARE label + connector — right */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '24%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          pointerEvents: 'none',
        }}
      >
        <span style={{ width: 26, height: '0.5px', background: 'rgba(0,0,0,0.25)', display: 'block' }} />
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', color: '#5FA4A4' }}>
          GUM CARE
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
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', padding: '12px 24px 0', letterSpacing: '-0.4px' }}>
        here&apos;s what I see
      </h1>

      {/* Celebratory halo */}
      <div style={{ padding: '12px 24px 0', display: 'flex', justifyContent: 'center' }}>
        <Halo />
      </div>

      {/* Hero — teeth with zone glows, tappable */}
      <div style={{ padding: '6px 24px 0' }}>
        <div
          onClick={onToothDetail}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onToothDetail()}
          style={{ cursor: 'pointer' }}
          title="Tap to see tooth detail"
        >
          <TeethZones />
        </div>
        <p style={{ fontSize: 11, color: '#999999', textAlign: 'center', marginTop: 6 }}>
          tap arch to inspect a tooth →
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 24px 0' }}>
        <StatCard label="CLEAN"    value={`${clean}/${total}`} bg="#FFD9E5" />
        <StatCard label="PLAQUE"   value={String(plaque)}      bg="#EFE0FF" />
        <StatCard label="GUM CARE" value={String(gumCare)}     bg="#E0EEEE" />
      </div>

      {/* Insight card — bold iridescent */}
      <div style={{ padding: '12px 24px 0' }}>
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)',
            borderRadius: 20,
            padding: '14px 16px',
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
              letterSpacing: '1px',
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

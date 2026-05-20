// Screen 2a — Hygiene Home
// Three flex regions: anchored top, vertically centered hero, anchored bottom.

import { hygieneData } from '@/lib/mockData'

interface HygieneHomeProps {
  onStartScan:   () => void
  onViewHistory: () => void
}

function Pill({ children }: { children: React.ReactNode }) {
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
      {children}
    </div>
  )
}

function SummaryCard() {
  const { clean, total, plaque, gumCare } = hygieneData
  const items = [
    { label: 'CLEAN',    value: `${clean}/${total}` },
    { label: 'PLAQUE',   value: String(plaque) },
    { label: 'GUM CARE', value: String(gumCare) },
  ]
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)',
        borderRadius: 20,
        padding: 16,
        display: 'flex',
      }}
    >
      {items.map(({ label, value }, i) => (
        <div
          key={label}
          style={{
            flex: 1,
            textAlign: 'center',
            borderLeft: i === 0 ? 'none' : '0.5px solid rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: '#000000' }}>{value}</div>
          <div style={{ fontSize: 9, color: '#666666', marginTop: 3, letterSpacing: '0.5px', fontWeight: 600 }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HygieneHome({ onStartScan, onViewHistory }: HygieneHomeProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF' }}>
      {/* ── TOP region ── */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ padding: '14px 24px 0' }}>
          <Pill>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#000000', display: 'inline-block' }} />
            last scan · {hygieneData.lastScanDaysAgo} days ago
          </Pill>
        </div>
        <div style={{ padding: '12px 24px 0' }}>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#000000',
              letterSpacing: '-0.5px',
              whiteSpace: 'nowrap',
            }}
          >
            your hygiene, mapped
          </h1>
        </div>
      </div>

      {/* ── CENTER region — vertically centered hero ── */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 220, height: 160, borderRadius: '50%',
              background: 'rgba(224,200,255,0.35)', filter: 'blur(55px)', pointerEvents: 'none',
            }}
          />
          <img
            src="/teeth.png"
            alt="Dental arch"
            style={{ position: 'relative', width: 240, height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* ── BOTTOM region ── */}
      <div style={{ flexShrink: 0, paddingBottom: 16 }}>
        <div style={{ padding: '0 24px' }}>
          <SummaryCard />
        </div>

        <div style={{ padding: '14px 24px 0' }}>
          <button
            onClick={onStartScan}
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
            start new scan
          </button>
        </div>

        <div style={{ padding: '12px 24px 0', textAlign: 'center' }}>
          <button
            onClick={onViewHistory}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 12,
              color: '#999999',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            view history
          </button>
        </div>
      </div>
    </div>
  )
}

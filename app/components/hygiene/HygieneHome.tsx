// Screen 2a — Hygiene Home — scanning launch pad

import { hygieneData } from '@/lib/mockData'

interface HygieneHomeProps {
  onStartScan:   () => void
  onViewHistory: () => void
}

// Whether the user has any past scans. Hardcoded true for the prototype.
const hasScans = true

const GRADIENT = 'linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)'

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

export default function HygieneHome({ onStartScan, onViewHistory }: HygieneHomeProps) {
  const { clean, total, plaque, gumCare } = hygieneData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF' }}>
      {/* ── Top: pill + headline (anchored) ── */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ padding: '14px 24px 0' }}>
          {hasScans ? (
            <Pill>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#000000', display: 'inline-block' }} />
              last scan · {hygieneData.lastScanDaysAgo} days ago
            </Pill>
          ) : (
            <Pill>no scans yet</Pill>
          )}
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

      {/* ── Centered launch-pad group ── */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        {/* Pulsing gradient circle + halo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: GRADIENT,
              filter: 'blur(24px)',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />
          <div
            className="scanner-pulse"
            style={{
              position: 'relative',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: GRADIENT,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#000000' }} />
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#333333' }}>
              scanner ready
            </span>
          </div>
        </div>

        {/* Microcopy */}
        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#999999', lineHeight: 1.5 }}>
          {hasScans ? (
            <>
              <div>grab your scanner</div>
              <div>and point it at your arch</div>
            </>
          ) : (
            <div>let&apos;s map your hygiene for the first time</div>
          )}
        </div>

        {/* Primary CTA */}
        <button
          onClick={onStartScan}
          style={{
            width: '100%',
            marginTop: 20,
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

        {/* Last result inline strip */}
        {hasScans && (
          <p style={{ marginTop: 16, fontSize: 12, color: '#666666', textAlign: 'center' }}>
            last result: {clean}/{total} clean · {plaque} plaque · {gumCare} gum care
          </p>
        )}

        {/* View history */}
        {hasScans && (
          <button
            onClick={onViewHistory}
            style={{
              marginTop: 12,
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
        )}
      </div>
    </div>
  )
}

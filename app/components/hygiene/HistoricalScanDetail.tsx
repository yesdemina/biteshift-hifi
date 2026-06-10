// Screen 2f — Historical Scan Detail (read-only)
// Opened when user taps a row in Scan History (2e).
// Hero is NOT tappable. No actions. Back → 2e.
// Styling matches Scan Result (2c): white stat cards with colored numbers and
// 2c-style target rings + chips — but everything here is read-only (visual only).

import { ScanHistoryEntry, hygieneData } from '@/lib/mockData'

interface HistoricalScanDetailProps {
  scan:   ScanHistoryEntry
  onBack: () => void
}

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// Candidate marker spots (image-space %), reused from 2c's layout. Markers are
// drawn from the scan's own counts: the first N plaque spots and first N gum
// spots are shown, so a scan with 0 of a type shows no marker for it.
const PLAQUE_SPOTS = [
  { left: '13%', top: '60%', chipTransform: 'translate(-50%, 35px)' },
  { left: '56%', top: '64%', chipTransform: 'translate(-50%, 35px)' },
]
const GUM_SPOTS = [
  { left: '81%', top: '24%', chipTransform: 'translate(-50%, calc(-100% - 35px))' },
]

type Marker = {
  type: 'plaque' | 'gum'
  label: string
  left: string
  top: string
  chipTransform: string
}

function buildMarkers(plaqueCount: number, gumCount: number): Marker[] {
  const markers: Marker[] = []
  for (let i = 0; i < plaqueCount && i < PLAQUE_SPOTS.length; i++) {
    markers.push({ type: 'plaque', label: 'PLAQUE', ...PLAQUE_SPOTS[i] })
  }
  for (let i = 0; i < gumCount && i < GUM_SPOTS.length; i++) {
    markers.push({ type: 'gum', label: 'GUM', ...GUM_SPOTS[i] })
  }
  return markers
}

// Neumorphic white stat card matching 2c — small-caps label, big number tinted
// to its problem type (pink = plaque, mint = gum). On-brand 20px card radius.
function StatCard({ value, subtext, valueColor }: { value: string; subtext: string; valueColor: string }) {
  return (
    <div
      style={{
        flex: 1,
        height: 90,
        background: '#FFFFFF',
        borderRadius: 20,
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
      <div style={{ fontSize: 9, color: '#666666', fontWeight: 600, letterSpacing: '0.08em', flexShrink: 0 }}>
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
          color: valueColor,
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

// Teeth illustration with 2c-style target rings + chips, but READ-ONLY: markers
// are visual only (no tap targets). Image size/position kept as on this screen.
function TeethZones({ plaqueCount, gumCount }: { plaqueCount: number; gumCount: number }) {
  const markers = buildMarkers(plaqueCount, gumCount)
  return (
    <div
      style={{
        // Pulled verbatim from ScanResult (2c) so the arch lands at the exact
        // same vertical position: 290-tall box, 70.5px top offset, image pinned
        // to the top, horizontally centered full-bleed.
        position: 'relative',
        height: 290,
        paddingTop: 70.5,
        display: 'flex',
        alignItems: 'flex-start',
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

        {/* Target rings — double ring (solid outer + dashed inner) in zone color,
            soft glow, frosted translucent-white fill. Visual only, not tappable. */}
        {markers.map((m, i) => {
          const isPlaque = m.type === 'plaque'
          const ringStroke  = isPlaque ? '#FFB3D1' : '#C8E0E0'
          const innerStroke = isPlaque ? '#FF8FB8' : '#9AD2D2'
          const glow        = isPlaque ? 'rgba(255,179,209,0.55)' : 'rgba(200,224,224,0.6)'
          const fill        = isPlaque ? 'rgba(255,179,209,0.14)' : 'rgba(200,224,224,0.16)'
          return (
            <div
              key={`ring-${i}`}
              aria-hidden
              style={{
                position: 'absolute',
                left: m.left,
                top: m.top,
                transform: 'translate(-50%, -50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: `1.5px solid ${ringStroke}`,
                background: `radial-gradient(circle, ${fill} 0%, transparent 66%)`,
                boxShadow: `0 0 10px ${glow}, inset 0 0 6px ${glow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                pointerEvents: 'none',
              }}
            >
              {/* Frosted interior — soft blur + translucent white over the tooth. */}
              <div
                style={{
                  position: 'absolute',
                  inset: 2,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.22) 70%, rgba(255,255,255,0.10) 100%)',
                  backdropFilter: 'blur(2.5px)',
                  WebkitBackdropFilter: 'blur(2.5px)',
                  pointerEvents: 'none',
                }}
              />
              {/* Concentric inner reticle — thinner dashed ring, zone-colored */}
              <div
                style={{
                  position: 'relative',
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: `1px dashed ${innerStroke}`,
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )
        })}

        {/* Zone chips — one per ring, beside its own marker (no leader lines).
            Pink tint for PLAQUE, mint for GUM. Visual only, not tappable. */}
        {markers.map((m, i) => {
          const isPlaque = m.type === 'plaque'
          return (
            <div
              key={`chip-${i}`}
              aria-hidden
              style={{
                position: 'absolute',
                left: m.left,
                top: m.top,
                transform: m.chipTransform,
                background: isPlaque ? '#FFE0EC' : '#DCEFEF',
                color: isPlaque ? '#B23A6F' : '#3C8585',
                borderRadius: 999,
                padding: '3px 8px',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.04em',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {m.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function HistoricalScanDetail({ scan, onBack }: HistoricalScanDetailProps) {
  // Adaptive stat cards: one card per problem zone with count > 0. So 2 problems
  // → two cards side by side; 1 problem → a single card that spans the row (each
  // card is flex:1); 0 problems → no cards at all and the INSIGHT card turns
  // congratulatory. Driven from the scan's own data, not hardcoded.
  type CardSpec = { value: string; subtext: string; valueColor: string }
  const problemCards: CardSpec[] = []
  if (scan.plaque > 0)  problemCards.push({ value: String(scan.plaque),  subtext: 'plaque',       valueColor: '#FF8FB8' })
  if (scan.gumCare > 0) problemCards.push({ value: String(scan.gumCare), subtext: 'gum inflamed', valueColor: '#9AD2D2' })
  const allClear = problemCards.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24, background: '#FFFFFF' }}>
      {/* Top row — back arrow */}
      <div style={{ padding: '14px 24px 0' }}>
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
      </div>

      {/* Headline + read-only pill — centered column, matching Hygiene Home (2a):
          title margin 0, pill 8px below it, whole block horizontally centered. */}
      <div style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', lineHeight: 1.15, letterSpacing: '-0.4px', textAlign: 'center', margin: 0 }}>
          scan from {scan.date.toLowerCase()}
        </h1>
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#F5F5F5',
              borderRadius: 999,
              padding: '5px 12px',
              fontSize: 12,
              color: '#999999',
              fontWeight: 600,
            }}
          >
            historical · read-only
          </div>
        </div>
      </div>

      {/* Hero — teeth group copied from 2c: marginTop 24, full-bleed. 2c shows a
          "tap a highlighted tooth →" hint here; 2f is read-only and omits it, so
          an invisible spacer <p> with the SAME font/margins/padding stands in for
          it — keeping the teeth→cards gap identical to 2c. */}
      <div style={{ marginTop: 24 }}>
        <TeethZones plaqueCount={scan.plaque} gumCount={scan.gumCare} />
        <p
          aria-hidden
          style={{ fontSize: 11, textAlign: 'center', marginTop: 12, padding: '0 24px', visibility: 'hidden' }}
        >
          &nbsp;
        </p>
      </div>

      {/* Stat cards — white, neumorphic, colored numbers; one per problem zone.
          One problem → single full-width card; zero → omitted entirely. */}
      {!allClear && (
        <div style={{ display: 'flex', gap: 10, padding: '16px 16px 0' }}>
          {problemCards.map((c) => (
            <StatCard key={c.subtext} value={c.value} subtext={c.subtext} valueColor={c.valueColor} />
          ))}
        </div>
      )}

      {/* Insight card — bold iridescent. 2c gutters (16px); the gap below the
          cards is the standard 10px card gap, equal to the horizontal gap between
          the cards. When the cards are hidden (all-clear) it follows the teeth at 24px. */}
      <div style={{ padding: `${allClear ? 24 : 10}px 16px 0` }}>
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
          <p style={{ position: 'relative', fontSize: 13, color: '#000000', lineHeight: 1.3 }}>
            {allClear
              ? 'all clear · nothing to fix this time. nice work'
              : `at the time: ${hygieneData.insight.toLowerCase()}`}
          </p>
        </div>
      </div>
    </div>
  )
}

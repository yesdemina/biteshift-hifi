// Screen 2c — Scan Result
// Only the problem-zone target rings and their chips are tappable; healthy teeth are inert.

import { hygieneData, toothZoneContent, type ToothZone } from '@/lib/mockData'

interface ScanResultProps {
  onBack: () => void
  onToothDetail: (zone: ToothZone) => void
}

// Pink for PLAQUE, mint for GUM — used by the target rings.
// Positions are % within the teeth IMAGE box (so they scale with the image).
// `label` + `chipTransform` place each chip relative to its own ring (no leader
// lines), horizontally centered on the ring with a 15px gap. Rings are 40px wide
// (20px radius), so "below" = own-top at ring-center +35px (20 radius + 15 gap),
// and "above" = own-bottom at ring-center −35px (−100% lifts the chip by its own
// height, then −35px clears the radius + gap). Left & center chips sit below their
// rings; the right (gum) chip sits above its ring.
const PROBLEMS: {
  type: 'plaque' | 'gum'
  left: string
  top: string
  label: string
  chipTransform: string
}[] = [
  { type: 'plaque', left: '13%', top: '60%', label: 'PLAQUE', chipTransform: 'translate(-50%, 35px)' },
  { type: 'plaque', left: '56%', top: '64%', label: 'PLAQUE', chipTransform: 'translate(-50%, 35px)' },
  { type: 'gum',    left: '81%', top: '24%', label: 'GUM',    chipTransform: 'translate(-50%, calc(-100% - 35px))' },
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
// valueColor tints the big number to its problem type (pink = plaque, mint = gum).
function DetectedCard({ value, subtext, valueColor = '#000000' }: { value: string; subtext: string; valueColor?: string }) {
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

// Teeth illustration container. The image is pinned to the SAME Y it had when
// centered in a 320-tall box (top offset 70.5px) — so the arch lines up exactly
// with Screen 2b's scanning view and never jumps on the 2b→2c transition. The box
// itself is shorter than 320 now, trimming the dead space BELOW the arch so the
// chips + stat cards + INSIGHT below all ride up (less empty gap under the teeth).
// Rings AND chips live in the image box (so both track the image); each chip is
// pinned right beside its own ring.
function TeethZones({ onProblemTap }: { onProblemTap: (zone: ToothZone) => void }) {
  return (
    <div
      style={{
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

        {/* Problem-zone target rings — focus-reticle markers, only these are interactive */}
        {PROBLEMS.map((p, i) => {
          const isPlaque = p.type === 'plaque'
          const ringStroke  = isPlaque ? '#FFB3D1' : '#C8E0E0'
          const innerStroke = isPlaque ? '#FF8FB8' : '#9AD2D2'
          const glow        = isPlaque ? 'rgba(255,179,209,0.55)' : 'rgba(200,224,224,0.6)'
          const fill        = isPlaque ? 'rgba(255,179,209,0.14)' : 'rgba(200,224,224,0.16)'
          // The focus follows THIS marker's position (image-space %), so 2d zooms
          // to the exact tooth that was tapped.
          const zone: ToothZone = {
            ...toothZoneContent[p.type],
            focus: { x: parseFloat(p.left), y: parseFloat(p.top) },
          }
          return (
            <div
              key={i}
              className="problem-ring"
              role="button"
              tabIndex={0}
              aria-label={isPlaque ? 'Plaque tooth' : 'Inflamed gum'}
              onClick={() => onProblemTap(zone)}
              onKeyDown={(e) => e.key === 'Enter' && onProblemTap(zone)}
              style={{
                position: 'absolute',
                left: p.left,
                top: p.top,
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
              }}
            >
              {/* Frosted interior — soft blur + translucent white over the tooth.
                  The radial white gradient fakes the frost (no hard edge) when
                  backdrop-filter isn't supported. Sits behind the dashed ring. */}
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

        {/* Zone chips — one per ring, sitting directly beside its own marker (no
            leader lines). Each is anchored at the ring center then nudged aside by
            chipTransform. Pink tint for PLAQUE, mint for GUM. Tappable → 2d. */}
        {PROBLEMS.map((p, i) => {
          const isPlaque = p.type === 'plaque'
          const zone: ToothZone = {
            ...toothZoneContent[p.type],
            focus: { x: parseFloat(p.left), y: parseFloat(p.top) },
          }
          return (
            <div
              key={`chip-${i}`}
              role="button"
              tabIndex={0}
              aria-label={isPlaque ? 'Plaque zone' : 'Inflamed gum zone'}
              onClick={() => onProblemTap(zone)}
              onKeyDown={(e) => e.key === 'Enter' && onProblemTap(zone)}
              style={{
                position: 'absolute',
                left: p.left,
                top: p.top,
                transform: p.chipTransform,
                background: isPlaque ? '#FFE0EC' : '#DCEFEF',
                color: isPlaque ? '#B23A6F' : '#3C8585',
                borderRadius: 999,
                padding: '3px 8px',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.04em',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {p.label}
            </div>
          )
        })}
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

      {/* Hero — teeth with tappable problem-tooth glows. Full-bleed (no side
          padding) so the chips have real gutter room to sit OFF the arch. */}
      <div style={{ marginTop: 24 }}>
        <TeethZones onProblemTap={onToothDetail} />
        <p style={{ fontSize: 11, color: '#999999', textAlign: 'center', marginTop: 12, padding: '0 24px' }}>
          tap a highlighted tooth to inspect →
        </p>
      </div>

      {/* Stat cards — neumorphic white, matching Tracking */}
      <div style={{ display: 'flex', gap: 10, padding: '16px 16px 0' }}>
        <DetectedCard value={String(plaque)} subtext="plaque" valueColor="#FF8FB8" />
        <DetectedCard value={String(gumCare)} subtext="gum inflamed" valueColor="#9AD2D2" />
      </div>

      {/* INSIGHT — hugs its content (no fixed slot, unlike Tracking). Top gap is
          the standard 10px card gap, so the vertical gap to INSIGHT equals the
          horizontal gap between the two cards above (both 10). */}
      <div style={{ padding: '10px 16px 0' }}>
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

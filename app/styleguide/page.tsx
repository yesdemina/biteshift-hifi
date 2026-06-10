'use client'
// Standalone Style Guide — URL-reachable at /styleguide, NOT in the tab bar.
// Documents the design system using the real tokens pulled from the app.

import TabBar from '@/app/components/shared/TabBar'

const FONT = "'RF Dewi Extended', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

const NEUMORPHIC_SHADOW =
  '-8px -8px 16px rgba(255,255,255,1), 8px 8px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
const FLOAT_SHADOW = '0 30px 70px rgba(0,0,0,0.15)'

const SECTIONS: { id: string; label: string }[] = [
  { id: 'colors', label: 'colors' },
  { id: 'gradients', label: 'gradients' },
  { id: 'typography', label: 'typography' },
  { id: 'spacing-scale', label: 'indents' },
  { id: 'spacing', label: 'radius' },
  { id: 'shadows', label: 'shadows' },
  { id: 'components', label: 'components' },
]

// ── Section scaffolding ─────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.18em',
        color: '#999999',
        textTransform: 'uppercase',
        marginBottom: 20,
      }}
    >
      {children}
    </div>
  )
}

function Section({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ borderTop: '0.5px solid rgba(0,0,0,0.10)', padding: '40px 0', scrollMarginTop: 32 }}>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </section>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "'SF Mono', Menlo, Consolas, monospace",
        fontSize: 11,
        color: '#666666',
        background: '#F5F5F5',
        borderRadius: 6,
        padding: '3px 7px',
        display: 'inline-block',
        wordBreak: 'break-all',
      }}
    >
      {children}
    </code>
  )
}

// ── 1. COLORS ───────────────────────────────────────────────────────────────
const PALETTE: { name: string; hex: string }[] = [
  { name: 'white', hex: '#FFFFFF' },
  { name: 'soft pink', hex: '#FFD9E5' },
  { name: 'bubblegum pink', hex: '#FFB3D1' },
  { name: 'lavender', hex: '#E0C8FF' },
  { name: 'soft lavender', hex: '#EFE0FF' },
  { name: 'mint blue', hex: '#C8E0E0' },
  { name: 'soft mint', hex: '#E0EEEE' },
  { name: 'black', hex: '#000000' },
  { name: 'charcoal', hex: '#333333' },
  { name: 'gray', hex: '#999999' },
]
const ACCENTS: { name: string; hex: string }[] = [
  { name: 'plaque pink', hex: '#FF8FB8' },
  { name: 'gum mint', hex: '#9AD2D2' },
]

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div style={{ width: 132 }}>
      <div
        style={{
          height: 88,
          borderRadius: 16,
          background: hex,
          border: '0.5px solid rgba(0,0,0,0.10)',
        }}
      />
      <div style={{ fontSize: 13, color: '#000000', marginTop: 10 }}>{name}</div>
      <div style={{ fontSize: 11, color: '#999999', marginTop: 2, letterSpacing: '0.04em' }}>
        {hex}
      </div>
    </div>
  )
}

// ── SPACING SCALE ───────────────────────────────────────────────────────────
const SPACING_SCALE: { token: string; px: number; role: string }[] = [
  { token: 'xs', px: 4, role: 'tiny insets, chip padding' },
  { token: 's', px: 8, role: 'gaps, small label margins' },
  { token: 'm', px: 12, role: 'card padding, medium gaps' },
  { token: 'l', px: 16, role: 'header padding, row gaps, body blocks' },
  { token: 'xl', px: 24, role: 'screen gutter, section spacing' },
  { token: '2xl', px: 32, role: 'empty states, large vertical padding' },
]

function SpacingRow({ token, px, role }: { token: string; px: number; role: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: 36, flexShrink: 0, display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ width: px, height: px, background: '#FFB3D1', borderRadius: 3 }} />
      </div>
      <div style={{ width: 90, flexShrink: 0, fontSize: 13, color: '#000000' }}>{token}</div>
      <div style={{ width: 48, flexShrink: 0, fontSize: 13, color: '#999999' }}>{px}px</div>
      <div style={{ fontSize: 12, color: '#999999' }}>{role}</div>
    </div>
  )
}

// ── 2. GRADIENTS ────────────────────────────────────────────────────────────
const GRADIENTS: { name: string; css: string }[] = [
  { name: 'signature', css: 'linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)' },
  { name: 'full iridescent', css: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)' },
]

function GradientRow({ name, css }: { name: string; css: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ height: 64, borderRadius: 16, background: css }} />
      <div style={{ fontSize: 13, color: '#000000', margin: '10px 0 6px' }}>{name}</div>
      <Code>{css}</Code>
    </div>
  )
}

// ── 6. COMPONENT FACSIMILES ─────────────────────────────────────────────────
function MetricCard({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div
      style={{
        width: 150,
        height: 90,
        background: '#FFFFFF',
        borderRadius: 24,
        border: '0.5px solid rgba(0,0,0,0.05)',
        boxShadow: NEUMORPHIC_SHADOW,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{ fontSize: 8, color: '#666666', fontWeight: 600, letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontSize: 20, fontWeight: 700, color: '#000000', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: '#666666', lineHeight: 1.3 }}>{subtext}</div>
    </div>
  )
}

function MilestoneCard({ label, text }: { label: string; text: string }) {
  return (
    <div
      style={{
        width: 150,
        height: 90,
        background: '#FFFFFF',
        borderRadius: 24,
        border: '0.5px solid rgba(0,0,0,0.05)',
        boxShadow: NEUMORPHIC_SHADOW,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{ fontSize: 8, color: '#666666', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#000000', lineHeight: 1.35 }}>{text}</div>
    </div>
  )
}

function InsightCard() {
  return (
    <div
      style={{
        width: 312,
        background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)',
        borderRadius: 20,
        padding: 12,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: 9, color: '#000000', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>INSIGHT</div>
      <p style={{ fontSize: 11, fontWeight: 500, color: '#000000', lineHeight: 1.3 }}>
        your gumline along the lower left could use gentler, longer brushing — two minutes, soft circles.
      </p>
    </div>
  )
}

function ProblemChip({ kind }: { kind: 'plaque' | 'gum' }) {
  const isPlaque = kind === 'plaque'
  return (
    <div
      style={{
        background: isPlaque ? '#FFE0EC' : '#DCEFEF',
        color: isPlaque ? '#B23A6F' : '#3C8585',
        borderRadius: 999,
        padding: '3px 8px',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.04em',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {isPlaque ? 'PLAQUE' : 'GUM'}
    </div>
  )
}

function TargetRing({ kind }: { kind: 'plaque' | 'gum' }) {
  const isPlaque = kind === 'plaque'
  const ringStroke = isPlaque ? '#FFB3D1' : '#C8E0E0'
  const innerStroke = isPlaque ? '#FF8FB8' : '#9AD2D2'
  const glow = isPlaque ? 'rgba(255,179,209,0.55)' : 'rgba(200,224,224,0.6)'
  const fill = isPlaque ? 'rgba(255,179,209,0.14)' : 'rgba(200,224,224,0.16)'
  return (
    <div
      style={{
        position: 'relative',
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
      <div
        style={{
          position: 'absolute',
          inset: 2,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.22) 70%, rgba(255,255,255,0.10) 100%)',
          backdropFilter: 'blur(2.5px)',
          WebkitBackdropFilter: 'blur(2.5px)',
        }}
      />
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
}

// Small action pill — order / shop / remind me (10px radius, soft rectangle).
function SmallButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        background: '#000000',
        border: 'none',
        borderRadius: 12,
        padding: '7px 14px',
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 600,
        fontFamily: FONT,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

// Real app tab bar, parked in a phone-width relative frame (it's position:absolute).
function TabBarSample() {
  return (
    <div style={{ position: 'relative', width: 390, height: 96 }}>
      <TabBar activeTab="hygiene" onTabChange={() => {}} />
    </div>
  )
}

export default function StyleGuide() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', fontFamily: FONT, color: '#000000' }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>
      <div style={{ display: 'flex', alignItems: 'flex-start', maxWidth: 1040, margin: '0 auto' }}>
        {/* Left section navigation — sticky */}
        <nav
          style={{
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            width: 220,
            flexShrink: 0,
            padding: '72px 24px 96px 40px',
            boxSizing: 'border-box',
          }}
        >
          <a
            href="/"
            style={{
              display: 'inline-block',
              fontSize: 12,
              color: '#888888',
              textDecoration: 'none',
              letterSpacing: '0.02em',
              marginBottom: 28,
            }}
          >
            ← back to app
          </a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  fontSize: 13,
                  color: '#666666',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 760, padding: '72px 40px 96px' }}>
          {/* Header */}
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: '#999999', textTransform: 'uppercase' }}>
            biteshift
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.6px', margin: '10px 0 12px' }}>
            style guide
          </h1>
          <p style={{ fontSize: 14, color: '#666666', lineHeight: 1.6, maxWidth: 460 }}>
            the tokens, type, and components behind biteshift — soft, calm, neumorphic. pulled
            straight from the app.
          </p>

          {/* 1. COLORS */}
          <Section id="colors" label="colors">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {PALETTE.map((c) => (
                <Swatch key={c.hex} name={c.name} hex={c.hex} />
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#999999', textTransform: 'uppercase', margin: '32px 0 16px' }}>
              problem-zone accents
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {ACCENTS.map((c) => (
                <Swatch key={c.hex} name={c.name} hex={c.hex} />
              ))}
            </div>
          </Section>

          {/* 2. GRADIENTS */}
          <Section id="gradients" label="gradients">
            {GRADIENTS.map((g) => (
              <GradientRow key={g.name} name={g.name} css={g.css} />
            ))}
          </Section>

          {/* 3. TYPOGRAPHY */}
          <Section id="typography" label="typography">
            <p style={{ fontSize: 13, color: '#666666', marginBottom: 24 }}>
              rf dewi extended · weights 400 / 600 / 700 · all lowercase
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <TypeRow meta="headline · 22px · 700">
                <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px' }}>headline</span>
              </TypeRow>
              <TypeRow meta="number · 24px · 700">
                <span style={{ fontSize: 24, fontWeight: 700 }}>number</span>
              </TypeRow>
              <TypeRow meta="body · 13px · 400">
                <span style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5 }}>body</span>
              </TypeRow>
              <TypeRow meta="button · 13px · 600">
                <span style={{ fontSize: 13, fontWeight: 600 }}>button</span>
              </TypeRow>
              <TypeRow meta="small label · 9px · 600 · uppercase">
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#666666' }}>
                  small label
                </span>
              </TypeRow>
            </div>
          </Section>

          {/* 4. INDENTS (spacing scale) */}
          <Section id="spacing-scale" label="indents">
            <p style={{ fontSize: 13, color: '#666666', marginBottom: 24 }}>
              a 6-step scale derived from the values used across the app · multiples of 4
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {SPACING_SCALE.map((s) => (
                <SpacingRow key={s.token} token={s.token} px={s.px} role={s.role} />
              ))}
            </div>
          </Section>

          {/* 5. RADIUS */}
          <Section id="spacing" label="radius">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
              <RadiusSample label="cards" radius={20} />
              <RadiusSample label="buttons" radius={14} />
              <RadiusSample label="small buttons" radius={12} />
              <RadiusSample label="inputs" radius={12} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#999999', textTransform: 'uppercase', marginBottom: 16 }}>
              borders
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 24 }}>
              <BorderSample label="hairline" border="0.5px solid rgba(0,0,0,0.06)" />
              <BorderSample label="solid black" border="0.5px solid #000000" />
            </div>
            <p style={{ fontSize: 12, color: '#999999', lineHeight: 1.6 }}>
              no glassmorphism — surfaces use neumorphic soft shadows, not blur-and-transparency.
            </p>
          </Section>

          {/* 5. SHADOWS */}
          <Section id="shadows" label="shadows">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
              <div>
                <div
                  style={{
                    width: 150,
                    height: 90,
                    background: '#FFFFFF',
                    borderRadius: 24,
                    border: '0.5px solid rgba(0,0,0,0.05)',
                    boxShadow: NEUMORPHIC_SHADOW,
                  }}
                />
                <div style={{ fontSize: 13, color: '#000000', margin: '14px 0 6px' }}>card neumorphic</div>
                <Code>{NEUMORPHIC_SHADOW}</Code>
              </div>
              <div>
                <div
                  style={{
                    width: 90,
                    height: 150,
                    background: '#FFFFFF',
                    borderRadius: 20,
                    boxShadow: FLOAT_SHADOW,
                  }}
                />
                <div style={{ fontSize: 13, color: '#000000', margin: '14px 0 6px' }}>showcase float</div>
                <Code>{FLOAT_SHADOW}</Code>
              </div>
            </div>
          </Section>

          {/* 6. COMPONENTS */}
          <Section id="components" label="components">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              <ComponentRow label="metric card">
                <MetricCard label="DAY" value="142" subtext="of your plan" />
              </ComponentRow>

              <ComponentRow label="milestone card">
                <MilestoneCard label="NEXT" text="midpoint check-in" />
              </ComponentRow>

              <ComponentRow label="insight card">
                <InsightCard />
              </ComponentRow>

              <ComponentRow label="problem chips">
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <ProblemChip kind="plaque" />
                  <ProblemChip kind="gum" />
                </div>
              </ComponentRow>

              <ComponentRow label="target ring markers">
                <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
                  <TargetRing kind="plaque" />
                  <TargetRing kind="gum" />
                </div>
              </ComponentRow>

              <ComponentRow label="buttons">
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <button
                    style={{
                      padding: '14px 28px',
                      background: '#000000',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 14,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: FONT,
                      cursor: 'pointer',
                    }}
                  >
                    got it
                  </button>
                  <button
                    style={{
                      padding: '14px 28px',
                      background: 'transparent',
                      color: '#000000',
                      border: '0.5px solid #000000',
                      borderRadius: 14,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: FONT,
                      cursor: 'pointer',
                    }}
                  >
                    cancel
                  </button>
                </div>
              </ComponentRow>

              <ComponentRow label="small buttons">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <SmallButton>order</SmallButton>
                  <SmallButton>shop</SmallButton>
                  <SmallButton>remind me</SmallButton>
                </div>
              </ComponentRow>

              <ComponentRow label="tab bar">
                <TabBarSample />
              </ComponentRow>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

// ── shared row helpers ───────────────────────────────────────────────────────
function TypeRow({ meta, children }: { meta: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ width: 220, flexShrink: 0 }}>{children}</div>
      <div style={{ fontSize: 11, color: '#999999', letterSpacing: '0.02em' }}>{meta}</div>
    </div>
  )
}

function ComponentRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
      <div style={{ width: 150, flexShrink: 0, fontSize: 12, color: '#999999' }}>{label}</div>
      <div>{children}</div>
    </div>
  )
}

function RadiusSample({ label, radius }: { label: string; radius: number }) {
  return (
    <div>
      <div
        style={{
          width: 110,
          height: 70,
          background: '#F5F5F5',
          border: '0.5px solid rgba(0,0,0,0.10)',
          borderRadius: radius,
        }}
      />
      <div style={{ fontSize: 13, color: '#000000', marginTop: 10 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#999999', marginTop: 2 }}>{radius}px</div>
    </div>
  )
}

function BorderSample({ label, border }: { label: string; border: string }) {
  return (
    <div>
      <div style={{ width: 110, height: 70, background: '#FFFFFF', border, borderRadius: 12 }} />
      <div style={{ fontSize: 13, color: '#000000', marginTop: 10 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#999999', marginTop: 2 }}>{border}</div>
    </div>
  )
}

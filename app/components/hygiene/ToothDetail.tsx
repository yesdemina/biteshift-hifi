// Screen 2d — Tooth Detail
// "got it" returns to Scan Result (2c).

import { toothData } from '@/lib/mockData'

interface ToothDetailProps {
  onBack: () => void
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
      <span style={{ fontSize: 13, color: '#000000', lineHeight: 1.4 }}>{text}</span>
    </div>
  )
}

export default function ToothDetail({ onBack }: ToothDetailProps) {
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
            background: '#FFD9E5',
            borderRadius: 999,
            padding: '5px 12px',
            fontSize: 12,
            color: '#000000',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {toothData.pill.toLowerCase()}
        </div>
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', padding: '14px 24px 0', letterSpacing: '-0.4px' }}>
        {toothData.headline.toLowerCase()}
      </h1>

      {/* Hero — zoomed tooth with pink problem-area glow */}
      <div style={{ padding: '14px 24px 0' }}>
        <div
          style={{
            position: 'relative',
            height: 190,
            borderRadius: 20,
            background: '#F5F5F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: '#FFB3D1',
              opacity: 0.45,
              filter: 'blur(28px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'relative',
              width: 90,
              height: 90,
              borderRadius: '50%',
              border: '2px solid #FFB3D1',
            }}
          />
        </div>
      </div>

      {/* Three info cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 24px 0' }}>
        <InfoCard tag="ISSUE" text={toothData.issue} bg={CARD_BGS[0]} />
        <InfoCard tag="WHY"   text={toothData.why}   bg={CARD_BGS[1]} />
        <InfoCard tag="FIX"   text={toothData.fix}   bg={CARD_BGS[2]} />
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

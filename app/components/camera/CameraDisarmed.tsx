// Screen 3a — Camera (single state)
// The bracket camera is always listening. The app is instructions + summary + review.

interface CameraScreenProps {
  onViewDrafts: () => void
}

// ── Helper rows ────────────────────────────────────────────────────────────────

function StatRow({ value, label, tail }: { value: string; label: string; tail?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 18, fontWeight: 700, color: '#000000', minWidth: 26 }}>{value}</span>
      <span style={{ fontSize: 13, color: '#666666' }}>
        {label}
        {tail && <span style={{ color: '#FFB3D1', marginLeft: 4 }}>{tail}</span>}
      </span>
    </div>
  )
}

function MechanicRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
      <div
        style={{
          width: 24,
          height: 24,
          background: '#F5F5F5',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 13, color: '#333333' }}>{text}</span>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function PhotoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#666" strokeWidth="1.2" />
      <circle cx="5" cy="8" r="1.1" fill="#666" />
      <circle cx="8" cy="8" r="1.1" fill="#666" />
      <circle cx="11" cy="8" r="1.1" fill="#666" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="5" width="12" height="7" rx="2" stroke="#666" strokeWidth="1.2" />
      <circle cx="8" cy="8.5" r="2" fill="#666" />
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 2.5l1.2 2.8 2.8 1.2-2.8 1.2L8 10.5 6.8 7.7 4 6.5l2.8-1.2z" stroke="#666" strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="12.5" cy="11.5" r="0.8" fill="#666" />
      <circle cx="3.5" cy="11.5" r="0.6" fill="#666" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#666" strokeWidth="1.2" />
      <path d="M8 4.5V8l2.2 1.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function CameraScreen({ onViewDrafts }: CameraScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24, background: '#FFFFFF' }}>
      {/* Headline */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', padding: '14px 24px 0', letterSpacing: '-0.4px' }}>
        hands-free camera
      </h1>

      {/* Status block */}
      <div style={{ margin: '14px 24px 0' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #FFD9E5 0%, #FFB3D1 100%)',
            borderRadius: 20,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="listening-pulse"
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#000000', display: 'block' }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>camera is listening</span>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: '#333333' }}>
            triple-click your teeth to capture
          </p>
          <p style={{ marginTop: 4, fontSize: 12, color: '#333333' }}>
            bite &amp; hold 2s to record video
          </p>
        </div>
      </div>

      {/* THIS WEEK summary */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: '#666666', letterSpacing: '0.08em', marginBottom: 12 }}>
          THIS WEEK
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <StatRow value="18" label="captured" />
          <StatRow value="11" label="auto-removed (blurry, dark, random)" />
          <StatRow value="7"  label="waiting your review" tail="· 23h left" />
        </div>
      </div>

      {/* Primary CTA */}
      <div style={{ padding: '24px 24px 0' }}>
        <button
          onClick={onViewDrafts}
          style={{
            width: '100%',
            height: 52,
            background: '#000000',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          view drafts
        </button>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: '32px 24px 0' }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: '#666666', letterSpacing: '0.08em', marginBottom: 12 }}>
          HOW IT WORKS
        </div>
        <MechanicRow icon={<PhotoIcon />}     text="triple-click teeth → photo" />
        <MechanicRow icon={<VideoIcon />}     text="bite & hold 2s → video" />
        <MechanicRow icon={<SparklesIcon />}  text="bad shots auto-removed" />
        <MechanicRow icon={<ClockIcon />}     text="drafts expire in 24h" />
      </div>
    </div>
  )
}

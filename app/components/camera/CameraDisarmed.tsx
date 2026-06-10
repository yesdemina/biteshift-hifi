// Screen 3a — Camera (single state)
// The bracket camera is always listening. The app is instructions + summary + review.

import { drafts } from '@/lib/mockData'

interface CameraScreenProps {
  onViewDrafts: () => void
  onOpenDraft: (id: number) => void
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

// ── Play indicator — circular badge with a white triangle (matches Drafts 3c) ──

function PlayIndicator({ size }: { size: number }) {
  const tri = Math.round(size * 0.42)
  return (
    <div
      style={{
        width:          size,
        height:         size,
        borderRadius:   '50%',
        background:     'rgba(0, 0, 0, 0.6)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      <svg width={tri} height={tri} viewBox="0 0 10 10" style={{ marginLeft: tri * 0.12 }}>
        <path d="M2 1.3L8.5 5L2 8.7Z" fill="#FFFFFF" />
      </svg>
    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function CameraScreen({ onViewDrafts, onOpenDraft }: CameraScreenProps) {
  // Latest 3 captures (drafts array is ordered most-recent first).
  const recent = drafts.slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24, background: '#FFFFFF' }}>
      {/* Headline */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', padding: '14px 24px 0', letterSpacing: '-0.4px', textAlign: 'center' }}>
        hands-free camera
      </h1>

      {/* Status block */}
      <div style={{ margin: '14px 24px 0' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)',
            borderRadius: 20,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="listening-pulse"
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#000000', display: 'block' }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>camera is ready</span>
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

      {/* RECENT — latest capture thumbnails */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: '#666666', letterSpacing: '0.08em', marginBottom: 12 }}>
          RECENT
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {recent.map((draft) => (
            <div
              key={draft.id}
              className="draft-item"
              onClick={() => onOpenDraft(draft.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onOpenDraft(draft.id)}
              style={{
                position:     'relative',
                flex:         1,
                aspectRatio:  '1 / 1',
                borderRadius: 12,
                overflow:     'hidden',
                background:   '#F5F5F5',
                cursor:       'pointer',
              }}
            >
              <img
                src={draft.src}
                alt={draft.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {draft.type === 'video' && (
                <div style={{ position: 'absolute', top: 6, left: 6 }}>
                  <PlayIndicator size={22} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Primary CTA — bottom of content */}
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
    </div>
  )
}

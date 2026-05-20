'use client'
// Screen 3c — Drafts grid → Draft Detail (3c-detail)
// draftsCount controlled at app level; empty state when 0.

import { useState, useEffect, useRef } from 'react'
import HatchedPlaceholder from '@/app/components/shared/HatchedPlaceholder'
import { drafts, type Draft } from '@/lib/mockData'

// ── Action definitions ────────────────────────────────────────────────────────

const ACTIONS = [
  { label: 'Save to device gallery', primary: true,  toast: 'saved to device gallery' },
  { label: 'Share',                  primary: false, toast: 'share sheet would open here' },
  { label: 'Add to timeline',        primary: false, toast: 'added to your timeline' },
  { label: 'Delete',                 primary: false, toast: 'capture deleted', danger: true },
] as const

// ── Play indicator — circular badge with a white triangle (video items) ───────

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

// ── Draft Detail (Screen 3c-detail) ──────────────────────────────────────────

function DraftDetail({
  draft,
  onBack,
}: {
  draft: Draft
  onBack: () => void
}) {
  const [toast, setToast] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up any pending timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const handleAction = (toastMsg: string) => {
    setToast(toastMsg)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setToast(null)
      onBack()
    }, 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24 }}>

      {/* Toast — slides in at top of content area */}
      {toast && (
        <div
          style={{
            background: '#1A1A1A',
            color: '#FFFFFF',
            padding: '11px 24px',
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'center',
            letterSpacing: '0.1px',
          }}
        >
          {toast}
        </div>
      )}

      {/* Header — back arrow left, title centred */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 24px 0',
          minHeight: 44,
        }}
      >
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            left: 24,
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#1A1A1A',
            padding: 0,
          }}
          aria-label="Back"
        >
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
            <path d="M7.5 1.5L2 7.5L7.5 13.5" stroke="#1A1A1A" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
          Review capture
        </h2>
      </div>

      {/* Hero — actual tapped image */}
      <div style={{ padding: '16px 24px 0' }}>
        <div
          style={{
            position:     'relative',
            width:        '100%',
            aspectRatio:  '1 / 1',
            borderRadius: 12,
            overflow:     'hidden',
            background:   '#F5F5F5',
          }}
        >
          <img
            src={draft.src}
            alt="POV moment preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {draft.type === 'video' && (
            <div
              style={{
                position:  'absolute',
                top:       '50%',
                left:      '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <PlayIndicator size={48} />
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      <p
        style={{
          fontSize: 12,
          color: '#999999',
          padding: '10px 24px 0',
          lineHeight: 1.55,
          textAlign: 'center',
        }}
      >
        Captures stay in Drafts until you decide. Nothing is shared automatically.
      </p>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 24px 0' }}>
        {ACTIONS.map((action) => {
          const isPrimary = action.primary
          const isDanger  = 'danger' in action && action.danger

          return (
            <button
              key={action.label}
              onClick={() => handleAction(action.toast)}
              style={{
                width:        '100%',
                height:       50,
                background:   isPrimary ? '#1A1A1A' : '#FFFFFF',
                color:        isPrimary ? '#FFFFFF' : isDanger ? '#B00020' : '#1A1A1A',
                border:       isPrimary ? 'none' : '1px solid #C8C8C8',
                borderRadius: 12,
                fontSize:     15,
                fontWeight:   isPrimary ? 600 : 500,
                cursor:       'pointer',
              }}
            >
              {action.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '52px 32px',
        gap:            14,
      }}
    >
      <HatchedPlaceholder circle width={72} height={72} label="" />
      <p style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
        No captures yet
      </p>
      <p
        style={{
          fontSize:   13,
          color:      '#999999',
          textAlign:  'center',
          lineHeight: 1.5,
          margin:     0,
        }}
      >
        Arm the camera to start capturing POV moments hands-free
      </p>
    </div>
  )
}

// ── Drafts grid ───────────────────────────────────────────────────────────────

interface DraftsProps {
  onBack:      () => void   // back to Armed screen
  draftsCount: number
  onClearAll:  () => void
}

export default function Drafts({ onBack, draftsCount, onClearAll }: DraftsProps) {
  const [selectedDraft, setSelectedDraft] = useState<number | null>(null)

  // Show detail when a draft is tapped
  if (selectedDraft !== null) {
    return (
      <DraftDetail
        draft={drafts[selectedDraft]}
        onBack={() => setSelectedDraft(null)}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24 }}>

      {/* Header */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '16px 24px 0',
        }}
      >
        <button
          onClick={onBack}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        6,
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            color:      '#1A1A1A',
            fontSize:   15,
            padding:    0,
          }}
        >
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
            <path d="M7.5 1.5L2 7.5L7.5 13.5" stroke="#1A1A1A" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          Back
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>Drafts</h2>
        <div style={{ width: 46 }} />
      </div>

      <p style={{ fontSize: 13, color: '#999999', padding: '6px 24px 0', textAlign: 'center' }}>
        Review before saving or sharing
      </p>

      {/* Grid or empty state */}
      {draftsCount === 0 ? (
        <EmptyState />
      ) : (
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 10,
            padding:             '16px 24px 0',
          }}
        >
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="draft-item"
              onClick={() => setSelectedDraft(draft.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedDraft(draft.id)}
              style={{
                position:     'relative',
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
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <PlayIndicator size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Demo helper */}
      <div style={{ padding: '20px 24px 0', textAlign: 'center' }}>
        <button
          onClick={onClearAll}
          style={{
            background:     'none',
            border:         'none',
            fontSize:       12,
            color:          '#AAAAAA',
            cursor:         'pointer',
            textDecoration: 'underline',
          }}
        >
          Clear all (demo)
        </button>
      </div>

    </div>
  )
}

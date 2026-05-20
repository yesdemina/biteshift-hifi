// Screen 2e — Scan History
// Full scrollable list of past scans, newest first.
// Tapping a row → opens Historical Scan Detail (2f).

import { scanHistory, ScanHistoryEntry, DotType } from '@/lib/mockData'

interface ScanHistoryProps {
  onBack:       () => void
  onSelectScan: (scan: ScanHistoryEntry) => void
}

// ── Status dot ────────────────────────────────────────────────────────────────

function StatusDot({ type }: { type: DotType }) {
  const base: React.CSSProperties = {
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0,
    boxSizing: 'border-box',
  }

  if (type === 'filled') {
    // good
    return <div style={{ ...base, background: '#C8E0E0', border: '0.5px solid #5FA4A4' }} />
  }
  if (type === 'half') {
    // ok
    return <div style={{ ...base, background: '#FFB3D1' }} />
  }
  // outline — needs attention
  return <div style={{ ...base, border: '0.5px solid #E0E0E0' }} />
}

// ── History row ───────────────────────────────────────────────────────────────

function HistoryRow({ entry, onSelect }: { entry: ScanHistoryEntry; onSelect: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#FFFFFF',
        border: '0.5px solid rgba(0,0,0,0.06)',
        borderRadius: 16,
        padding: '12px 14px',
        marginBottom: 8,
        cursor: 'pointer',
        gap: 12,
      }}
    >
      <div style={{ minWidth: 80, flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#000000' }}>{entry.date}</div>
      </div>
      <div style={{ flex: 1, fontSize: 11, color: '#999999', lineHeight: 1.35 }}>
        {entry.stats}
      </div>
      <StatusDot type={entry.dotType} />
    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ScanHistory({ onBack, onSelectScan }: ScanHistoryProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24, background: '#FFFFFF' }}>
      {/* Top row — back arrow */}
      <div style={{ padding: '16px 24px 0' }}>
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

      {/* Headline */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', padding: '12px 24px 0', letterSpacing: '-0.4px' }}>
        scan history
      </h1>

      {/* Summary card */}
      <div style={{ padding: '8px 24px 0' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)',
            borderRadius: 20,
            padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: 11, color: '#666666', marginBottom: 5 }}>
            12 scans · last 3 months
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#000000' }}>
            hygiene is improving
          </div>
        </div>
      </div>

      {/* History list */}
      <div style={{ padding: '16px 24px 0' }}>
        {scanHistory.map((entry) => (
          <HistoryRow key={entry.id} entry={entry} onSelect={() => onSelectScan(entry)} />
        ))}
      </div>
    </div>
  )
}

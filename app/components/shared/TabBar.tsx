// TabBar — 4-tab bottom bar, flush to bottom of the PhoneFrame.
// Bold line-art icons; the active tab sits in a soft gray pill.

export type Tab = 'tracking' | 'hygiene' | 'camera' | 'support'

interface TabBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

// ── Bold line-art icons (Apple SF Symbol weight) ──────────────────────────────

function ClockIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12,7 12,12 15.5,14" />
    </svg>
  )
}

function ToothIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3C6.5 3 5 5 5 7c0 1 .3 2 .6 3L7 18c.2 1 .7 2 2 2 .9 0 1.5-.6 2-.6.5 0 1.1.6 2 .6 1.3 0 1.8-1 2-2l1.4-8c.3-1 .6-2 .6-3 0-2-1.5-4-4-4-1.2 0-1.8.3-3 .3C10.8 3.3 10.2 3 9 3z" />
    </svg>
  )
}

function CameraIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function PersonIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

const TABS: { id: Tab; Icon: React.ComponentType<{ color: string }> }[] = [
  { id: 'tracking', Icon: ClockIcon },
  { id: 'hygiene',  Icon: ToothIcon },
  { id: 'camera',   Icon: CameraIcon },
  { id: 'support',  Icon: PersonIcon },
]

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div
      style={{
        height: 72,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        borderTop: '0.5px solid rgba(0,0,0,0.06)',
        background: '#FFFFFF',
      }}
    >
      {TABS.map(({ id, Icon }) => {
        const active = activeTab === id
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            aria-label={id}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                borderRadius: 12,
                background: active ? '#F0F0F0' : 'transparent',
              }}
            >
              <Icon color={active ? '#000000' : '#FFB3D1'} />
            </div>
          </button>
        )
      })}
    </div>
  )
}

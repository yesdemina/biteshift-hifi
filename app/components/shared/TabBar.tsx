// TabBar — floating white pill at the bottom of the PhoneFrame.
// Filled icons; the active tab sits in a soft-pink pill.

export type Tab = 'tracking' | 'hygiene' | 'camera' | 'support'

interface TabBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

// ── Filled icons (currentColor — transitions via the parent svg color) ────────

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 4a1 1 0 10-2 0v6a1 1 0 00.293.707l3.5 3.5a1 1 0 001.414-1.414L13 11.586V6z"
        fill="currentColor"
      />
    </svg>
  )
}

function ToothIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path
        d="M9 3C6.5 3 5 5 5 7c0 1 .3 2 .6 3L7 18c.2 1 .7 2 2 2 .9 0 1.5-.6 2-.6.5 0 1.1.6 2 .6 1.3 0 1.8-1 2-2l1.4-8c.3-1 .6-2 .6-3 0-2-1.5-4-4-4-1.2 0-1.8.3-3 .3C10.8 3.3 10.2 3 9 3z"
        fill="currentColor"
      />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 2L7.5 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-3.5L15 2H9zm3 6a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
        fill="currentColor"
      />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7a1 1 0 01-1 1H5a1 1 0 01-1-1z" fill="currentColor" />
    </svg>
  )
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

const TABS: { id: Tab; Icon: React.ComponentType }[] = [
  { id: 'tracking', Icon: ClockIcon },
  { id: 'hygiene',  Icon: ToothIcon },
  { id: 'camera',   Icon: CameraIcon },
  { id: 'support',  Icon: PersonIcon },
]

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 12px',
        background: '#FFFFFF',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderRadius: 999,
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
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
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              padding: 0,
            }}
          >
            <div
              style={{
                width: 56,
                height: 40,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active ? '#F0F0F0' : 'transparent',
                transition: 'background-color 200ms ease',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  color: active ? '#000000' : '#FFB3D1',
                  transition: 'color 200ms ease',
                }}
              >
                <Icon />
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

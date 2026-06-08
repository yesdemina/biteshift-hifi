// TabBar — full-width neumorphic embossed bar flush with the PhoneFrame bottom.
// The whole bar reads as raised; the active tab is debossed (recessed) into it.

import TeethBarIcon from './TeethBarIcon'

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
  { id: 'hygiene',  Icon: TeethBarIcon },
  { id: 'camera',   Icon: CameraIcon },
  { id: 'support',  Icon: PersonIcon },
]

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: '#FFFFFF',
        borderRadius: 999,
        boxShadow:
          '0 8px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.03)',
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
              height: 64,
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
                width: 72,
                height: 36,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFFFFF',
                boxShadow: active
                  ? 'inset 3px 3px 6px rgba(0,0,0,0.10), inset -3px -3px 6px rgba(255,255,255,0.85)'
                  : 'inset 0 0 0 rgba(0,0,0,0)',
                transition: 'box-shadow 200ms ease',
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

// Screen 4b — Profile
// Photo avatar, name, email, settings rows, sign-out.

interface ProfileScreenProps {
  userName:         string
  onBack:           () => void
  onChangePassword: () => void
  onTbd:            (title: string) => void
  onSignOut:        () => void
}

function ChevronRight() {
  return (
    <svg width="7" height="12" viewBox="0 0 8 13" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1.5 1.5L6.5 6.5L1.5 11.5" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Photo avatar — user.png cropped to the face
function Avatar() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#FFD9E5',
        flexShrink: 0,
      }}
    >
      <img
        src="/user.png"
        alt="Profile"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 25%',
          display: 'block',
        }}
      />
    </div>
  )
}

function SettingsRow({
  label,
  onPress,
  last = false,
}: {
  label:  string
  onPress: () => void
  last?:  boolean
}) {
  return (
    <button
      onClick={onPress}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 4px',
        background: 'none',
        border: 'none',
        borderBottom: last ? 'none' : '0.5px solid rgba(0,0,0,0.06)',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
      }}
    >
      <span style={{ fontSize: 13, color: '#000000' }}>{label.toLowerCase()}</span>
      <ChevronRight />
    </button>
  )
}

const SETTINGS_ROWS = [
  'Change password',
  'Notifications',
  'Linked devices',
  'Treatment plan',
  'Help & support',
] as const

export default function ProfileScreen({
  userName,
  onBack,
  onChangePassword,
  onTbd,
  onSignOut,
}: ProfileScreenProps) {
  const displayName = userName.trim() || 'anonymous'

  const handleRow = (label: string) => {
    if (label === 'Change password') { onChangePassword(); return }
    onTbd(label)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 32, background: '#FFFFFF' }}>
      {/* Back */}
      <div style={{ padding: '14px 24px 0' }}>
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
        profile
      </h1>

      {/* Profile header card */}
      <div style={{ padding: '12px 24px 0' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)',
            borderRadius: 20,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Avatar />
          <div style={{ fontSize: 16, fontWeight: 600, color: '#000000' }}>{displayName}</div>
          <div style={{ fontSize: 12, color: '#666666' }}>you@biteshift.app</div>
        </div>
      </div>

      {/* Settings list */}
      <div style={{ padding: '16px 24px 0' }}>
        {SETTINGS_ROWS.map((label, i) => (
          <SettingsRow
            key={label}
            label={label}
            last={i === SETTINGS_ROWS.length - 1}
            onPress={() => handleRow(label)}
          />
        ))}
      </div>

      {/* Sign out */}
      <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>
        <button
          onClick={onSignOut}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            fontSize: 13,
            color: '#E53935',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 600,
          }}
        >
          sign out
        </button>
      </div>
    </div>
  )
}

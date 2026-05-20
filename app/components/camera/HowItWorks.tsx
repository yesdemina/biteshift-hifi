// Shared "how it works" reminder block — used on both Camera Disarmed and Armed.

function MechanicRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
      <div
        style={{
          width: 28,
          height: 28,
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
      <span style={{ fontSize: 12, color: '#444444' }}>{text}</span>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <div style={{ padding: '12px 24px 0' }}>
      <div
        style={{
          fontSize: 9,
          color: '#999999',
          fontWeight: 600,
          letterSpacing: '0.5px',
          marginBottom: 2,
        }}
      >
        HOW IT WORKS
      </div>
      <div>
        <MechanicRow
          icon={
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#666" strokeWidth="1.2" />
              <circle cx="5" cy="8" r="1.1" fill="#666" />
              <circle cx="8" cy="8" r="1.1" fill="#666" />
              <circle cx="11" cy="8" r="1.1" fill="#666" />
            </svg>
          }
          text="triple-click teeth → photo"
        />
        <MechanicRow
          icon={
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="5" width="12" height="7" rx="2" stroke="#666" strokeWidth="1.2" />
              <circle cx="8" cy="8.5" r="2" fill="#666" />
            </svg>
          }
          text="bite & hold 2s → video"
        />
      </div>
    </div>
  )
}

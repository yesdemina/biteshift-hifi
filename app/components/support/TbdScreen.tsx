// Generic TBD placeholder — used for settings rows that aren't fully designed yet.

interface TbdScreenProps {
  title:  string
  onBack: () => void
}

export default function TbdScreen({ title, onBack }: TbdScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 24, background: '#FFFFFF' }}>

      {/* Back */}
      <div style={{ padding: '16px 24px 0' }}>
        <button
          onClick={onBack}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        6,
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            color:      '#000000',
            fontSize:   15,
            padding:    0,
          }}
        >
          <svg width="8" height="14" viewBox="0 0 9 15" fill="none">
            <path d="M7.5 1.5L2 7.5L7.5 13.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          back
        </button>
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#000000', padding: '14px 24px 0', letterSpacing: '-0.4px' }}>
        {title.toLowerCase()}
      </h1>

      {/* Placeholder body */}
      <div
        style={{
          margin:       '24px 24px 0',
          background:   'linear-gradient(135deg, #FFD9E5 0%, #EFE0FF 50%, #E0EEEE 100%)',
          borderRadius: 20,
          padding:      '32px 20px',
          textAlign:    'center',
        }}
      >
        <p style={{ fontSize: 13, color: '#000000', lineHeight: 1.5, margin: 0 }}>
          {title.toLowerCase()} settings coming soon.
        </p>
      </div>

    </div>
  )
}

// PhoneFrame — 390×844 px app screen as a clean rounded-corner panel (no device
// bezel), centered on a neutral gray page with a soft drop shadow so it lifts off
// the background. The screen div is position:relative so absolute overlays
// (modals) anchor to it.

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#DEDEDE',
        padding: '24px 0',
      }}
    >
      {/* App screen — rounded panel sitting directly on the gray, soft shadow. */}
      <div
        style={{
          position: 'relative',
          width: 390,
          height: 844,
          background: '#FFFFFF',
          borderRadius: 44,
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(0,0,0,0.15)',
          fontFamily:
            "'RF Dewi Extended', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        }}
      >
        {children}
      </div>
    </div>
  )
}

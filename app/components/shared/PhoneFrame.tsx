// PhoneFrame — 390×844 px app screen as a clean rounded-corner panel (no device
// bezel), centered on a neutral gray page with a soft drop shadow so it lifts off
// the background. The screen div is position:relative so absolute overlays
// (modals) anchor to it.

// Displayed at this fraction of the native 390×844 so there's extra gray
// breathing room around the panel. Inner screens keep their real 390×844
// coordinates (clicks + layout unchanged); only the visual scales.
const SCALE = 0.82

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Soft warm-neutral pearl — near-white base with a whisper of lavender
        // (top) easing to a faint mint (bottom). Kept extremely light so it
        // reads as elegant pearl, not a colored wash.
        background:
          'radial-gradient(135% 110% at 50% 0%, #F5EEF7 0%, #F2F0F4 50%, #ECF1F1 100%)',
        padding: '24px 0',
      }}
    >
      {/* Sized wrapper reserves the SCALED footprint so the page centers and the
          link sits right below the (smaller) panel — no phantom gap. */}
      <div style={{ width: 390 * SCALE, height: 844 * SCALE }}>
        {/* App screen — rounded panel sitting directly on the gray, soft shadow. */}
        <div
          style={{
            position: 'relative',
            width: 390,
            height: 844,
            transform: `scale(${SCALE})`,
            transformOrigin: 'top left',
            background: '#FFFFFF',
            borderRadius: 44,
            overflow: 'hidden',
            boxShadow: '0 30px 70px rgba(0,0,0,0.18)',
            fontFamily:
              "'RF Dewi Extended', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
          }}
        >
          {children}
        </div>
      </div>

      {/* Link to the standalone style guide — centered below the panel, clear of
          its drop shadow. Not part of the app/tab bar. */}
      <a
        href="/styleguide"
        style={{
          marginTop: 40,
          fontFamily:
            "'RF Dewi Extended', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: '#333333',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        style guide ↗
      </a>
    </div>
  )
}

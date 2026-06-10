// PhoneFrame — responsive showcase wrapper.
//
// DESKTOP / wide viewports (> 600px): the app renders inside a 390×844 rounded
// panel (no device bezel), scaled down and centered on a soft pearl background
// with a drop shadow + a "style guide" link below — the showcase look.
//
// REAL PHONES (≤ 600px): the showcase chrome is dropped entirely and the app
// fills the whole viewport (100vw × 100dvh, no panel/shadow/margins/link), so it
// reads as a native app instead of a tiny phone-in-a-phone. The panel keeps
// padding-bottom: env(safe-area-inset-bottom) so the floating tab bar clears the
// iPhone home indicator. The app's own internal scroller handles content scroll.
//
// Inner screens are NOT touched — they use relative widths, so they flow from a
// fixed 390px panel (desktop) to 100% width (mobile) automatically.

const SCALE = 0.82

const FONT =
  "'RF Dewi Extended', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bs-frame-root">
      <style>{`
        /* ── Desktop / wide: showcase chrome (unchanged appearance) ── */
        .bs-frame-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          /* Soft warm-neutral pearl — near-white with a whisper of lavender (top)
             easing to a faint mint (bottom). Kept extremely light so it reads as
             elegant pearl, not a colored wash. */
          background: radial-gradient(135% 110% at 50% 0%, #F5EEF7 0%, #F2F0F4 50%, #ECF1F1 100%);
          padding: 24px 0;
        }
        /* Sized wrapper reserves the SCALED footprint so the page centers and the
           link sits right below the (smaller) panel — no phantom gap. */
        .bs-frame-wrapper {
          width: ${390 * SCALE}px;
          height: ${844 * SCALE}px;
        }
        /* App screen — rounded panel sitting on the pearl, soft shadow. */
        .bs-frame-panel {
          position: relative;
          width: 390px;
          height: 844px;
          transform: scale(${SCALE});
          transform-origin: top left;
          background: #FFFFFF;
          border-radius: 44px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.18);
          font-family: ${FONT};
        }
        /* Link to the standalone style guide — centered below the panel. */
        .bs-frame-link {
          margin-top: 40px;
          font-family: ${FONT};
          font-size: 14px;
          font-weight: 600;
          color: #333333;
          text-decoration: none;
          letter-spacing: 0.02em;
        }

        /* ── Real phones (≤600px): drop the chrome, fill the screen ── */
        @media (max-width: 600px) {
          .bs-frame-root {
            min-height: 0;
            height: 100dvh;
            display: block;
            padding: 0;
            background: none;
          }
          .bs-frame-wrapper {
            width: 100vw;
            height: 100dvh;
          }
          .bs-frame-panel {
            width: 100%;
            height: 100%;
            transform: none;
            border-radius: 0;
            box-shadow: none;
            /* Keep the floating tab bar clear of the iPhone home indicator. */
            padding-bottom: env(safe-area-inset-bottom);
          }
          .bs-frame-link {
            display: none;
          }
        }
      `}</style>

      <div className="bs-frame-wrapper">
        <div className="bs-frame-panel">{children}</div>
      </div>

      <a className="bs-frame-link" href="/styleguide">
        style guide ↗
      </a>
    </div>
  )
}

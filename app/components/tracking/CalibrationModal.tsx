// Screen 1b — Calibration Prompt
// Bottom-sheet modal that slides up over 1a. Uses position:absolute (NOT
// position:fixed) so it stays contained inside the PhoneFrame.

interface CalibrationModalProps {
  onLater: () => void
  onScan: () => void
}

export default function CalibrationModal({ onLater, onScan }: CalibrationModalProps) {
  return (
    /* Dark overlay — absolute within PhoneFrame (position:relative) */
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Tap backdrop to dismiss (same as "Later") */}
      <div
        style={{ position: 'absolute', inset: 0 }}
        onClick={onLater}
        aria-label="Dismiss modal"
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: 'relative',
          background: '#FFFFFF',
          borderRadius: '24px 24px 0 0',
          padding: '32px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 36,
            height: 4,
            background: '#E0E0E0',
            borderRadius: 2,
            marginBottom: 24,
          }}
        />

        {/* Iridescent circle icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)',
            marginBottom: 20,
          }}
        />

        {/* Headline */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#000000',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          time to recalibrate
        </h2>

        {/* Body */}
        <p
          style={{
            fontSize: 13,
            color: '#999999',
            textAlign: 'center',
            lineHeight: 1.5,
            marginBottom: 24,
            maxWidth: 280,
          }}
        >
          your teeth have moved noticeably. let&apos;s scan your face to update
          the picture.
        </p>

        {/* Primary CTA */}
        <button
          onClick={onScan}
          style={{
            width: '100%',
            height: 48,
            background: '#FFB3D1',
            color: '#000000',
            border: 'none',
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 14,
          }}
        >
          scan my face
        </button>

        {/* Secondary / dismiss */}
        <button
          onClick={onLater}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 13,
            color: '#999999',
            cursor: 'pointer',
          }}
        >
          later
        </button>
      </div>
    </div>
  )
}

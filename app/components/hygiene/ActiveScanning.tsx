'use client'
// Screen 2b — Active Scanning
// No tab bar. Progress bar auto-fills over ~6 seconds then calls onComplete.

import { useState, useEffect, useRef } from 'react'

interface ActiveScanningProps {
  onClose: () => void
  onComplete: () => void
}

// One L-shaped viewfinder bracket (two iridescent legs meeting at a corner).
function Corner({ v, h }: { v: 'top' | 'bottom'; h: 'left' | 'right' }) {
  const grad = 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)'
  const glow = '0 0 6px rgba(224,200,255,0.55)'
  const anchor: React.CSSProperties = {
    position: 'absolute',
    ...(v === 'top' ? { top: 0 } : { bottom: 0 }),
    ...(h === 'left' ? { left: 0 } : { right: 0 }),
  }
  return (
    <div style={{ ...anchor, width: 28, height: 28, pointerEvents: 'none' }}>
      {/* horizontal leg */}
      <div style={{ ...anchor, width: 28, height: 2, background: grad, borderRadius: 3, boxShadow: glow }} />
      {/* vertical leg */}
      <div style={{ ...anchor, width: 2, height: 28, background: grad, borderRadius: 3, boxShadow: glow }} />
    </div>
  )
}

// Real scan time is 10s. The counter is shown "for show" running 0:00→0:30,
// compressed into those 10s (it ticks ~3x faster than wall-clock so it reads 0:30
// exactly when the bar fills). The right-hand static label stays "0:30".
const REAL_MS = 10000
const DISPLAY_SECONDS = 30

export default function ActiveScanning({ onClose, onComplete }: ActiveScanningProps) {
  // `seconds` drives ONLY the ticking left label (0→30, compressed into 10s). The
  // beam + progress bar are pure CSS animations (below); all of them — plus the
  // auto-advance — complete together at the real 10s mark.
  const [seconds, setSeconds] = useState(0) // 0–30 (display only)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    // Label tick: advance the displayed second every REAL_MS/30 (~333ms) so the
    // counter reaches 0:30 exactly when the 10s bar fills.
    const tick = setInterval(() => {
      setSeconds((s) => Math.min(s + 1, DISPLAY_SECONDS))
    }, REAL_MS / DISPLAY_SECONDS)
    // Auto-advance: one timeout at the real 10s mark.
    const done = setTimeout(() => onCompleteRef.current(), REAL_MS)

    return () => {
      clearInterval(tick)
      clearTimeout(done)
    }
  }, [])

  const timeLabel = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '0 24px',
        background: '#FFFFFF',
      }}
    >
      <style>{`
        /* Vertical filament: ONE smooth round-trip tied to the 10s timer — LEFT→RIGHT
           over the first 5s, RIGHT→LEFT over the next 5s, across the inner width of
           the framed zone (320px wide). The beam group is anchored at its bright core
           (left edge) with the 80px trail extending behind it. translateX 0↔320 carries
           the core edge-to-edge; scaleX flips at each end (right at 50% = 5s, left at
           100% = 10s) so the trail always follows BEHIND the direction of travel. Run
           with duration 10s / linear / iteration-count 1, so the beam crosses in lockstep
           with the progress bar and parks back at the LEFT start when the scan ends. */
        @keyframes beamSweepLoop {
          0%     { transform: translateX(0px)   scaleX(1);  }
          49.99% { transform: translateX(320px) scaleX(1);  }
          50%    { transform: translateX(320px) scaleX(-1); }
          99.99% { transform: translateX(0px)   scaleX(-1); }
          100%   { transform: translateX(0px)   scaleX(1);  }
        }
        /* Teeth reveal: ONE pass. The region to the LEFT of the beam becomes full
           color while the right stays dim; the visible area grows left→right as the
           right inset shrinks 100→0, then holds fully revealed (forwards) for the rest
           of the scan — the return passes never re-dim. inset(top right bottom left) */
        @keyframes revealRight {
          0%   { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        /* Progress fill: pure-CSS, smooth 0→100% width over the full 10s scan,
           linear, single pass over the real 10s — decoupled from the label tick. */
        @keyframes progressFill {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      {/* Close button row */}
      <div style={{ paddingTop: 14, paddingBottom: 4 }}>
        <button
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#F5F5F5',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 18,
            color: '#999999',
          }}
          aria-label="Close scanner"
        >
          ✕
        </button>
      </div>

      {/* Headline — centered + same top spacing as Screen 2c ("here's what I see") */}
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#000000',
          textAlign: 'center',
          marginTop: 24,
          letterSpacing: '-0.4px',
        }}
      >
        hold steady
      </h1>

      {/* Teeth hero — no card/window. Sized + positioned to match Scan Result (2c)
          exactly (290-wide image, centered in a 320-tall box) so the arch doesn't
          jump when 2c replaces this screen. marginTop offsets 2b's missing
          pill/back-row so the teeth land in the same spot. */}
      <div
        style={{
          position: 'relative',
          marginTop: 39.5,
          height: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Base — "scanning" state: dimmed + desaturated. (Full color is 2c's job.) */}
        <img
          src="/teeth.png"
          alt="Dental arch"
          draggable={false}
          style={{
            display: 'block',
            width: 290,
            height: 'auto',
            opacity: 0.35,
            filter: 'grayscale(0.7)',
            pointerEvents: 'none',
          }}
        />
        {/* Scanned reveal — the area to the LEFT of the beam turns full color; the
            right stays dim. Grows left→right, synced to the beam's single pass. */}
        <img
          src="/teeth.png"
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 290,
            height: 'auto',
            filter: 'brightness(1.06) saturate(1.04)',
            pointerEvents: 'none',
            animation: 'revealRight 5s linear forwards',
          }}
        />
        {/* Beam capture zone — same rect as the corner frame (320×240), clipped so
            the horizontal beam stays inside the framed area. */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 320,
            height: 240,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {/* Vertical scan filament + trailing wake. The group is anchored at its
              bright core (left edge) with the 80px iridescent trail extending to the
              LEFT (behind it). It sweeps the inner width continuously; scaleX(-1) at
              the right end flips the trail to the right so it always trails behind the
              current direction of travel. */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 1.5,
              height: '100%',
              transformOrigin: 'center',
              animation: 'beamSweepLoop 10s linear 1 forwards',
              pointerEvents: 'none',
            }}
          >
            {/* Trailing gradient — brightest at the beam (right edge, at the core),
                fading to transparent over ~80px behind it. Iridescent, low opacity. */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 80,
                height: '100%',
                background:
                  'linear-gradient(90deg, rgba(200,224,224,0) 0%, rgba(200,224,224,0.05) 42%, rgba(224,200,255,0.16) 76%, rgba(255,179,209,0.30) 100%)',
              }}
            />
            {/* Core — ~1.5px near-white filament, ends fading softly (no blobs),
                with a thin iridescent glow hugging the line. */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 1.5,
                height: '100%',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 10%, #FFFFFF 50%, rgba(255,255,255,0.92) 90%, rgba(255,255,255,0) 100%)',
                boxShadow:
                  '0 0 3px rgba(255,255,255,0.9), 0 0 4px rgba(224,200,255,0.75)',
              }}
            />
          </div>
        </div>

        {/* Viewfinder capture zone — four L-shaped corner brackets (not a full
            rectangle) framing the teeth arch. */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 320,
            height: 240,
            pointerEvents: 'none',
          }}
        >
          <Corner v="top" h="left" />
          <Corner v="top" h="right" />
          <Corner v="bottom" h="left" />
          <Corner v="bottom" h="right" />
        </div>
      </div>

      {/* Caption sits in the lower-middle, just below the teeth (not bottom-pinned). */}
      <p style={{ fontSize: 12, color: '#999999', textAlign: 'center', marginTop: 28, marginBottom: 16 }}>
        hold still while we scan
      </p>

      {/* Progress bar + time */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
            fontSize: 12,
            color: '#999999',
          }}
        >
          <span>{timeLabel}</span>
          <span>0:30</span>
        </div>
        <div
          style={{
            height: 8,
            background: '#F5F5F5',
            borderRadius: 999,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: 0,
              background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 100%)',
              borderRadius: 999,
              animation: 'progressFill 10s linear forwards',
            }}
          />
        </div>
      </div>

      {/* Empty space absorbed at the very bottom so the block sits lower-middle. */}
      <div style={{ flex: 1 }} />
    </div>
  )
}

'use client'
// Screen 1a — Tracking Home
// Clean hero face (400px, full bleed) with pill + headline overlaid, above a
// horizontal iridescent capsule slider. The handle is dragged linearly across
// the capsule; three labels (DAY 0 / TODAY / FORECAST) sit below it. A one-time
// swing hint nudges the handle on first mount.
//
// All milestone data, debounce logic, card content, INSIGHT behavior and the
// 5-state structure are UNCHANGED — only the visual presentation differs.

import { useState, useRef, useEffect } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type CP = 'day0' | 'past' | 'today' | 'future' | 'forecast'

interface Milestone {
  day: number
  text: string
}

// ── Milestone data ────────────────────────────────────────────────────────────

const pastMilestones: Milestone[] = [
  { day: 1,   text: 'brackets bonded' },
  { day: 15,  text: 'first wire engaged' },
  { day: 30,  text: 'initial 0.2 mm shift' },
  { day: 45,  text: 'lower incisors aligning' },
  { day: 60,  text: 'upper gap reducing' },
  { day: 75,  text: 'canine rotation began' },
  { day: 90,  text: 'arch shape rounding' },
  { day: 105, text: 'spacing closed below' },
  { day: 120, text: 'upper canine rotated' },
  { day: 135, text: 'finishing wire engaged' },
]

const futureMilestones: Milestone[] = [
  { day: 148, text: 'upper bite refining' },
  { day: 163, text: '6-month mark close' },
  { day: 178, text: '70% alignment hit' },
  { day: 193, text: 'finishing wire phase' },
  { day: 208, text: 'upper arch settled' },
  { day: 223, text: 'lower arch shaping' },
  { day: 238, text: 'refinement wires in' },
  { day: 253, text: 'final positioning soon' },
  { day: 268, text: 'last detail tweaks' },
  { day: 283, text: 'projected completion' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function nearestCP(p: number): CP {
  if (p <= 0.005) return 'day0'
  if (p <  0.655) return 'past'
  if (p <= 0.665) return 'today'
  if (p <  0.995) return 'future'
  return 'forecast'
}

/** Symmetric piecewise linear: 0 → 0, 0.66 → 142, 1.0 → 283 */
function interpolateDay(p: number): number {
  if (p <= 0.66) return Math.round((p * 142) / 0.66)
  return Math.round(142 + ((p - 0.66) * (283 - 142)) / (1.0 - 0.66))
}

function nearestMilestone(arr: Milestone[], day: number): Milestone {
  return arr.reduce((best, m) =>
    Math.abs(m.day - day) < Math.abs(best.day - day) ? m : best
  )
}

/** -2.8 mm at day 1 → 0.0 mm at day 142 */
function pastMM(day: number): string {
  const mm = Math.max(0, ((142 - day) * 2.8) / 141)
  return `-${mm.toFixed(1)} mm`
}

/** 60% at day 142 → 100% at day 283 */
function futurePct(day: number): number {
  const pct = 60 + ((day - 142) * 40) / 141
  return Math.max(60, Math.min(100, Math.round(pct)))
}

// ── State-derived text ────────────────────────────────────────────────────────

// Card 1 = quantitative metric (label / value / subtext)
function card1Data(cp: CP, liveDay: number): { label: string; value: string; subtext: string } {
  switch (cp) {
    case 'day0':     return { label: 'MOVEMENT',  value: '0.0 mm',                 subtext: 'treatment start' }
    case 'past':     return { label: 'VS TODAY',  value: pastMM(liveDay),         subtext: 'total since this point' }
    case 'today':    return { label: 'THIS WEEK', value: '0.4 mm',                subtext: 'lower right canine' }
    case 'future':   return { label: 'PREDICTED', value: `${futurePct(liveDay)}%`, subtext: 'alignment complete' }
    case 'forecast': return { label: 'PREDICTED', value: '100%',                  subtext: 'alignment complete' }
  }
}

// Card 2 = milestone (always label "MILESTONE" + text, no subtext)
function card2Text(cp: CP, m: Milestone | null): string {
  switch (cp) {
    case 'day0':     return 'journey begins'
    case 'past':     return m ? m.text : ''
    case 'today':    return 'mid-treatment check-in'
    case 'future':   return m ? m.text : ''
    case 'forecast': return 'final adjustments'
  }
}

// ── Easing (swing hint) ─────────────────────────────────────────────────────
const easeOut   = (t: number) => 1 - (1 - t) * (1 - t)
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const easeIn    = (t: number) => t * t

// One swing hint per browser session — survives tab-switch remounts.
let swingHintPlayed = false

// ── Cards ─────────────────────────────────────────────────────────────────────

function MetricCard({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div
      className="cp-fade"
      style={{
        flex: 1,
        height: 90,
        background: '#FFFFFF',
        borderRadius: 24,
        border: '0.5px solid rgba(0,0,0,0.05)',
        boxShadow:
          '-8px -8px 16px rgba(255,255,255,1), 8px 8px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 8,
          color: '#666666',
          fontWeight: 600,
          letterSpacing: '0.08em',
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          fontSize: 20,
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 10, color: '#666666', lineHeight: 1.3, flexShrink: 0 }}>
        {subtext}
      </div>
    </div>
  )
}

function MilestoneCard({ text }: { text: string }) {
  return (
    <div
      className="cp-fade"
      style={{
        flex: 1,
        height: 90,
        background: '#FFFFFF',
        borderRadius: 24,
        border: '0.5px solid rgba(0,0,0,0.05)',
        boxShadow:
          '-8px -8px 16px rgba(255,255,255,1), 8px 8px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 8,
          color: '#666666',
          fontWeight: 600,
          letterSpacing: '0.08em',
          marginBottom: 6,
          flexShrink: 0,
        }}
      >
        MILESTONE
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          fontSize: 12,
          fontWeight: 500,
          color: '#000000',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}
      >
        {text}
      </div>
    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function TrackingHome() {
  const [handlePosition, setHandlePosition]     = useState(0.66)
  const [activeCP, setActiveCP]                 = useState<CP>('today')
  const [activeMilestone, setActiveMilestone]   = useState<Milestone | null>(null)
  const [dragging, setDragging]                 = useState(false)

  const isDragging         = useRef(false)
  const debounceRef        = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef       = useRef<HTMLDivElement>(null)
  // Authoritative live position — the debounce reads from here so it always
  // sees the latest value, never a closure-captured stale one.
  const handlePositionRef  = useRef(0.66)

  // Swing-hint animation bookkeeping
  const swingRafRef     = useRef<number | null>(null)
  const swingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const swingingRef     = useRef(false)

  const stopSwing = () => {
    if (swingRafRef.current != null) cancelAnimationFrame(swingRafRef.current)
    if (swingTimeoutRef.current != null) clearTimeout(swingTimeoutRef.current)
    swingRafRef.current = null
    swingTimeoutRef.current = null
    swingingRef.current = false
  }

  const scheduleUpdate = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const p   = handlePositionRef.current
      const cp  = nearestCP(p)
      const day = interpolateDay(p)
      setActiveCP((prev) => (cp === prev ? prev : cp))
      if (cp === 'past') {
        setActiveMilestone(nearestMilestone(pastMilestones, day))
      } else if (cp === 'future') {
        setActiveMilestone(nearestMilestone(futureMilestones, day))
      } else {
        setActiveMilestone(null)
      }
    }, 300)
  }

  // Convert a pointer clientX to a clamped 0..1 position along the capsule's
  // horizontal extent.
  const positionFromPointer = (clientX: number): number | null => {
    const el = containerRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const p = (clientX - rect.left) / rect.width
    return Math.max(0, Math.min(1, p))
  }

  // Animate the handle to a target position over `dur` ms (label taps).
  const animateTo = (target: number, dur = 400) => {
    stopSwing()
    swingingRef.current = true
    const from = handlePositionRef.current
    const start = performance.now()
    const step = (now: number) => {
      if (!swingingRef.current) return
      const t = Math.min(1, (now - start) / dur)
      const v = from + (target - from) * easeOut(t)
      handlePositionRef.current = v
      setHandlePosition(v)
      if (t < 1) {
        swingRafRef.current = requestAnimationFrame(step)
      } else {
        swingingRef.current = false
        scheduleUpdate()
      }
    }
    swingRafRef.current = requestAnimationFrame(step)
  }

  // ── One-time swing hint ─────────────────────────────────────────────────────
  useEffect(() => {
    if (swingHintPlayed) return
    swingHintPlayed = true
    swingingRef.current = true

    const tween = (from: number, to: number, dur: number, ease: (t: number) => number) =>
      new Promise<void>((resolve) => {
        const start = performance.now()
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / dur)
          const v = from + (to - from) * ease(t)
          handlePositionRef.current = v
          setHandlePosition(v)
          if (t < 1) swingRafRef.current = requestAnimationFrame(step)
          else resolve()
        }
        swingRafRef.current = requestAnimationFrame(step)
      })

    swingTimeoutRef.current = setTimeout(async () => {
      await tween(0.66, 0.75, 400, easeOut)
      if (!swingingRef.current) return
      await tween(0.75, 0.55, 600, easeInOut)
      if (!swingingRef.current) return
      await tween(0.55, 0.66, 400, easeIn)
      if (!swingingRef.current) return
      handlePositionRef.current = 0.66
      setHandlePosition(0.66)
      setActiveCP('today')
      setActiveMilestone(null)
      swingingRef.current = false
    }, 600)

    return () => { stopSwing() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // INSIGHT slot — card fades in/out 200ms; slot itself is always 88px.
  const isToday = activeCP === 'today'
  const [insightMounted, setInsightMounted] = useState(isToday)
  const [insightOpacity, setInsightOpacity] = useState(isToday ? 1 : 0)
  useEffect(() => {
    if (isToday) {
      if (!insightMounted) {
        setInsightMounted(true)
        setInsightOpacity(0)
        const raf = requestAnimationFrame(() => setInsightOpacity(1))
        return () => cancelAnimationFrame(raf)
      }
    } else if (insightMounted) {
      setInsightOpacity(0)
      const t = setTimeout(() => setInsightMounted(false), 200)
      return () => clearTimeout(t)
    }
  }, [isToday, insightMounted])

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }, [])

  const liveDay = interpolateDay(handlePosition)
  const c1      = card1Data(activeCP, liveDay)
  const c2Text  = card2Text(activeCP, activeMilestone)
  // Day counter sits inside the capsule once the fill is wide enough to hold it.
  const dayInsideFill = liveDay >= 71
  // At the extremes the counter is pinned to a capsule edge so it never floats
  // alone or gets stranded mid-fill: day 0 hugs the left edge, day 283 the right.
  const dayPinLeft  = liveDay <= 5
  const dayPinRight = liveDay >= 278

  const resetToToday = () => {
    stopSwing()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    handlePositionRef.current = 0.66
    setHandlePosition(0.66)
    setActiveCP('today')
    setActiveMilestone(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF' }}>

      {/* ── Hero face — full bleed, extends up behind the (overlaid, transparent)
          status bar so the pink halo blends seamlessly into the top of the
          frame. Container = 450px face area + 44px status-bar band = 494px.
          The face image is pushed down 44px so it stays in the exact same spot
          as before; the halo fills the whole container, including the top band. ── */}
      <div style={{ position: 'relative', width: '100%', height: 494, flexShrink: 0, overflow: 'hidden' }}>
        {/* Pink halo glow (scaled up, behind the image) — fills to the top edge */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 420,
            height: 460,
            borderRadius: '50%',
            background: 'rgba(255,179,209,0.4)',
            filter: 'blur(90px)',
            pointerEvents: 'none',
          }}
        />
        <img
          src="/user.png"
          alt="Your smile"
          style={{
            position: 'absolute',
            top: 44,
            left: 0,
            right: 0,
            height: 450,
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center 50%',
            display: 'block',
            // Dissolve the photo's top edge into the pink halo — no hard seam
            // under the status bar.
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 52px)',
            maskImage: 'linear-gradient(to bottom, transparent 0, #000 52px)',
          }}
        />
      </div>

      {/* ── Capsule slider area ── */}
      <div style={{ padding: '0 24px', marginTop: 8, flexShrink: 0 }}>
        {/* Unified neumorphic embossed capsule (single container + drag surface) */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            height: 44,
            borderRadius: 999,
            background: '#FFFFFF',
            border: '0.5px solid rgba(0,0,0,0.04)',
            boxShadow:
              '-4px -4px 10px rgba(255,255,255,1), 4px 4px 10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 28px 6px rgba(255,179,209,0.18), 0 0 56px 12px rgba(224,200,255,0.10)',
            overflow: 'hidden',
            touchAction: 'none',
            userSelect: 'none',
            cursor: dragging ? 'grabbing' : 'grab',
          }}
          onPointerDown={(e) => {
            e.preventDefault()
            stopSwing()
            e.currentTarget.setPointerCapture(e.pointerId)
            isDragging.current = true
            setDragging(true)
            const p = positionFromPointer(e.clientX)
            if (p != null) {
              handlePositionRef.current = p
              setHandlePosition(p)
              scheduleUpdate()
            }
          }}
          onPointerMove={(e) => {
            if (!isDragging.current) return
            const p = positionFromPointer(e.clientX)
            if (p == null) return
            handlePositionRef.current = p
            setHandlePosition(p)
            scheduleUpdate()
          }}
          onPointerUp={(e) => {
            e.currentTarget.releasePointerCapture(e.pointerId)
            isDragging.current = false
            setDragging(false)
            scheduleUpdate()
          }}
          onPointerCancel={() => {
            isDragging.current = false
            setDragging(false)
          }}
        >
          {/* Vivid iridescent fill — clipped to the capsule's rounded edges */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${handlePosition * 100}%`,
              background: 'linear-gradient(90deg, #FFB3D1 0%, #E0C8FF 100%)',
              borderRadius: 999,
              // Right-edge inset shadow doubles as the "drag me" hint now that
              // the chevrons are gone.
              boxShadow:
                'inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(0,0,0,0.05), inset -4px 0 8px rgba(0,0,0,0.08)',
              pointerEvents: 'none',
            }}
          />

          {/* Day counter — rides the fill's right edge. Sits just outside the
              fill on white while it's short (≤ day 70), then tucks inside the
              fill near its right edge once there's room (≥ day 71). Clamped so
              it never runs off either end of the capsule. */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '50%',
              ...(dayPinLeft
                ? { left: 16, transform: 'translateY(-50%)' }
                : dayPinRight
                ? { right: 16, transform: 'translateY(-50%)' }
                : dayInsideFill
                ? {
                    left: `min(calc(${handlePosition * 100}% - 10px), calc(100% - 52px))`,
                    transform: 'translate(-100%, -50%)',
                  }
                : {
                    left: `max(calc(${handlePosition * 100}% + 10px), 52px)`,
                    transform: 'translate(0, -50%)',
                  }),
              transition: 'left 200ms ease-out, right 200ms ease-out, transform 200ms ease-out',
              display: 'flex',
              alignItems: 'baseline',
              gap: 3,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 400, color: '#000000', lineHeight: 1 }}>
              day
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#000000',
                letterSpacing: '-0.4px',
                lineHeight: 1,
              }}
            >
              {liveDay}
            </span>
          </div>
        </div>

        {/* Labels below the capsule */}
        <div style={{ position: 'relative', height: 16, marginTop: 6 }}>
          <span
            onClick={() => animateTo(0)}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              fontSize: 9,
              fontWeight: activeCP === 'day0' ? 600 : 400,
              color: activeCP === 'day0' ? '#000000' : '#999999',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            DAY 0
          </span>
          <span
            onClick={resetToToday}
            style={{
              position: 'absolute',
              left: '65%',
              top: 0,
              transform: 'translateX(-100%)',
              fontSize: 9,
              fontWeight: activeCP === 'today' ? 600 : 400,
              color: activeCP === 'today' ? '#000000' : '#999999',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            TODAY
          </span>
          <span
            onClick={() => animateTo(1)}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              fontSize: 9,
              fontWeight: activeCP === 'forecast' ? 600 : 400,
              color: activeCP === 'forecast' ? '#000000' : '#999999',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            FORECAST
          </span>
        </div>
      </div>

      {/* ── Lower content (padded) — compacted to fit the viewport ── */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column' }}>

        {/* Card row — fixed 90 */}
        <div style={{ display: 'flex', gap: 10, height: 90, marginTop: 16 }}>
          <MetricCard key={`c1-${activeCP}`} label={c1.label} value={c1.value} subtext={c1.subtext} />
          <MilestoneCard key={`c2-${activeCP}-${activeMilestone?.day ?? 'x'}`} text={c2Text} />
        </div>

        {/* INSIGHT slot — fixed 64, content conditional on today */}
        <div style={{ height: 64, marginTop: 8 }}>
          {insightMounted && (
            <div
              style={{
                height: '100%',
                opacity: insightOpacity,
                transition: 'opacity 200ms ease',
                background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)',
                borderRadius: 20,
                padding: 12,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: '#000000',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  marginBottom: 6,
                }}
              >
                INSIGHT
              </div>
              <p style={{ fontSize: 11, fontWeight: 500, color: '#000000', lineHeight: 1.3 }}>
                7-9 months until your final smile · on pace
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

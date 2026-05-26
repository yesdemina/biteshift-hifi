'use client'
// Screen 1a — Tracking Home
// Symmetric interactive timeline (Day 0 → Day 142 → Day 283) with discrete
// snap points at the endpoints + Today; Past and Future are continuous
// scrubbable ranges with 10 milestones each.

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

function dayCounterLabel(cp: CP): string {
  switch (cp) {
    case 'day0':     return 'START'
    case 'past':     return 'PAST'
    case 'today':    return 'TODAY'
    case 'future':   return 'FORECAST'
    case 'forecast': return 'FORECAST'
  }
}

function pillText(cp: CP, m: Milestone | null): string {
  switch (cp) {
    case 'day0':     return 'day 0 · where it began'
    case 'today':    return 'day 142 of treatment'
    case 'forecast': return 'day 283 · final smile projected'
    case 'past': {
      const day = m ? m.day : 75
      return `day ${day} · ${142 - day} days ago`
    }
    case 'future': {
      const day = m ? m.day : 210
      const months = Math.max(1, Math.round((day - 142) / 30))
      return `day ${day} · ${months} months from now`
    }
  }
}

function headlineText(cp: CP): string {
  switch (cp) {
    case 'day0':     return 'how it started'
    case 'past':     return 'how it was'
    case 'today':    return 'your smile, mid-shift'
    case 'future':   return 'how it will be'
    case 'forecast': return 'how it will be'
  }
}

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

// ── Gradients ─────────────────────────────────────────────────────────────────

const CARD1_GRADIENT = 'linear-gradient(135deg, #FFD9E5 0%, #FFB3D1 100%)'
const CARD2_GRADIENT = 'linear-gradient(135deg, #EFE0FF 0%, #E0C8FF 100%)'

// ── Cards ─────────────────────────────────────────────────────────────────────

function MetricCard({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div
      className="cp-fade"
      style={{
        flex: 1,
        height: 110,
        background: CARD1_GRADIENT,
        borderRadius: 20,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 9,
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
          fontSize: 22,
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#666666', lineHeight: 1.3, flexShrink: 0 }}>
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
        height: 110,
        background: CARD2_GRADIENT,
        borderRadius: 20,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: '#666666',
          fontWeight: 600,
          letterSpacing: '0.08em',
          marginBottom: 8,
          flexShrink: 0,
        }}
      >
        MILESTONE
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          fontSize: 13,
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
  const trackRef           = useRef<HTMLDivElement>(null)
  // Authoritative live position — the debounce reads from here so it always
  // sees the latest value, never a closure-captured stale one.
  const handlePositionRef  = useRef(0.66)

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

  const positionFromClientX = (clientX: number): number => {
    if (!trackRef.current) return handlePosition
    const { left, width } = trackRef.current.getBoundingClientRect()
    if (width === 0) return handlePosition
    return Math.max(0, Math.min(1, (clientX - left) / width))
  }

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
  const pill    = pillText(activeCP, activeMilestone)
  const head    = headlineText(activeCP)
  const dayLbl  = dayCounterLabel(activeCP)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF' }}>
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column' }}>

        {/* Pill slot — fixed 28 */}
        <div style={{ height: 28, display: 'flex', alignItems: 'center' }}>
          <div
            key={`pill-${activeCP}-${activeMilestone?.day ?? 'x'}`}
            className="cp-fade"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#FFD9E5',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 500,
              color: '#000000',
            }}
          >
            {pill}
          </div>
        </div>

        {/* Headline slot — fixed 32 */}
        <div style={{ height: 32, marginTop: 8, display: 'flex', alignItems: 'center' }}>
          <h1
            key={`h-${activeCP}`}
            className="cp-fade"
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#000000',
              letterSpacing: '-0.5px',
              whiteSpace: 'nowrap',
              lineHeight: 1,
            }}
          >
            {head}
          </h1>
        </div>

        {/* Photo slot — fixed 320 */}
        <div
          style={{
            height: 320,
            marginTop: 8,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: 'rgba(255,179,209,0.4)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <img
            src="/user.png"
            alt="Your smile"
            style={{
              position: 'relative',
              maxHeight: '100%',
              maxWidth: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Timeline slot */}
        <div style={{ marginTop: 8 }}>
          {/* Track — no anchor dots, just the line + handle */}
          <div
            ref={trackRef}
            style={{ position: 'relative', height: 18, display: 'flex', alignItems: 'center' }}
          >
            <div style={{ width: '100%', height: 2, background: '#FFB3D1', borderRadius: 999 }} />

            <div
              style={{
                position: 'absolute',
                left: `${handlePosition * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '2px solid #FFB3D1',
                boxShadow: '0 2px 8px rgba(255, 179, 209, 0.4)',
                boxSizing: 'border-box',
                cursor: dragging ? 'grabbing' : 'grab',
                touchAction: 'none',
                userSelect: 'none',
                zIndex: 2,
                transition: dragging ? 'none' : 'left 0.4s ease',
              }}
              onPointerDown={(e) => {
                e.preventDefault()
                e.currentTarget.setPointerCapture(e.pointerId)
                isDragging.current = true
                setDragging(true)
              }}
              onPointerMove={(e) => {
                if (!isDragging.current) return
                const p = positionFromClientX(e.clientX)
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
            />
          </div>

          {/* 3 labels: DAY 0 / TODAY / FORECAST */}
          <div style={{ position: 'relative', height: 14, marginTop: 10 }}>
            {([
              { id: 'day0',     pos: 0,    label: 'DAY 0',    tx: '0%'   },
              { id: 'today',    pos: 0.66, label: 'TODAY',    tx: '-50%' },
              { id: 'forecast', pos: 1,    label: 'FORECAST', tx: '-100%' },
            ] as const).map((a) => {
              const active = activeCP === a.id
              const isTodayLabel = a.id === 'today'
              return (
                <span
                  key={a.id}
                  onClick={
                    isTodayLabel
                      ? () => {
                          if (debounceRef.current) clearTimeout(debounceRef.current)
                          handlePositionRef.current = 0.66
                          setHandlePosition(0.66)
                          setActiveCP('today')
                          setActiveMilestone(null)
                        }
                      : undefined
                  }
                  style={{
                    position: 'absolute',
                    left: `${a.pos * 100}%`,
                    top: 0,
                    transform: `translateX(${a.tx})`,
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    color: active ? '#000000' : '#999999',
                    fontWeight: active ? 600 : 400,
                    cursor: isTodayLabel ? 'pointer' : 'default',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {a.label}
                </span>
              )
            })}
          </div>
        </div>

        {/* Day counter slot — fixed 32 */}
        <div
          style={{
            height: 32,
            marginTop: 12,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#000000',
              letterSpacing: '-0.6px',
              lineHeight: 1,
            }}
          >
            day {liveDay}
          </span>
          <span
            key={`dl-${activeCP}`}
            className="cp-fade"
            style={{ fontSize: 9, fontWeight: 600, color: '#999999', letterSpacing: '0.08em' }}
          >
            {dayLbl}
          </span>
        </div>

        {/* Card row — fixed 110 */}
        <div style={{ display: 'flex', gap: 12, height: 110, marginTop: 12 }}>
          <MetricCard key={`c1-${activeCP}`} label={c1.label} value={c1.value} subtext={c1.subtext} />
          <MilestoneCard key={`c2-${activeCP}-${activeMilestone?.day ?? 'x'}`} text={c2Text} />
        </div>

        {/* INSIGHT slot — fixed 88, content conditional on today */}
        <div style={{ height: 88, marginTop: 20 }}>
          {insightMounted && (
            <div
              style={{
                height: '100%',
                opacity: insightOpacity,
                transition: 'opacity 200ms ease',
                background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)',
                borderRadius: 20,
                padding: 16,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: '#000000',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  marginBottom: 6,
                }}
              >
                INSIGHT
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#000000', lineHeight: 1.45 }}>
                7-9 months until your final smile · on pace
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

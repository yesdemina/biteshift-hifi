'use client'
// Screen 1a — Tracking Home v4
// Stable layout: every slot has a fixed height so nothing shifts between
// timeline positions. 5 control points (day0/past/today/future/forecast),
// 20 past + 10 future milestones, with nearest-milestone lookup on debounce.

import { useState, useRef, useEffect } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type CP = 'day0' | 'past' | 'today' | 'future' | 'forecast'

interface Milestone {
  day: number
  text: string
}

// ── Milestone data ────────────────────────────────────────────────────────────

const pastMilestones: Milestone[] = [
  { day: 1,   text: 'brackets bonded · first day of treatment' },
  { day: 7,   text: 'initial soreness easing · adjusting phase' },
  { day: 14,  text: 'first arch wire engaged · gentle pressure begins' },
  { day: 21,  text: 'upper incisors started rotating' },
  { day: 30,  text: 'bracket pressure activated · 0.2 mm shift logged' },
  { day: 38,  text: 'lower midline correction underway' },
  { day: 45,  text: 'lower incisors aligning · midline correction in progress' },
  { day: 55,  text: 'first elastic engagement · bite refinement starts' },
  { day: 60,  text: 'upper bite gap reducing' },
  { day: 70,  text: 'canine pressure phase begins' },
  { day: 75,  text: 'canine rotation began' },
  { day: 85,  text: 'rotation past halfway · upper right canine' },
  { day: 90,  text: 'arch shape rounding out' },
  { day: 100, text: 'spacing closed · lower arch' },
  { day: 108, text: 'overbite reduced · 1.2 mm vertical correction' },
  { day: 115, text: 'molar tipping correction underway' },
  { day: 120, text: 'upper canine rotation complete' },
  { day: 128, text: 'lower premolar alignment finished' },
  { day: 135, text: 'refined wire engaged · finishing phase nearing' },
  { day: 141, text: 'yesterday · 0.1 mm overnight shift' },
]

const futureMilestones: Milestone[] = [
  { day: 150, text: 'next week · upper bite refinement' },
  { day: 165, text: 'month 6 milestone approaching' },
  { day: 180, text: 'alignment milestone · 70% complete' },
  { day: 195, text: 'wire size step-down · finishing phase' },
  { day: 210, text: 'upper arch nearly settled' },
  { day: 225, text: 'lower arch reaching target shape' },
  { day: 240, text: 'refinement wires engaged' },
  { day: 255, text: 'final positioning underway' },
  { day: 263, text: 'last detail adjustments' },
  { day: 270, text: 'projected completion · final adjustment' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function nearestCP(p: number): CP {
  if (p < 0.005) return 'day0'
  if (p < 0.495) return 'past'
  if (p < 0.825) return 'today'
  if (p < 0.995) return 'future'
  return 'forecast'
}

/** Piecewise linear: 0 → 0, 0.66 → 142, 1.0 → 270 */
function interpolateDay(p: number): number {
  if (p <= 0.66) return Math.round((p * 142) / 0.66)
  return Math.round(142 + ((p - 0.66) * (270 - 142)) / (1.0 - 0.66))
}

function nearestMilestone(arr: Milestone[], day: number): Milestone {
  return arr.reduce((best, m) =>
    Math.abs(m.day - day) < Math.abs(best.day - day) ? m : best
  )
}

function pastMM(day: number): string {
  // -2.8 mm at day 1, 0.0 mm at day 142
  const mm = Math.max(0, ((142 - day) * 2.8) / 141)
  return `-${mm.toFixed(1)} mm`
}

function futurePct(day: number): number {
  // 60% at day 142, 92% at day 270
  const pct = 60 + ((day - 142) * 32) / 128
  return Math.max(60, Math.min(92, Math.round(pct)))
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
    case 'forecast': return 'forecast · 9 months ahead'
    case 'past': {
      const day = m ? m.day : 100
      return `day ${day} · ${142 - day} days ago`
    }
    case 'future': {
      const day = m ? m.day : 200
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
    case 'forecast': return 'the projected you'
  }
}

interface CardData {
  label: string
  value: string
  valueIsText: boolean
  subtext?: string
  progress?: number
}

function card1Data(cp: CP, liveDay: number): CardData {
  switch (cp) {
    case 'day0':     return { label: 'STARTED',  value: 'baseline',    valueIsText: true,  subtext: 'initial alignment' }
    case 'past':     return { label: 'VS TODAY', value: pastMM(liveDay), valueIsText: false, subtext: 'total movement since this point' }
    case 'today':    return { label: 'THIS WEEK', value: '0.4 mm',     valueIsText: false, subtext: 'lower right canine moved' }
    case 'future':   return { label: 'PREDICTED', value: `${futurePct(liveDay)}%`, valueIsText: false, subtext: 'alignment complete' }
    case 'forecast': return { label: 'PREDICTED', value: '92%',        valueIsText: false, subtext: 'alignment complete' }
  }
}

function card2Data(cp: CP, m: Milestone | null): CardData {
  switch (cp) {
    case 'day0':     return { label: 'GOAL',        value: 'final smile',   valueIsText: true,  subtext: 'your ideal target' }
    case 'past':     return { label: 'MILESTONE',   value: m ? m.text : '', valueIsText: true }
    case 'today':    return { label: 'AI FORECAST', value: '7-9 months',    valueIsText: false, subtext: 'until your final smile', progress: 0.60 }
    case 'future':   return { label: 'MILESTONE',   value: m ? m.text : '', valueIsText: true }
    case 'forecast': return { label: 'CONFIDENCE',  value: 'high',          valueIsText: true,  subtext: '± 3 weeks' }
  }
}

const PINK_GRADIENT     = 'linear-gradient(135deg, #FFD9E5 0%, #EFE0FF 100%)'
const LAVENDER_GRADIENT = 'linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)'

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ data, gradient }: { data: CardData; gradient: string }) {
  const { label, value, valueIsText, subtext, progress } = data
  return (
    <div
      className="cp-fade"
      style={{
        flex: 1,
        height: 110,
        background: gradient,
        borderRadius: 20,
        padding: 14,
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
          marginBottom: 6,
          flexShrink: 0,
        }}
      >
        {label}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          fontSize: valueIsText ? (value.length > 14 ? 13 : 18) : 22,
          fontWeight: valueIsText && value.length > 14 ? 500 : valueIsText ? 600 : 700,
          color: '#000000',
          lineHeight: valueIsText && value.length > 14 ? 1.3 : 1.15,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}
      >
        {value}
      </div>

      {subtext && (
        <div style={{ fontSize: 11, color: '#666666', lineHeight: 1.3, flexShrink: 0, marginTop: 4 }}>
          {subtext}
        </div>
      )}

      {progress !== undefined && (
        <div
          style={{
            marginTop: 8,
            height: 4,
            background: '#FFFFFF',
            border: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: 999,
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.round(progress * 100)}%`,
              background: 'linear-gradient(90deg, #FFB3D1 0%, #E0C8FF 100%)',
              borderRadius: 999,
            }}
          />
        </div>
      )}
    </div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function TrackingHome() {
  const [handlePosition, setHandlePosition]     = useState(0.66)
  const [activeCP, setActiveCP]                 = useState<CP>('today')
  const [activeMilestone, setActiveMilestone]   = useState<Milestone | null>(null)
  const [dragging, setDragging]                 = useState(false)

  const isDragging  = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const trackRef    = useRef<HTMLDivElement>(null)

  // Debounced state update — discrete text settles 300ms after the last move.
  const scheduleUpdate = (p: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const cp = nearestCP(p)
      setActiveCP((prev) => (cp === prev ? prev : cp))
      const day = interpolateDay(p)
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

  // Live values
  const liveDay = interpolateDay(handlePosition)
  const c1      = card1Data(activeCP, liveDay)
  const c2      = card2Data(activeCP, activeMilestone)
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

        {/* Timeline slot — fixed ~48 */}
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
                setHandlePosition(p)
                scheduleUpdate(p)
              }}
              onPointerUp={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId)
                isDragging.current = false
                setDragging(false)
                scheduleUpdate(handlePosition)
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
          <StatCard key={`c1-${activeCP}`} data={c1} gradient={PINK_GRADIENT} />
          <StatCard key={`c2-${activeCP}-${activeMilestone?.day ?? 'x'}`} data={c2} gradient={LAVENDER_GRADIENT} />
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
                on pace with your treatment plan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

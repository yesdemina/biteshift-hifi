'use client'
// Screen 1a — Tracking Home
// Interactive timeline with 4 control points (Day 0 / Past / Today / Forecast).
// Numbers interpolate smoothly with the handle; text labels settle after a 300ms debounce.

import { useState, useRef, useEffect } from 'react'

type CP = 'day0' | 'past' | 'today' | 'forecast'

const ANCHORS: { id: CP; pos: number; dayValue: number; label: string }[] = [
  { id: 'day0',     pos: 0.00, dayValue: 0,   label: 'DAY 0' },
  { id: 'past',     pos: 0.33, dayValue: 100, label: 'PAST' },
  { id: 'today',    pos: 0.66, dayValue: 142, label: 'TODAY' },
  { id: 'forecast', pos: 1.00, dayValue: 240, label: 'FORECAST' },
]

interface CardSpec {
  label: string
  value: string
  valueIsText: boolean
  subtext?: string
  progress?: number
}

interface CPState {
  pill: string
  headline: string
  dayPrefix: 'day' | 'month'
  dayRightLabel: string
  card1: CardSpec
  card1Gradient: string
  card2: CardSpec
  card2Gradient: string
}

const PINK_GRADIENT     = 'linear-gradient(135deg, #FFD9E5 0%, #EFE0FF 100%)'
const LAVENDER_GRADIENT = 'linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)'

const CP_STATES: Record<CP, CPState> = {
  day0: {
    pill: 'day 0 · where it began',
    headline: 'how it started',
    dayPrefix: 'day',
    dayRightLabel: 'START',
    card1:        { label: 'STARTED', value: 'baseline',    valueIsText: true, subtext: 'initial alignment baseline' },
    card1Gradient: PINK_GRADIENT,
    card2:        { label: 'GOAL',    value: 'final smile', valueIsText: true, subtext: 'your ideal target', progress: 0 },
    card2Gradient: LAVENDER_GRADIENT,
  },
  past: {
    pill: 'day 100 · 42 days ago',
    headline: 'how it was',
    dayPrefix: 'day',
    dayRightLabel: 'PAST',
    card1:        { label: 'VS TODAY',  value: '-2.1 mm',       valueIsText: false, subtext: 'total movement since this point' },
    card1Gradient: PINK_GRADIENT,
    card2:        { label: 'MILESTONE', value: 'spacing closed', valueIsText: true },
    card2Gradient: LAVENDER_GRADIENT,
  },
  today: {
    pill: 'day 142 of treatment',
    headline: 'your smile, mid-shift',
    dayPrefix: 'day',
    dayRightLabel: 'TODAY',
    card1:        { label: 'THIS WEEK',   value: '0.4 mm',      valueIsText: false, subtext: 'lower right canine moved' },
    card1Gradient: PINK_GRADIENT,
    card2:        { label: 'AI FORECAST', value: '7-9 months',  valueIsText: false, subtext: 'until your final smile', progress: 0.60 },
    card2Gradient: LAVENDER_GRADIENT,
  },
  forecast: {
    pill: 'forecast · 6 months from now',
    headline: 'how it will be',
    dayPrefix: 'month',
    dayRightLabel: 'FORECAST',
    card1:        { label: 'PREDICTED',  value: '92%', valueIsText: false, subtext: 'alignment complete' },
    card1Gradient: PINK_GRADIENT,
    card2:        { label: 'CONFIDENCE', value: 'high', valueIsText: true, subtext: '± 3 weeks', progress: 0.95 },
    card2Gradient: LAVENDER_GRADIENT,
  },
}

function nearestCP(p: number): CP {
  if (p < 0.165) return 'day0'
  if (p < 0.495) return 'past'
  if (p < 0.825) return 'today'
  return 'forecast'
}

/** Linear interpolation across the 4 anchor day values based on position 0–1. */
function interpolateDayValue(p: number): number {
  if (p <= 0.33) return Math.round(0   + (100 - 0)   * (p / 0.33))
  if (p <= 0.66) return Math.round(100 + (142 - 100) * ((p - 0.33) / 0.33))
  return            Math.round(142 + (240 - 142) * ((p - 0.66) / 0.34))
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, valueIsText, subtext, gradient, progress,
}: CardSpec & { gradient: string }) {
  return (
    <div className="cp-fade" style={{ flex: 1, background: gradient, borderRadius: 20, padding: 14 }}>
      <div style={{ fontSize: 9, color: '#666666', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: valueIsText ? 18 : 22,
          fontWeight: valueIsText ? 600 : 700,
          color: '#000000',
          lineHeight: 1.15,
        }}
      >
        {value}
      </div>
      {subtext && (
        <div style={{ fontSize: 11, color: '#666666', marginTop: 5, lineHeight: 1.3 }}>
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
  // Normalised 0–1 handle position
  const [handlePosition, setHandlePosition]       = useState(0.66)
  const [activeControlPoint, setActiveControlPoint] = useState<CP>('today')
  const [dragging, setDragging] = useState(false)
  const isDragging  = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const trackRef    = useRef<HTMLDivElement>(null)

  // Schedule a debounced control-point update 300ms after the last move
  const scheduleCPUpdate = (p: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setActiveControlPoint((prev) => {
        const next = nearestCP(p)
        return next === prev ? prev : next
      })
    }, 300)
  }

  const positionFromClientX = (clientX: number): number => {
    if (!trackRef.current) return handlePosition
    const { left, width } = trackRef.current.getBoundingClientRect()
    return Math.max(0, Math.min(1, (clientX - left) / width))
  }

  // INSIGHT mount/unmount with 200ms fade in/out
  const isToday = activeControlPoint === 'today'
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

  const state         = CP_STATES[activeControlPoint]
  const dayValue      = interpolateDayValue(handlePosition)
  const displayNumber = state.dayPrefix === 'month' ? Math.max(1, Math.round(dayValue / 30)) : dayValue

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF' }}>
      {/* ── Top: pill + headline (anchored, debounced) ── */}
      <div style={{ flexShrink: 0, padding: '16px 24px 0' }}>
        <div
          key={`pill-${activeControlPoint}`}
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
          {state.pill}
        </div>
        <h1
          key={`h-${activeControlPoint}`}
          className="cp-fade"
          style={{
            marginTop: 12,
            fontSize: 20,
            fontWeight: 700,
            color: '#000000',
            letterSpacing: '-0.5px',
            whiteSpace: 'nowrap',
          }}
        >
          {state.headline}
        </h1>
      </div>

      {/* ── Centered content group ── */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Hero */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 200, height: 200, borderRadius: '50%',
              background: 'rgba(255,179,209,0.4)', filter: 'blur(60px)', pointerEvents: 'none',
            }}
          />
          <img
            src="/user.png"
            alt="Your smile"
            style={{ position: 'relative', width: 240, height: 'auto', display: 'block' }}
          />
        </div>

        {/* Timeline */}
        <div style={{ width: '100%', padding: '0 24px', marginTop: 16 }}>
          {/* Track */}
          <div
            ref={trackRef}
            style={{ position: 'relative', height: 18, display: 'flex', alignItems: 'center' }}
          >
            <div style={{ width: '100%', height: 2, background: '#FFB3D1', borderRadius: 999 }} />

            {ANCHORS.map((a) => (
              <div
                key={a.id}
                style={{
                  position: 'absolute',
                  left: `${a.pos * 100}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: '#FFB3D1',
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Draggable handle */}
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
                scheduleCPUpdate(p)
              }}
              onPointerUp={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId)
                isDragging.current = false
                setDragging(false)
                scheduleCPUpdate(handlePosition)
              }}
              onPointerCancel={() => {
                isDragging.current = false
                setDragging(false)
              }}
            />
          </div>

          {/* Anchor labels */}
          <div style={{ position: 'relative', height: 14, marginTop: 10 }}>
            {ANCHORS.map((a, i) => {
              const active = activeControlPoint === a.id
              const tx = i === 0
                ? '0%'
                : i === ANCHORS.length - 1
                  ? '-100%'
                  : '-50%'
              const isTodayLabel = a.id === 'today'
              return (
                <span
                  key={a.id}
                  onClick={
                    isTodayLabel
                      ? () => {
                          if (debounceRef.current) clearTimeout(debounceRef.current)
                          setHandlePosition(0.66)
                          setActiveControlPoint('today')
                        }
                      : undefined
                  }
                  style={{
                    position: 'absolute',
                    left: `${a.pos * 100}%`,
                    top: 0,
                    transform: `translateX(${tx})`,
                    fontSize: 9,
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

        {/* Day line — number interpolates in real time, label settles on debounce */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 16 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#000000',
              letterSpacing: '-0.6px',
              lineHeight: 1,
            }}
          >
            {state.dayPrefix} {displayNumber}
          </span>
          <span
            key={`dl-${activeControlPoint}`}
            className="cp-fade"
            style={{ fontSize: 9, fontWeight: 600, color: '#999999', letterSpacing: '0.5px' }}
          >
            {state.dayRightLabel}
          </span>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24, width: '100%', padding: '0 24px' }}>
          <StatCard
            key={`c1-${activeControlPoint}`}
            label={state.card1.label}
            value={state.card1.value}
            valueIsText={state.card1.valueIsText}
            subtext={state.card1.subtext}
            progress={state.card1.progress}
            gradient={state.card1Gradient}
          />
          <StatCard
            key={`c2-${activeControlPoint}`}
            label={state.card2.label}
            value={state.card2.value}
            valueIsText={state.card2.valueIsText}
            subtext={state.card2.subtext}
            progress={state.card2.progress}
            gradient={state.card2Gradient}
          />
        </div>

        {/* INSIGHT card — only when Today; fades in/out 200ms */}
        {insightMounted && (
          <div
            style={{
              width: '100%',
              marginTop: 24,
              padding: '0 24px',
              opacity: insightOpacity,
              transition: 'opacity 200ms ease',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #FFB3D1 0%, #E0C8FF 50%, #C8E0E0 100%)',
                borderRadius: 20,
                padding: 20,
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
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
// Screen 1a — Tracking Home
// Headline anchored top; hero · timeline · day line · cards centered as one group.

import { useState, useRef } from 'react'
import { trackingData } from '@/lib/mockData'

// ── Straight timeline ─────────────────────────────────────────────────────────

function Timeline() {
  const [pct, setPct] = useState(50)
  const [dragging, setDragging] = useState(false)
  const isDragging = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const pctFromClientX = (clientX: number): number => {
    if (!trackRef.current) return pct
    const { left, width } = trackRef.current.getBoundingClientRect()
    return Math.max(0, Math.min(100, ((clientX - left) / width) * 100))
  }

  return (
    <div style={{ width: '100%', padding: '0 24px', marginTop: 16 }}>
      {/* Track */}
      <div
        ref={trackRef}
        style={{ position: 'relative', height: 16, display: 'flex', alignItems: 'center' }}
      >
        <div style={{ width: '100%', height: 1.5, background: '#FFB3D1', borderRadius: 999 }} />

        <div
          style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translate(-50%, -50%)',
            width: 8, height: 8, borderRadius: '50%', background: '#FFB3D1', pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translate(50%, -50%)',
            width: 8, height: 8, borderRadius: '50%', background: '#FFB3D1', pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute', left: `${pct}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 16, height: 16, borderRadius: '50%', background: '#FFB3D1',
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none', userSelect: 'none', zIndex: 2,
            transition: dragging ? 'none' : 'left 0.3s ease',
          }}
          onPointerDown={(e) => {
            e.preventDefault()
            e.currentTarget.setPointerCapture(e.pointerId)
            isDragging.current = true
            setDragging(true)
          }}
          onPointerMove={(e) => {
            if (!isDragging.current) return
            setPct(pctFromClientX(e.clientX))
          }}
          onPointerUp={(e) => {
            e.currentTarget.releasePointerCapture(e.pointerId)
            isDragging.current = false
            setDragging(false)
          }}
          onPointerCancel={() => {
            isDragging.current = false
            setDragging(false)
          }}
        />
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 9, color: '#999999', letterSpacing: '0.5px' }}>DAY 0</span>
        <span
          onClick={() => setPct(50)}
          style={{ fontSize: 9, color: '#000000', fontWeight: 600, letterSpacing: '0.5px', cursor: 'pointer', userSelect: 'none' }}
        >
          TODAY
        </span>
        <span style={{ fontSize: 9, color: '#999999', letterSpacing: '0.5px' }}>FORECAST</span>
      </div>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, bigNumber, caption, gradient, progress,
}: {
  label: string
  bigNumber: string
  caption?: string
  gradient: string
  progress?: number
}) {
  return (
    <div style={{ flex: 1, background: gradient, borderRadius: 20, padding: 14 }}>
      <div style={{ fontSize: 9, color: '#666666', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#000000', lineHeight: 1.1 }}>
        {bigNumber}
      </div>
      {caption && (
        <div style={{ fontSize: 12, color: '#666666', marginTop: 5, lineHeight: 1.3 }}>
          {caption}
        </div>
      )}
      {progress !== undefined && (
        <div style={{ marginTop: 8, height: 4, background: '#E0E0E0', borderRadius: 999 }}>
          <div
            style={{
              height: '100%',
              width: `${Math.round(progress * 100)}%`,
              background: '#FFB3D1',
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF' }}>
      {/* ── Status pill + headline (anchored top) ── */}
      <div style={{ flexShrink: 0, padding: '16px 24px 0' }}>
        <div
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
          day {trackingData.dayOfTreatment} of treatment
        </div>
        <h1
          style={{
            marginTop: 12,
            fontSize: 20,
            fontWeight: 700,
            color: '#000000',
            letterSpacing: '-0.5px',
            whiteSpace: 'nowrap',
          }}
        >
          your smile in motion
        </h1>
      </div>

      {/* ── Centered content group: hero · timeline · day line · cards ── */}
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
        {/* User photo with soft pink glow */}
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
        <Timeline />

        {/* Day line — 16px below timeline */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#000000', letterSpacing: '-0.6px', lineHeight: 1 }}>
            day {trackingData.dayOfTreatment}
          </span>
          <span style={{ fontSize: 9, fontWeight: 600, color: '#999999', letterSpacing: '0.5px' }}>
            TODAY
          </span>
        </div>

        {/* Stat cards — 24px below day line */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24, width: '100%', padding: '0 24px' }}>
          <StatCard
            label="THIS WEEK"
            bigNumber={trackingData.weeklyMovement}
            caption="lower right canine moved"
            gradient="linear-gradient(135deg, #FFD9E5 0%, #EFE0FF 100%)"
          />
          <StatCard
            label="AI FORECAST"
            bigNumber="7–9 month"
            gradient="linear-gradient(135deg, #EFE0FF 0%, #E0EEEE 100%)"
            progress={0.65}
          />
        </div>
      </div>
    </div>
  )
}

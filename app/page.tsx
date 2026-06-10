'use client'
/**
 * Biteshift — Lo-fi wireframe prototype (v2)
 *
 * App-level state:
 *   appScreen          — controls pre-auth flow vs main app
 *   userName           — set during onboarding; used in Welcome + Support greeting
 *   cameraArmed        — persists across tab switches
 *   showFaceScan       — face-scan progress overlay (now unlinked: its only
 *                        trigger, the calibration modal, was removed)
 *
 * Screen flow:
 *   Splash (0) → Onboarding (0b) → Welcome (0c) → Main app
 *                                 ↗ (if userName set already)
 */

import { useState } from 'react'
import { defaultToothZone, type ScanHistoryEntry, type ToothZone } from '@/lib/mockData'

// ── Shared ─────────────────────────────────────────────────────────────────────
import PhoneFrame        from '@/app/components/shared/PhoneFrame'
import StatusBar         from '@/app/components/shared/StatusBar'
import TabBar, { Tab }   from '@/app/components/shared/TabBar'

// ── Onboarding ─────────────────────────────────────────────────────────────────
import SplashScreen      from '@/app/components/onboarding/SplashScreen'
import OnboardingScreen  from '@/app/components/onboarding/OnboardingScreen'
import WelcomeScreen     from '@/app/components/onboarding/WelcomeScreen'

// ── Tracking (tab 1) ───────────────────────────────────────────────────────────
import TrackingHome      from '@/app/components/tracking/TrackingHome'
import FaceScanProgress  from '@/app/components/tracking/FaceScanProgress'

// ── Hygiene (tab 2) ────────────────────────────────────────────────────────────
import HygieneHome          from '@/app/components/hygiene/HygieneHome'
import ActiveScanning       from '@/app/components/hygiene/ActiveScanning'
import ScanResult           from '@/app/components/hygiene/ScanResult'
import ToothDetail          from '@/app/components/hygiene/ToothDetail'
import ScanHistory          from '@/app/components/hygiene/ScanHistory'
import HistoricalScanDetail from '@/app/components/hygiene/HistoricalScanDetail'

// ── Camera (tab 3) ─────────────────────────────────────────────────────────────
import CameraScreen from '@/app/components/camera/CameraDisarmed'
import Drafts       from '@/app/components/camera/Drafts'

// ── Support (tab 4) ────────────────────────────────────────────────────────────
import SupportHome          from '@/app/components/support/SupportHome'
import ProfileScreen        from '@/app/components/support/ProfileScreen'
import ChangePasswordScreen from '@/app/components/support/ChangePasswordScreen'
import TbdScreen            from '@/app/components/support/TbdScreen'

// ── Types ──────────────────────────────────────────────────────────────────────

type AppScreen  = 'splash' | 'onboarding' | 'welcome' | 'main'
type HygieneSub = 'home' | 'scanning' | 'result' | 'detail' | 'history' | 'historyDetail'
type CameraSub  = 'home' | 'drafts'
type SupportSub = 'home' | 'profile' | 'changePassword' | 'tbd'

// ── Root component ─────────────────────────────────────────────────────────────

export default function Home() {
  // ── Pre-auth flow state ────────────────────────────────────────────────────
  const [appScreen, setAppScreen] = useState<AppScreen>('splash')
  const [userName,  setUserName]  = useState('')

  // ── Main-app nav state ─────────────────────────────────────────────────────
  const [activeTab,  setActiveTab]  = useState<Tab>('tracking')
  const [hygieneSub, setHygieneSub] = useState<HygieneSub>('home')
  const [cameraSub,  setCameraSub]  = useState<CameraSub>('home')

  // ── Overlay state ──────────────────────────────────────────────────────────
  const [showFaceScan, setShowFaceScan] = useState(false)

  // ── Drafts ─────────────────────────────────────────────────────────────────
  const [draftsCount, setDraftsCount] = useState(6)
  // Draft to open directly in Review (3d) when entering Drafts (null = grid view)
  const [initialDraft, setInitialDraft] = useState<number | null>(null)

  // ── Scan history ────────────────────────────────────────────────────────────
  const [selectedScan, setSelectedScan] = useState<ScanHistoryEntry | null>(null)

  // ── Selected problem zone (2c → 2d): drives Tooth Detail's zoom + copy ───────
  const [selectedZone, setSelectedZone] = useState<ToothZone | null>(null)

  // ── Support sub-navigation ───────────────────────────────────────────────────
  const [supportSub, setSupportSub] = useState<SupportSub>('home')
  const [tbdTitle,   setTbdTitle]   = useState('')

  // ── Pre-auth handlers ──────────────────────────────────────────────────────

  // Splash completes → always go to Onboarding (session-only, no localStorage)
  const handleSplashComplete = () => setAppScreen('onboarding')

  // Onboarding submit → save name, advance to Welcome
  const handleOnboardingSubmit = (name: string) => {
    setUserName(name)
    setAppScreen('welcome')
  }

  // Welcome completes → enter main app
  const handleWelcomeComplete = () => setAppScreen('main')

  // ── Tab switching ──────────────────────────────────────────────────────────
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    if (tab === 'hygiene') setHygieneSub('home')
    if (tab === 'camera')  setCameraSub('home')
    if (tab === 'support') setSupportSub('home')
  }

  // ── Sign out — resets all session state → Splash ───────────────────────────
  const handleSignOut = () => {
    setUserName('')
    setCameraSub('home')
    setActiveTab('tracking')
    setHygieneSub('home')
    setSupportSub('home')
    setShowFaceScan(false)
    setSelectedScan(null)
    setSelectedZone(null)
    setDraftsCount(6)
    setAppScreen('splash')
  }

  // ── Face scan handler ──────────────────────────────────────────────────────
  // Face Scan (1c) is currently unlinked: its only entry point was the calibration
  // modal, which has been removed. The FaceScanProgress screen is kept intact below.
  const handleFaceScanComplete = () => {
    setShowFaceScan(false)
  }

  // ── Tab bar: hidden during active scan, face scan overlay, change password ──
  const showTabBar =
    appScreen === 'main' &&
    !(activeTab === 'hygiene' && hygieneSub === 'scanning') &&
    !(activeTab === 'support' && supportSub === 'changePassword')

  // ── Main screen content ────────────────────────────────────────────────────
  const renderContent = () => {
    // Tab 1 — Tracking
    if (activeTab === 'tracking') {
      return <TrackingHome />
    }

    // Tab 2 — Hygiene
    if (activeTab === 'hygiene') {
      if (hygieneSub === 'home')     return (
        <HygieneHome
          onStartScan={() => setHygieneSub('scanning')}
          onViewHistory={() => setHygieneSub('history')}
        />
      )
      if (hygieneSub === 'scanning') return (
        <ActiveScanning
          onClose={() => setHygieneSub('home')}
          onComplete={() => setHygieneSub('result')}
        />
      )
      if (hygieneSub === 'result')   return (
        <ScanResult
          onBack={() => setHygieneSub('home')}
          onToothDetail={(zone) => { setSelectedZone(zone); setHygieneSub('detail') }}
        />
      )
      if (hygieneSub === 'detail')   return (
        <ToothDetail zone={selectedZone ?? defaultToothZone} onBack={() => setHygieneSub('result')} />
      )
      if (hygieneSub === 'history')  return (
        <ScanHistory
          onBack={() => setHygieneSub('home')}
          onSelectScan={(scan) => { setSelectedScan(scan); setHygieneSub('historyDetail') }}
        />
      )
      if (hygieneSub === 'historyDetail' && selectedScan) return (
        <HistoricalScanDetail
          scan={selectedScan}
          onBack={() => setHygieneSub('history')}
        />
      )
    }

    // Tab 3 — Camera
    if (activeTab === 'camera') {
      if (cameraSub === 'home')   return (
        <CameraScreen
          onViewDrafts={() => { setInitialDraft(null); setCameraSub('drafts') }}
          onOpenDraft={(id) => { setInitialDraft(id); setCameraSub('drafts') }}
        />
      )
      if (cameraSub === 'drafts') return (
        <Drafts
          onBack={() => setCameraSub('home')}
          draftsCount={draftsCount}
          onClearAll={() => setDraftsCount(0)}
          initialDraft={initialDraft}
        />
      )
    }

    // Tab 4 — Support
    if (activeTab === 'support') {
      if (supportSub === 'home') return (
        <SupportHome
          userName={userName}
          onProfile={() => setSupportSub('profile')}
        />
      )
      if (supportSub === 'profile') return (
        <ProfileScreen
          userName={userName}
          onBack={() => setSupportSub('home')}
          onChangePassword={() => setSupportSub('changePassword')}
          onTbd={(title) => { setTbdTitle(title); setSupportSub('tbd') }}
          onSignOut={handleSignOut}
        />
      )
      if (supportSub === 'changePassword') return (
        <ChangePasswordScreen onBack={() => setSupportSub('profile')} />
      )
      if (supportSub === 'tbd') return (
        <TbdScreen title={tbdTitle} onBack={() => setSupportSub('profile')} />
      )
    }

    return null
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <PhoneFrame>
      {/* ── Pre-auth screens (full-bleed, absolute, cover the phone frame) ── */}
      {appScreen === 'splash' && (
        <SplashScreen hasUser={!!userName} onComplete={handleSplashComplete} />
      )}
      {appScreen === 'onboarding' && (
        <OnboardingScreen onSubmit={handleOnboardingSubmit} />
      )}
      {appScreen === 'welcome' && (
        <WelcomeScreen userName={userName} onComplete={handleWelcomeComplete} />
      )}

      {/* ── Main app ── */}
      {appScreen === 'main' && (
        <div className="bs-app-root" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Tracking hero bleeds its pink halo up behind the status bar, so the
              bar is overlaid (transparent) and the scroller fills from the top.
              Every other screen keeps the normal opaque white status bar. */}
          {activeTab === 'tracking' ? (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
              <StatusBar transparent />
            </div>
          ) : (
            <StatusBar />
          )}
          {/* paddingBottom reserves the floating tab bar's footprint so screen
              content keeps the same usable height and never hides behind it.
              On mobile, bs-app-scroll bumps that padding to clear the FIXED bar
              (only when the bar is shown). */}
          <div
            className={showTabBar ? 'bs-app-scroll' : undefined}
            style={{ flex: 1, overflowY: 'auto', paddingBottom: showTabBar ? 72 : 0 }}
          >
            {renderContent()}
          </div>
          {showTabBar && (
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          )}
        </div>
      )}

      {/*
        ── Absolute overlays — rendered on top of everything, z-index 50+.
           position:absolute within PhoneFrame (position:relative).
           NOT position:fixed — stays bounded to the 390×844 frame.
      */}

      {/* Face scan progress (4-second bar) — covers status bar + tab bar.
          Currently unreachable: its trigger (the calibration modal) was removed. */}
      {showFaceScan && (
        <FaceScanProgress onComplete={handleFaceScanComplete} />
      )}
    </PhoneFrame>
  )
}

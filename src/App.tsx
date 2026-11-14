import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import { Sidebar } from '@/components/Sidebar'
import { TopHeader } from '@/components/TopHeader'
import { LiveMonitoring } from '@/pages/LiveMonitoring'
import { CamerasPage } from '@/pages/Cameras'
import { EventsEvidencePage } from '@/pages/EventsEvidence'
import { AnalyticsPage } from '@/pages/Analytics'
import { AlertsPage } from '@/pages/Alerts'
import { SettingsPage } from '@/pages/Settings'
import { Dashboard } from '@/pages/Dashboard'
import { useHealthCheck } from '@/hooks/useHealthCheck'

function AppShell() {
  const { data, status } = useHealthCheck(30_000)
  const backendOnline =
    status === 'idle' || status === 'loading'
      ? null
      : status === 'success' && data?.status === 'healthy'

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 cyber-grid-bg flex">
      {/* ── Fixed Left Cyberpunk Sidebar ─────────────────────────────────── */}
      <Sidebar activeAlertsCount={3} />

      {/* ── Main Content Area (Offset by sidebar width w-64) ─────────────── */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        {/* Top Header Bar */}
        <TopHeader backendOnline={backendOnline} activeAlerts={3} />

        {/* Page Views */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<LiveMonitoring />} />
            <Route path="/live" element={<LiveMonitoring />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cameras" element={<CamerasPage />} />
            <Route path="/events" element={<EventsEvidencePage />} />
            <Route path="/evidence" element={<EventsEvidencePage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/reports" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Check,
  RotateCw,
  CheckCircle2,
} from 'lucide-react'
import {
  type CameraProtocol,
  type CameraStatus,
} from '@/api/client'

// Pre-populated default cameras matching the design image
const INITIAL_CAMERAS: Array<{
  id: number
  name: string
  location: string
  stream_url: string
  type: string
  protocol: CameraProtocol
  status: CameraStatus
  is_active: boolean
  enable_ai: boolean
  enable_alerts: boolean
  thumb: string
}> = [
  {
    id: 1,
    name: 'Main Gate',
    location: 'Main Gate Entrance',
    stream_url: 'rtsp://192.168.1.10/stream',
    type: 'RTSP - 192.168.1.10',
    protocol: 'rtsp',
    status: 'active',
    is_active: true,
    enable_ai: true,
    enable_alerts: true,
    thumb: '/images/main_gate.jpg',
  },
  {
    id: 2,
    name: 'Parking Lot',
    location: 'North Vehicle Area',
    stream_url: 'rtsp://192.168.1.11/stream',
    type: 'RTSP - 192.168.1.11',
    protocol: 'rtsp',
    status: 'active',
    is_active: true,
    enable_ai: true,
    enable_alerts: true,
    thumb: '/images/parking_lot.jpg',
  },
  {
    id: 3,
    name: 'Building Entrance',
    location: 'Lobby Turnstiles',
    stream_url: 'rtsp://192.168.1.12/stream',
    type: 'RTSP - 192.168.1.12',
    protocol: 'rtsp',
    status: 'active',
    is_active: true,
    enable_ai: true,
    enable_alerts: true,
    thumb: '/images/building_entrance.jpg',
  },
  {
    id: 4,
    name: 'Backyard',
    location: 'Perimeter Loading Bay',
    stream_url: 'rtsp://192.168.1.13/stream',
    type: 'RTSP - 192.168.1.13',
    protocol: 'rtsp',
    status: 'error',
    is_active: false,
    enable_ai: false,
    enable_alerts: false,
    thumb: '/images/parking_lot.jpg',
  },
  {
    id: 5,
    name: 'Office',
    location: 'Server Room Corridor',
    stream_url: 'usb://0',
    type: 'Webcam - USB',
    protocol: 'http',
    status: 'active',
    is_active: true,
    enable_ai: true,
    enable_alerts: false,
    thumb: '/images/building_entrance.jpg',
  },
]

export const CamerasPage: React.FC = () => {
  const [cameras, setCameras] = useState(INITIAL_CAMERAS)
  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(1)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Form State
  const [form, setForm] = useState({
    name: 'Main Gate',
    location: 'Main Gate Entrance',
    stream_url: 'rtsp://192.168.1.10/stream',
    protocol: 'RTSP',
    enable_ai: true,
    enable_alerts: true,
  })

  // Whenever selected camera changes, populate form
  useEffect(() => {
    if (selectedCameraId !== null) {
      const cam = cameras.find((c) => c.id === selectedCameraId)
      if (cam) {
        setForm({
          name: cam.name,
          location: cam.location,
          stream_url: cam.stream_url,
          protocol: cam.protocol.toUpperCase(),
          enable_ai: cam.enable_ai,
          enable_alerts: cam.enable_alerts,
        })
      }
    } else {
      // New camera mode
      setForm({
        name: '',
        location: '',
        stream_url: '',
        protocol: 'RTSP',
        enable_ai: true,
        enable_alerts: true,
      })
    }
  }, [selectedCameraId])

  // Toggle active state
  const handleToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCameras((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              is_active: !c.is_active,
              status: !c.is_active ? 'active' : 'inactive',
            }
          : c
      )
    )
  }

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    if (selectedCameraId !== null) {
      // Update existing
      setCameras((prev) =>
        prev.map((c) =>
          c.id === selectedCameraId
            ? {
                ...c,
                name: form.name,
                location: form.location,
                stream_url: form.stream_url,
                protocol: form.protocol.toLowerCase() as CameraProtocol,
                enable_ai: form.enable_ai,
                enable_alerts: form.enable_alerts,
              }
            : c
        )
      )
    } else {
      // Create new
      const newId = Math.max(...cameras.map((c) => c.id), 0) + 1
      const newCam = {
        id: newId,
        name: form.name,
        location: form.location,
        stream_url: form.stream_url,
        type: `${form.protocol} - Stream`,
        protocol: form.protocol.toLowerCase() as CameraProtocol,
        status: 'active' as CameraStatus,
        is_active: true,
        enable_ai: form.enable_ai,
        enable_alerts: form.enable_alerts,
        thumb: '/images/main_gate.jpg',
      }
      setCameras((prev) => [...prev, newCam])
      setSelectedCameraId(newId)
    }

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  // Test connection simulation
  const handleTestConnection = () => {
    setIsTesting(true)
    setTestResult(null)
    setTimeout(() => {
      setIsTesting(false)
      setTestResult('Stream reachable: 1920x1080 @ 25fps • Latency 38ms')
      setTimeout(() => setTestResult(null), 4000)
    }, 1200)
  }

  return (
    <div className="p-6">
      {/* ── Two-Column Layout (Matching bottom-left screen) ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Column: Camera Management (col-span-6 or 7) ─────────────── */}
        <div className="lg:col-span-6 space-y-4">
          <div className="cyber-panel p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
              <h2 className="text-base font-extrabold text-white tracking-wider flex items-center gap-2">
                Camera Management
              </h2>
              <button
                onClick={() => setSelectedCameraId(null)}
                className="btn-cyber-primary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus size={15} />
                Add Camera
              </button>
            </div>

            {/* List of Cameras */}
            <div className="space-y-3">
              {cameras.map((cam) => {
                const isSelected = cam.id === selectedCameraId
                const isOnline = cam.status === 'active' && cam.is_active

                return (
                  <div
                    key={cam.id}
                    onClick={() => setSelectedCameraId(cam.id)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-950/80 to-slate-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                        : 'bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Mini Thumbnail */}
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-black">
                        <img
                          src={cam.thumb}
                          alt={cam.name}
                          className="w-full h-full object-cover"
                        />
                        {!isOnline && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white tracking-wide truncate">
                          {cam.name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {cam.type}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Status Pill */}
                      <span
                        className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isOnline
                            ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-400'
                            : 'bg-red-950/70 border border-red-500/40 text-red-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                          }`}
                        />
                        {isOnline ? 'Online' : 'Disconnected'}
                      </span>

                      {/* Interactive Cyber Toggle Switch */}
                      <div
                        onClick={(e) => handleToggle(cam.id, e)}
                        className={`cyber-switch ${cam.is_active ? 'active' : ''}`}
                        title={cam.is_active ? 'Deactivate stream' : 'Activate stream'}
                      >
                        <div className="cyber-switch-thumb" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Right Column: Add / Edit Camera (col-span-6 or 5) ───────────── */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSave} className="cyber-panel p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
              <h2 className="text-base font-extrabold text-white tracking-wider">
                {selectedCameraId !== null ? 'Add / Edit Camera' : 'Add New Camera'}
              </h2>
              {selectedCameraId !== null && (
                <span className="text-xs font-mono text-cyan-400">
                  ID: #{selectedCameraId}
                </span>
              )}
            </div>

            {/* Field: Camera Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Camera Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Main Gate"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/25 text-white text-sm outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>

            {/* Field: Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Main Gate Entrance"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/25 text-white text-sm outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Field: Stream URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Stream URL
              </label>
              <input
                type="text"
                value={form.stream_url}
                onChange={(e) => setForm({ ...form, stream_url: e.target.value })}
                placeholder="rtsp://192.168.1.10/stream"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/25 text-cyan-300 font-mono text-xs outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>

            {/* Field: Camera Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Camera Type
              </label>
              <select
                value={form.protocol}
                onChange={(e) => setForm({ ...form, protocol: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/25 text-white text-sm outline-none focus:border-cyan-400 transition-colors cursor-pointer"
              >
                <option value="RTSP">RTSP</option>
                <option value="RTMP">RTMP</option>
                <option value="HTTP">HTTP / HLS</option>
                <option value="HTTPS">HTTPS</option>
                <option value="USB">Webcam / USB</option>
                <option value="FILE">File Stream</option>
              </select>
            </div>

            {/* Toggles: Enable AI Detection & Enable Alerts */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    Enable AI Detection
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Real-time YOLOv8 object & anomaly classification
                  </div>
                </div>
                <div
                  onClick={() => setForm({ ...form, enable_ai: !form.enable_ai })}
                  className={`cyber-switch ${form.enable_ai ? 'active' : ''}`}
                >
                  <div className="cyber-switch-thumb" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    Enable Alerts
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Trigger sirens, notifications, and incident logging
                  </div>
                </div>
                <div
                  onClick={() => setForm({ ...form, enable_alerts: !form.enable_alerts })}
                  className={`cyber-switch ${form.enable_alerts ? 'active' : ''}`}
                >
                  <div className="cyber-switch-thumb" />
                </div>
              </div>
            </div>

            {/* Test Connection Banner */}
            {testResult && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 size={16} />
                {testResult}
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 size={16} />
                Camera configuration saved successfully!
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex-1 py-2.5 px-4 rounded-xl btn-cyber-secondary flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              >
                <RotateCw size={14} className={isTesting ? 'animate-spin' : ''} />
                {isTesting ? 'Connecting...' : 'Test Connection'}
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl btn-cyber-primary flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              >
                <Check size={14} />
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

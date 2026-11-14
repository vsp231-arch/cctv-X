import React, { useState } from 'react'
import {
  Search,
  Calendar,
  AlertTriangle,
  Zap,
  Clock,
  User,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  FileText,
  Copy,
  Check,
} from 'lucide-react'
import { ForensicModal } from '@/components/ForensicModal'

interface EvidenceItem {
  id: string
  type: string
  category: 'Restricted Zone' | 'Line Crossing' | 'Loitering' | 'Person Detected'
  camera: string
  time: string
  date: string
  status: 'Verified' | 'Pending'
  sha256: string
  thumb: string
  fileName: string
  fileSize: string
  duration: string
  resolution: string
  fps: number
  cameraId: string
}

const EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'EVT-20250426-001',
    type: 'Restricted Zone Intrusion',
    category: 'Restricted Zone',
    camera: 'Main Gate',
    time: '14:32:12',
    date: '26 Apr 2025',
    status: 'Verified',
    sha256: 'a3f5e2d9c36b0000de06e0018301ec9f4b9a8264901ba32c38df1094ba4b9f4b',
    thumb: '/images/main_gate.jpg',
    fileName: 'evidence_001.mp4',
    fileSize: '12.4 MB',
    duration: '00:00:10',
    resolution: '1920 × 1080',
    fps: 25,
    cameraId: 'CAM-001',
  },
  {
    id: 'EVT-20250426-002',
    type: 'Line Crossing',
    category: 'Line Crossing',
    camera: 'Parking Lot',
    time: '14:28:45',
    date: '26 Apr 2025',
    status: 'Verified',
    sha256: '7b82cd59114ac3992b490a07e15d8615438be558c44bb4f5904948a31945f7c1',
    thumb: '/images/parking_lot.jpg',
    fileName: 'evidence_002.mp4',
    fileSize: '9.8 MB',
    duration: '00:00:08',
    resolution: '1920 × 1080',
    fps: 25,
    cameraId: 'CAM-002',
  },
  {
    id: 'EVT-20250426-003',
    type: 'Loitering',
    category: 'Loitering',
    camera: 'Building Entrance',
    time: '14:25:30',
    date: '26 Apr 2025',
    status: 'Verified',
    sha256: 'd92a4726e63c0a4b7c3d2f9e4a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
    thumb: '/images/building_entrance.jpg',
    fileName: 'evidence_003.mp4',
    fileSize: '15.1 MB',
    duration: '00:00:15',
    resolution: '1920 × 1080',
    fps: 25,
    cameraId: 'CAM-003',
  },
  {
    id: 'EVT-20250426-004',
    type: 'Person Detected',
    category: 'Person Detected',
    camera: 'Main Gate',
    time: '14:20:14',
    date: '26 Apr 2025',
    status: 'Verified',
    sha256: 'f4b1c2d3e4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
    thumb: '/images/main_gate.jpg',
    fileName: 'evidence_004.mp4',
    fileSize: '8.3 MB',
    duration: '00:00:06',
    resolution: '1920 × 1080',
    fps: 25,
    cameraId: 'CAM-001',
  },
  {
    id: 'EVT-20250426-005',
    type: 'Restricted Zone Intrusion',
    category: 'Restricted Zone',
    camera: 'Main Gate',
    time: '13:56:02',
    date: '26 Apr 2025',
    status: 'Pending',
    sha256: '9c8b7a6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8b7a6d5e4f3a2b1c0d9e8f',
    thumb: '/images/main_gate.jpg',
    fileName: 'evidence_005.mp4',
    fileSize: '11.2 MB',
    duration: '00:00:10',
    resolution: '1920 × 1080',
    fps: 25,
    cameraId: 'CAM-001',
  },
]

export const EventsEvidencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Events' | 'Alerts' | 'Evidence'>('Evidence')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All Event Types')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [selectedItem, setSelectedItem] = useState<EvidenceItem>(EVIDENCE_ITEMS[0])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copiedHash, setCopiedHash] = useState(false)

  // Filter items
  const filteredItems = EVIDENCE_ITEMS.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.camera.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType =
      selectedType === 'All Event Types' || item.category === selectedType
    const matchesStatus =
      selectedStatus === 'All Statuses' || item.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleCopyHash = () => {
    navigator.clipboard.writeText(selectedItem.sha256)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* ── Top Tabs (Events | Alerts | Evidence) ─────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-3">
        {(['Events', 'Alerts', 'Evidence'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] border border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────────────── */}
      <div className="cyber-panel p-3.5 flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search evidence..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-white text-xs outline-none focus:border-cyan-400 font-medium"
          />
        </div>

        {/* Event Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs outline-none focus:border-cyan-400 cursor-pointer"
        >
          <option value="All Event Types">All Event Types</option>
          <option value="Restricted Zone">Restricted Zone</option>
          <option value="Line Crossing">Line Crossing</option>
          <option value="Loitering">Loitering</option>
          <option value="Person Detected">Person Detected</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs outline-none focus:border-cyan-400 cursor-pointer"
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Verified">Verified</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Date Picker Button */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 text-xs font-mono">
          <Calendar size={13} className="text-cyan-400" />
          <span>Apr 26, 2025</span>
        </div>
      </div>

      {/* ── Split Layout: Table (Left) + Evidence Details (Right) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ── Table (Left) ─────────────────────────────────────────── */}
        <div className="lg:col-span-7 2xl:col-span-8 cyber-panel p-4 overflow-hidden space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cyan-500/15 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-3">Evidence ID</th>
                  <th className="pb-3">Event Type</th>
                  <th className="pb-3">Camera</th>
                  <th className="pb-3">Capture Time</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredItems.map((item) => {
                  const isSelected = item.id === selectedItem.id

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-950/60 text-white'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="py-3.5 pl-3 font-mono font-semibold text-cyan-300">
                        {item.id}
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`flex items-center gap-1.5 font-bold ${
                            item.category === 'Restricted Zone'
                              ? 'text-red-400'
                              : item.category === 'Line Crossing'
                              ? 'text-amber-400'
                              : item.category === 'Loitering'
                              ? 'text-emerald-400'
                              : 'text-cyan-400'
                          }`}
                        >
                          {item.category === 'Restricted Zone' && <AlertTriangle size={13} />}
                          {item.category === 'Line Crossing' && <Zap size={13} />}
                          {item.category === 'Loitering' && <Clock size={13} />}
                          {item.category === 'Person Detected' && <User size={13} />}
                          {item.type}
                        </span>
                      </td>

                      <td className="py-3.5 text-slate-200">{item.camera}</td>

                      <td className="py-3.5 font-mono text-slate-400">{item.time}</td>

                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Verified'
                              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-400'
                              : 'bg-amber-950/70 border border-amber-500/40 text-amber-400'
                          }`}
                        >
                          {item.status === 'Verified' ? (
                            <>
                              <CheckCircle2 size={11} /> Verified
                            </>
                          ) : (
                            <>
                              <Clock3 size={11} /> Pending
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 pr-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedItem(item)
                            setIsModalOpen(true)
                          }}
                          className="btn-cyber-primary px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Evidence Details (Right) ─────────────────────────────── */}
        <div className="lg:col-span-5 2xl:col-span-4 cyber-panel p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
            <h3 className="text-base font-extrabold text-white tracking-wider">
              Evidence Details
            </h3>
            <span className="font-mono text-xs text-cyan-400 font-bold">
              {selectedItem.id}
            </span>
          </div>

          {/* Video Snapshot with Red Box */}
          <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-black aspect-video select-none">
            <img
              src={selectedItem.thumb}
              alt={selectedItem.type}
              className="w-full h-full object-cover"
            />

            {/* Bounding Box overlay */}
            <div
              className="absolute border-2 border-red-500 bg-red-500/20 rounded"
              style={{
                top: '32%',
                left: '38%',
                width: '18%',
                height: '42%',
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)',
              }}
            >
              <span className="absolute -top-5 left-0 px-1 py-0.2 text-[9px] font-bold bg-red-600 text-white rounded">
                person 0.92
              </span>
            </div>
          </div>

          {/* Info Block */}
          <div className="space-y-2">
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-red-400" />
              {selectedItem.type}
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>{selectedItem.camera}</span>
              <span className="font-mono">{selectedItem.time} | {selectedItem.date}</span>
            </div>
          </div>

          {/* SHA-256 Hash */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>SHA-256 HASH</span>
              <button
                onClick={handleCopyHash}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[10px] cursor-pointer"
              >
                {copiedHash ? <Check size={12} /> : <Copy size={12} />}
                {copiedHash ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="font-mono text-[10px] text-cyan-300 break-all leading-relaxed">
              {selectedItem.sha256}
            </div>
          </div>

          {/* Status Display */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-xs text-slate-300 font-medium">Verification Status:</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Verified Integrity
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-2.5 px-3 rounded-xl btn-cyber-primary flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
            >
              <ShieldCheck size={15} />
              Verify Hash
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-2.5 px-3 rounded-xl btn-cyber-secondary flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
            >
              <FileText size={15} />
              View Audit Log
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal Pop-up ─────────────────────────────────────────────────── */}
      <ForensicModal
        evidence={
          isModalOpen
            ? {
                id: selectedItem.id,
                title: selectedItem.type,
                camera: selectedItem.camera,
                timestamp: selectedItem.time,
                date: selectedItem.date,
                fileName: selectedItem.fileName,
                fileSize: selectedItem.fileSize,
                duration: selectedItem.duration,
                resolution: selectedItem.resolution,
                fps: selectedItem.fps,
                cameraId: selectedItem.cameraId,
                sha256: selectedItem.sha256,
                status: selectedItem.status,
                imageUrl: selectedItem.thumb,
                hasBoundingBox: true,
              }
            : null
        }
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  RefreshCw, 
  Clock, 
  History,
  Trash2,
  Building2,
  Wrench,
  Eye,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TicketData } from '../../types';

const STORAGE_TICKETS_KEY = 'eos_dashboard_ticket_history';

const INITIAL_TICKET: TicketData = {
  ticketNumber: 'INCD2026' + Math.floor(1000 + Math.random() * 9000),
  serviceId: '122' + Math.floor(1000000 + Math.random() * 9000000),
  customerName: 'PT. Bank Mandiri (Persero) Tbk - Cabang Utama',
  productType: 'Astinet Clean (Direct Internet)',
  bandwidth: '100 Mbps',
  segmentGangguan: 'Akses Optik / Lastmile (Kabel Dropcore / Roset)',
  waktuDown: new Date(Date.now() - 3600000).toISOString().slice(0, 16),
  waktuUp: new Date().toISOString().slice(0, 16),
  picCustomer: 'Bpk. Ahmad (IT Head)',
  kontakPic: '0812-3456-7890',
  lokasiAlamat: 'Gedung Wisma Telkom Lt. 5, Jl. Gatot Subroto No. 52',
  gejalaGangguan: 'Link Total Down (LOS Merah pada ONT GPON)',
  rootCause: 'Bending kabel patchcord SC-UPC pada Roset optik ruang server',
  actionTaken: 'Re-terminasi dan penggantian patchcord optik SC-UPC ke ONT. Redaman optik normal kembali di -19.4 dBm.',
  status: 'RESOLVED',
  petugasEOS: 'EOS Datin Telkom (Team Alfa)',
  witel: 'Witel Jakarta Barat / ROC 2'
};

export const TicketGenerator: React.FC = () => {
  const [ticket, setTicket] = useState<TicketData>(INITIAL_TICKET);
  const [activeTemplate, setActiveTemplate] = useState<'resolved' | 'update' | 'open' | 'bap'>('resolved');
  const [previewMode, setPreviewMode] = useState<'card' | 'raw'>('card');
  const [copied, setCopied] = useState(false);
  const [ticketHistory, setTicketHistory] = useState<TicketData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TICKETS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(ticketHistory));
    } catch (e) {}
  }, [ticketHistory]);

  const formatDateTime = (dtStr?: string) => {
    if (!dtStr) return '-';
    const d = new Date(dtStr);
    return isNaN(d.getTime()) ? dtStr : d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  };

  // Generate clean WhatsApp broadcast string
  const broadcastText = useMemo((): string => {
    if (activeTemplate === 'open') {
      return `[LAPORAN AWAL GANGGUAN LINK]
------------------------------------
• No. Tiket   : ${ticket.ticketNumber}
• Pelanggan   : ${ticket.customerName}
• SID / CID   : ${ticket.serviceId}
• Layanan     : ${ticket.productType} (${ticket.bandwidth})
• Lokasi      : ${ticket.lokasiAlamat}
• PIC Customer: ${ticket.picCustomer} (${ticket.kontakPic})
------------------------------------
• Waktu Down  : ${formatDateTime(ticket.waktuDown)} WIB
• Gejala      : ${ticket.gejalaGangguan}
• Segment     : ${ticket.segmentGangguan}
• Status      : ${ticket.status}
• Petugas EOS : ${ticket.petugasEOS} (${ticket.witel})
------------------------------------
Mohon bantuan ROC / Helpdesk Datin untuk verifikasi link.`;
    }

    if (activeTemplate === 'update') {
      return `[UPDATE PROGRESS PENANGANAN EOS]
------------------------------------
• No. Tiket   : ${ticket.ticketNumber}
• Pelanggan   : ${ticket.customerName} (SID: ${ticket.serviceId})
• Layanan     : ${ticket.productType}
• Waktu Down  : ${formatDateTime(ticket.waktuDown)} WIB
------------------------------------
• Tindakan    : ${ticket.actionTaken}
• Root Cause  : ${ticket.rootCause}
• Status      : ${ticket.status}
• Petugas     : ${ticket.petugasEOS}
------------------------------------
Sedang dalam proses penanganan di lokasi pelanggan.`;
    }

    if (activeTemplate === 'resolved') {
      return `[LAPORAN GANGGUAN LINK CLEAR / NORMAL]
------------------------------------
• No. Tiket   : ${ticket.ticketNumber}
• Pelanggan   : ${ticket.customerName}
• SID / CID   : ${ticket.serviceId}
• Layanan     : ${ticket.productType} (${ticket.bandwidth})
• Lokasi      : ${ticket.lokasiAlamat}
------------------------------------
• Waktu Down  : ${formatDateTime(ticket.waktuDown)} WIB
• Waktu Up    : ${formatDateTime(ticket.waktuUp)} WIB
• Gejala      : ${ticket.gejalaGangguan}
• Root Cause  : ${ticket.rootCause}
• Tindakan    : ${ticket.actionTaken}
------------------------------------
• Status Link : CLEAR & MONITORING (NORMAL)
• Konfirmasi  : Bpk/Ibu ${ticket.picCustomer} (Koneksi OK)
• Petugas EOS : ${ticket.petugasEOS} (${ticket.witel})`;
    }

    // BAP Template
    return `BERITA ACARA PEKERJAAN (BAP) / UJI TERIMA EOS
==================================================
1. DATA PELANGGAN & LAYANAN:
   • Nama Pelanggan : ${ticket.customerName}
   • Service ID (SID) : ${ticket.serviceId}
   • Jenis Layanan : ${ticket.productType}
   • Kapasitas : ${ticket.bandwidth}
   • Alamat Site : ${ticket.lokasiAlamat}

2. DETAIL PENANGANAN:
   • Waktu Gangguan : ${formatDateTime(ticket.waktuDown)} s/d ${formatDateTime(ticket.waktuUp)} WIB
   • Masalah : ${ticket.rootCause}
   • Tindakan : ${ticket.actionTaken}

3. HASIL PENGUJIAN:
   • Status : UP & Stabil (0% Packet Loss)
   • Pengujian : Sesuai SLA
   • Verifikasi : Bpk/Ibu ${ticket.picCustomer}

Petugas EOS Telkom:
${ticket.petugasEOS} - ${ticket.witel}
==================================================`;
  }, [ticket, activeTemplate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(broadcastText);
    setCopied(true);

    // Save to history
    setTicketHistory((prev) => [
      { ...ticket, ticketNumber: ticket.ticketNumber + ' (' + activeTemplate.toUpperCase() + ')' },
      ...prev.filter((t) => t.ticketNumber !== ticket.ticketNumber).slice(0, 19),
    ]);

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
      });
    } catch (e) {}

    setTimeout(() => setCopied(false), 2000);
  };

  const setTimeNow = (field: 'waktuDown' | 'waktuUp') => {
    setTicket(prev => ({ ...prev, [field]: new Date().toISOString().slice(0, 16) }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">RESOLVED / CLEAR</span>;
      case 'PROGRESS':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">PROGRESS ON-SITE</span>;
      case 'MONITORING':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">MONITORING</span>;
      case 'PENDING_VENDOR':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">PENDING JARLIT / VENDOR</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">OPEN / GANGGUAN</span>;
    }
  };

  return (
    <div className="space-y-5 text-left">
      
      {/* Top Banner */}
      <div className="p-4 rounded-lg bg-white border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            Ticket & Laporan
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Formulir tiket gangguan dengan format broadcast WhatsApp
          </p>
        </div>

        {/* Template Selector Pills */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setActiveTemplate('open')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTemplate === 'open'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Laporan Open
          </button>
          <button
            onClick={() => setActiveTemplate('update')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTemplate === 'update'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Update Progress
          </button>
          <button
            onClick={() => setActiveTemplate('resolved')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTemplate === 'resolved'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Resolved / Clear
          </button>
          <button
            onClick={() => setActiveTemplate('bap')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTemplate === 'bap'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Format BAP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Form Input (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Section 1: Pelanggan & Layanan */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                1. Data Pelanggan & Layanan
              </h3>
              <button
                onClick={() => setTicket(INITIAL_TICKET)}
                className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
                title="Reset ke data contoh"
              >
                <RefreshCw className="w-3 h-3" /> Reset Contoh
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">No. Tiket (INCD / INC)</label>
                <input
                  type="text"
                  value={ticket.ticketNumber}
                  onChange={(e) => setTicket({ ...ticket, ticketNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Service ID (SID / CID)</label>
                <input
                  type="text"
                  value={ticket.serviceId}
                  onChange={(e) => setTicket({ ...ticket, serviceId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Perusahaan / Pelanggan</label>
                <input
                  type="text"
                  value={ticket.customerName}
                  onChange={(e) => setTicket({ ...ticket, customerName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Produk Layanan</label>
                <select
                  value={ticket.productType}
                  onChange={(e) => setTicket({ ...ticket, productType: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                >
                  <option value="Astinet Clean (Direct Internet)">Astinet Clean (Dedicated)</option>
                  <option value="Astinet Lite / Direct">Astinet Lite</option>
                  <option value="VPN IP (MPLS L3VPN)">VPN IP / MPLS</option>
                  <option value="Metro Ethernet (L2VPN)">Metro Ethernet</option>
                  <option value="IndiBiz / HSI Enterprise">IndiBiz SME</option>
                  <option value="WMS (Wifi Managed Service)">WMS / Enterprise Wi-Fi</option>
                  <option value="SIP Trunk / Voice Corporate">SIP Trunk IP PBX</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Bandwidth Paket</label>
                <input
                  type="text"
                  value={ticket.bandwidth}
                  onChange={(e) => setTicket({ ...ticket, bandwidth: e.target.value })}
                  placeholder="Contoh: 100 Mbps"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Waktu, Lokasi & PIC */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                2. Waktu, Lokasi & Kontak PIC
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-700">Waktu Mulai Gangguan (Down)</label>
                  <button
                    type="button"
                    onClick={() => setTimeNow('waktuDown')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Set Sekarang
                  </button>
                </div>
                <input
                  type="datetime-local"
                  value={ticket.waktuDown}
                  onChange={(e) => setTicket({ ...ticket, waktuDown: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-700">Waktu Selesai (Up / Normal)</label>
                  <button
                    type="button"
                    onClick={() => setTimeNow('waktuUp')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Set Sekarang
                  </button>
                </div>
                <input
                  type="datetime-local"
                  value={ticket.waktuUp}
                  onChange={(e) => setTicket({ ...ticket, waktuUp: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama PIC Customer</label>
                <input
                  type="text"
                  value={ticket.picCustomer}
                  onChange={(e) => setTicket({ ...ticket, picCustomer: e.target.value })}
                  placeholder="Nama PIC di lokasi"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">No. WhatsApp / HP PIC</label>
                <input
                  type="text"
                  value={ticket.kontakPic}
                  onChange={(e) => setTicket({ ...ticket, kontakPic: e.target.value })}
                  placeholder="0812-xxxx"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Alamat Site / Lokasi Pelanggan</label>
                <input
                  type="text"
                  value={ticket.lokasiAlamat}
                  onChange={(e) => setTicket({ ...ticket, lokasiAlamat: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Diagnosa & Tindakan Teknis */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gray-500" />
                3. Diagnosa, Tindakan & Status
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Segmen Gangguan</label>
                <select
                  value={ticket.segmentGangguan}
                  onChange={(e) => setTicket({ ...ticket, segmentGangguan: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                >
                  <option value="Akses Optik / Lastmile (Kabel Dropcore / Roset / ODP)">Akses Optik / Lastmile (Dropcore / Roset / ODP)</option>
                  <option value="CPE Router MikroTik / Modem ONT Pelanggan">CPE Router MikroTik / Modem ONT Pelanggan</option>
                  <option value="Perangkat Switch Metro-E / GPON OLT Telkom">Perangkat Switch Metro-E / GPON OLT Telkom</option>
                  <option value="Backbone IP Core / PE Router Telkom">Backbone IP Core / PE Router Telkom</option>
                  <option value="Infrastruktur Internal / LAN Pelanggan">Infrastruktur Internal / LAN Pelanggan</option>
                  <option value="Power Suplai / PLN Padam di Lokasi">Power Suplai / PLN Padam di Lokasi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Gejala Gangguan yang Dilaporkan</label>
                <input
                  type="text"
                  value={ticket.gejalaGangguan}
                  onChange={(e) => setTicket({ ...ticket, gejalaGangguan: e.target.value })}
                  placeholder="Contoh: Link Total Down / LOS Merah / Flapping"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Root Cause (Penyebab Masalah Sebenarnya)</label>
                <textarea
                  rows={2}
                  value={ticket.rootCause}
                  onChange={(e) => setTicket({ ...ticket, rootCause: e.target.value })}
                  placeholder="Penyebab teknis hasil investigasi di site..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Action Taken (Tindakan Perbaikan yang Dilakukan)</label>
                <textarea
                  rows={2}
                  value={ticket.actionTaken}
                  onChange={(e) => setTicket({ ...ticket, actionTaken: e.target.value })}
                  placeholder="Langkah perbaikan teknis yang sudah dilakukan..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status Link Saat Ini</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => setTicket({ ...ticket, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="OPEN">OPEN / GANGGUAN</option>
                    <option value="PROGRESS">PROGRESS ON-SITE</option>
                    <option value="MONITORING">MONITORING</option>
                    <option value="RESOLVED">RESOLVED / CLEAR</option>
                    <option value="PENDING_VENDOR">PENDING VENDOR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Petugas EOS Pelaksana</label>
                  <input
                    type="text"
                    value={ticket.petugasEOS}
                    onChange={(e) => setTicket({ ...ticket, petugasEOS: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Witel / Regional ROC</label>
                  <input
                    type="text"
                    value={ticket.witel}
                    onChange={(e) => setTicket({ ...ticket, witel: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Clean Visual Card Preview & WhatsApp Copy (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            
            {/* Preview Mode Switcher */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode('card')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    previewMode === 'card' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Format Kartu
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('raw')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    previewMode === 'raw' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Format Teks WA
                </button>
              </div>

              {getStatusBadge(ticket.status)}
            </div>

            {/* Visual Card View */}
            {previewMode === 'card' ? (
              <div className="space-y-4 text-sm text-gray-700">
                
                {/* Header */}
                <div className="flex flex-col gap-1 border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-gray-900">{ticket.customerName}</h4>
                  <p className="text-xs text-gray-500">SID: {ticket.serviceId} | Tiket: {ticket.ticketNumber}</p>
                </div>

                {/* Details Table */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500">Layanan:</span>
                    <span className="font-medium text-gray-900">{ticket.productType}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500">Kapasitas:</span>
                    <span className="font-medium text-gray-900">{ticket.bandwidth}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500">Segment:</span>
                    <span className="text-gray-900 text-right">{ticket.segmentGangguan}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500">Waktu Down:</span>
                    <span className="text-gray-900">{formatDateTime(ticket.waktuDown)} WIB</span>
                  </div>
                  {activeTemplate !== 'open' && (
                    <div className="flex items-start justify-between">
                      <span className="text-gray-500">Waktu Up:</span>
                      <span className="text-gray-900">{formatDateTime(ticket.waktuUp)} WIB</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500">PIC Customer:</span>
                    <span className="text-gray-900">{ticket.picCustomer} ({ticket.kontakPic})</span>
                  </div>
                </div>

                {/* Root Cause & Action Box */}
                <div className="pl-3 border-l-2 border-red-600 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-gray-900 block">Penyebab (Root Cause):</span>
                    <p className="text-gray-700 text-sm mt-1">{ticket.rootCause || '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-900 block">Tindakan Perbaikan:</span>
                    <p className="text-gray-700 text-sm mt-1">{ticket.actionTaken || '-'}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 flex items-center justify-between border-t border-gray-200 pt-3">
                  <span>Petugas: <strong className="text-gray-900 font-medium">{ticket.petugasEOS}</strong></span>
                  <span>{ticket.witel}</span>
                </div>
              </div>
            ) : (
              /* Raw WhatsApp Text Preview */
              <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                {broadcastText}
              </div>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Disalin ke Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Format Broadcast</span>
                </>
              )}
            </button>
          </div>

          {/* Ticket History */}
          {ticketHistory.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-gray-500" />
                  Riwayat Tiket ({ticketHistory.length})
                </span>
                <button
                  onClick={() => {
                    if (window.confirm('Hapus seluruh riwayat tiket?')) setTicketHistory([]);
                  }}
                  className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {ticketHistory.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTicket(item)}
                    className="w-full text-left p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm flex flex-col gap-1 text-gray-700 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{item.ticketNumber}</span>
                    <span className="text-xs text-gray-500 truncate">{item.customerName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

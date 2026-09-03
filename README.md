# 🚀 EOS Command Center - Enterprise Operations & Network Dashboard

Aplikasi dashboard modern, ringan, dan lengkap yang dirancang khusus untuk membantu pekerjaan harian **EOS (Enterprise Operation Specialist) Telkom Indonesia** dalam menangani link enterprise (Astinet, VPN IP, Metro Ethernet, IndiBiz, WMS, SIP Trunk), diagnosa jaringan, pemahaman IP & Routing, serta AI Copilot multimodal gratis.

---

## 🌟 Fitur Utama

### 1. 🤖 AI Network Copilot (Multimodal & Free Tier)
* **Vision Diagnostic**: Upload foto langsung dari lapangan (lampu indikator ONT ZTE/Huawei, foto OTB/Roset, konektor patchcord SC-UPC/APC, screenshot grafik MRTG/PRTG, diagram topologi).
* **CLI & Log Analyzer**: Tempel log error terminal MikroTik / RouterOS untuk diagnosa cepat.
* **Script Config Generator**: Buat script konfigurasi BGP, VLAN, NAT, Simple Queue, Hotspot WMS.
* **Pilihan Provider Free AI**:
  * **Google Gemini API (Free Tier)**: Multimodal penuh (teks + gambar/PDF) dari [Google AI Studio](https://aistudio.google.com/app/apikey).
  * **Groq Cloud API (Free Tier)**: Ultra-cepat model Llama 3.3 70B dari [Groq Console](https://console.groq.com/keys).

### 2. 📝 Smart Incident & Broadcast Generator (Format Standar Telkom)
* Input terstruktur tiket gangguan (No Tiket INCD, SID/CID, Pelanggan, Produk, Segmen, Root Cause, Action Taken).
* **1-Click Copy ke WhatsApp / Telegram**:
  * 🔴 *Laporan Awal Gangguan (Open Ticket)*
  * 🟡 *Update Progress Penanganan Lapangan*
  * 🟢 *Laporan Resolved / Clear Link (Normal)*
  * 📄 *Format Berita Acara Pekerjaan (BAP) / Uji Terima EOS*
* Riwayat tiket tersimpan otomatis di browser (`LocalStorage`).

### 3. 🌐 IP Config & Routing Master Guide
* **Pemahaman IP Publik vs Privat (RFC 1918)**.
* **Skema Alokasi Standar Telkom**:
  * Subnet Point-to-Point WAN `/30` (PE Telkom vs CE MikroTik).
  * Subnet Blok LAN IP Publik `/29` (5 Host), `/28` (13 Host), `/27` (29 Host).
* **Panduan Konfigurasi MikroTik**:
  * Setup IP Address, Default Gateway `0.0.0.0/0`, DNS Telkom & Public.
  * NAT Masquerade (Internet) & Port Forwarding DST-NAT (Server & CCTV).
  * DHCP Server & Pool untuk WMS / Hotspot tamu.
* **Troubleshooting IP Lapangan**: IP Conflict, Dead Gateway, Asymmetric Routing, dan MTU/MSS Clamping.

### 4. 🛠️ Interactive Network Calculators (Zero Latency)
* **Optical Power (dBm) Health Gauge**: Meter visual redaman optik (-8 s/d -24 dBm normal, -25 s/d -27 dBm waspada, < -28 dBm high loss/putus).
* **Enterprise Subnet & CIDR Visualizer**: Kalkulasi instan Network, Broadcast, Gateway, Usable Range, Wildcard mask beserta script MikroTik.
* **Bandwidth & Simple Queue Generator**: Konversi throughput (Mbps <-> MB/s <-> GB/jam) dan generator rule Simple Queue / Fix MTU MSS Clamping.

### 5. 📚 Katalog Layanan Enterprise Telkom
* Spesifikasi teknis, SLA target (99.5%), MTTR, alokasi IP, topologi standar, dan konfigurasi:
  * **Astinet Clean & Lite**
  * **VPN IP / MPLS (L3VPN)**
  * **Metro Ethernet (L2VPN E-Line/E-LAN)**
  * **WMS (Wifi Managed Service)**
  * **SIP Trunk / Voice Corporate**
  * **IndiBiz SME**

### 6. 📟 Hardware & Field Device Matrix
* **Modem / ONT Telkom**: ZTE (F609, F670L), Huawei (HG8245H5, HG8245W5), Fiberhome (AN5506) — panduan Bridge Mode, cek redaman via Web GUI, arti LED (LOS merah, PON blinking).
* **Router CPE**: MikroTik RouterOS (CCR, RB series, Hex S).
* **Access Point & WMS**: Ruijie Reyee Cloud, Ubiquiti UniFi, TP-Link Omada.
* **Fisik & Optik**: OTB, Roset, perbedaan konektor SC-UPC (Biru) vs SC-APC (Hijau), SFP BiDi TX1310/RX1550 vs TX1550/RX1310, Media Converter.

### 7. 🌳 Interactive Troubleshooting Decision Tree
* SOP alur diagnosa bertahap dari Layer 1 sampai Layer 7:
  * *Total Down / LOS Merah*
  * *Intermittent / Flapping*
  * *High Latency & Bandwidth Drop*
  * *WMS & AP Offline / DHCP Exhaustion*
  * *SIP Trunk One-Way Audio / Call Drop*

### 8. 💻 MikroTik & Field CLI Cheat Sheet
* Kumpulan perintah penting: `/tool torch`, `/interface monitor-traffic`, `/interface ethernet cable-test`, `/log print`, `/ip route print detail`, `/routing bgp session print`, BGP peering script, VLAN trunking, dan PCQ equal bandwidth divider.

---

## 💻 Cara Menjalankan Aplikasi

1. Buka folder projek di terminal atau jalankan `npm run dev`:
   ```bash
   npm run dev
   ```
2. Buka browser di alamat:
   ```
   http://localhost:5173
   ```
3. Klik tombol **Pengaturan AI** di pojok kanan atas untuk memasukkan API Key gratis Google Gemini atau Groq.

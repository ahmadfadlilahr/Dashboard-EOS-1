import { TelkomProduct } from '../types';

export const TELKOM_PRODUCTS: TelkomProduct[] = [
  {
    id: 'astinet-clean',
    name: 'Astinet Clean (Direct Internet)',
    category: 'Internet',
    description: 'Layanan akses internet global & domestik 1:1 simetris (dedicated bandwidth) tanpa FUP dengan alokasi IP Publik statis dan proteksi anti-DDoS / Clean Pipe dari Telkom.',
    sla: '99.5% - 99.8% (Dedicated Enterprise)',
    mttr: '< 4 Jam (Kompensasi SLA jika melebihi batas)',
    ipAllocation: 'Point-to-point WAN (/30) + Blok LAN IP Publik (/29 = 5 usable, /28 = 13 usable, /27 = 29 usable)',
    topology: 'Internet Core / IGW Telkom -> PE Router -> Metro-E / GPON OLT -> ONT (Bridge Mode) / Media Converter -> Router CPE MikroTik Pelanggan (Interface WAN)',
    keyFeatures: [
      'Bandwidth 1:1 simetris (Upload = Download)',
      'Alokasi IP Public Static resmi dari APNIC / Telkom',
      'Clean Pipe Protection (Mitigasi serangan DDoS L3/L4/L7)',
      'Multi-homing BGP support (opsional untuk pelanggan dengan AS Number mandiri)',
      'Web MRTG Graph real-time untuk monitoring trafik per-5 menit'
    ],
    configNotes: [
      'Setting IP WAN di MikroTik: /ip address add address=180.250.x.2/30 interface=ether1-WAN',
      'Setting Gateway: /ip route add dst-address=0.0.0.0/0 gateway=180.250.x.1',
      'Setting IP LAN Publik: /ip address add address=180.250.y.1/29 interface=ether2-LAN-PUBLIC',
      'DNS Telkom: 202.134.0.155, 202.134.1.10, atau 180.250.247.1'
    ],
    mrtgUrlExample: 'http://mrtg.telkom.co.id/mrtg/[SID_PELANGGAN]/',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30'
  },
  {
    id: 'astinet-lite',
    name: 'Astinet Lite / Direct',
    category: 'Internet',
    description: 'Layanan internet dedicated 1:1 ekonomis untuk segmen enterprise menengah & kantor cabang dengan rasio CIR tinggi dan IP Publik Statis.',
    sla: '99.0% - 99.5%',
    mttr: '< 6 Jam',
    ipAllocation: '1 IP Publik Statis (/30 WAN atau 1 IP Host)',
    topology: 'GPON OLT -> ONT ZTE/Huawei (Mode PPPoE/Static IP) -> LAN Router Pelanggan',
    keyFeatures: [
      'Akses internet simetris dedicated hemat biaya',
      '1x IP Publik Statis untuk remote access / CCTV / Server lokal',
      'Cocok untuk kantor cabang, ruko, klinik, dan kantor operasional'
    ],
    configNotes: [
      'Sering menggunakan ONT dalam mode Bridge ke Port 1, dial-up atau static IP di MikroTik',
      'Jika mode Route di ONT: DMZ atau Port Forwarding diarahkan ke IP WAN MikroTik'
    ],
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  },
  {
    id: 'vpn-ip',
    name: 'VPN IP (MPLS L3VPN)',
    category: 'VPN / Data',
    description: 'Layanan komunikasi data privat berbasis jaringan IP/MPLS Telkom yang menghubungkan kantor pusat (Head Office) dengan seluruh kantor cabang (Branch) secara secure dengan QoS prioritasi data, voice, & video.',
    sla: '99.5% (High Reliability)',
    mttr: '< 4 Jam',
    ipAllocation: 'IP Privat (RFC 1918) Point-to-point /30 per cabang + Routing BGP atau Static Route antar CE-PE',
    topology: 'CPE Router HO (MikroTik/Cisco) <-> PE Router Telkom (MPLS Core) <-> CPE Router Cabang (MikroTik)',
    keyFeatures: [
      'Jaringan tertutup privat (Non-Internet, zero public threat)',
      'Any-to-Any atau Hub-and-Spoke Topology',
      'Dukungan QoS 4 CoS (Class of Service): Real-Time Voice, Critical Data, Best Effort',
      'BGP Dynamic Peering atau Static Route antar titik'
    ],
    configNotes: [
      'Koneksi Point-to-Point WAN IP Privat (Contoh: 10.254.x.2/30, Gateway 10.254.x.1)',
      'Konfigurasi BGP di MikroTik: /routing bgp connection add name=BGP-VPNIP remote.address=10.254.x.1 as=65001',
      'Pastikan MTU 1500 atau sesuaikan MTU MPLS jika ada overhead tagging'
    ],
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  {
    id: 'metro-ethernet',
    name: 'Metro Ethernet (L2VPN / E-Line & E-LAN)',
    category: 'VPN / Data',
    description: 'Layanan koneksi point-to-point atau multipoint berbasis Ethernet murni (Layer 2) dengan kapasitas bandwidth tinggi (hingga 10 Gbps) menggunakan teknologi 802.1Q / QinQ.',
    sla: '99.8% (Carrier Grade)',
    mttr: '< 4 Jam',
    ipAllocation: 'Transparent Layer 2 (Pelanggan bebas menentukan skema IP dan subnetting sendiri)',
    topology: 'CPE Switch/Router Pelanggan -> Switch Metro Telkom (SFP Optik) -> Metro Core Network -> CPE Switch/Router Tujuan',
    keyFeatures: [
      'Transparan terhadap protokol Layer 3 (Bisa melewatkan VLAN Trunking, OSPF, BGP, IPv6)',
      'Jumbo Frame support hingga 9000 bytes MTU',
      'Latensi sangat rendah (< 5ms intra-kota)',
      'Cocok untuk interkoneksi Data Center ke Head Office atau Disaster Recovery Center (DRC)'
    ],
    configNotes: [
      'Gunakan SFP 1G / 10G Dual Core atau BiDi (TX1310/RX1550 vs TX1550/RX1310)',
      'Setting VLAN Sub-Interface di MikroTik: /interface vlan add name=vlan100-metro vlan-id=100 interface=sfp-sfpplus1',
      'Pastikan interface MTU diset 1500 atau 9000 sesuai kebutuhan L2 trunking'
    ],
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 'wms-telkom',
    name: 'WMS (Wifi Managed Service)',
    category: 'Wifi Managed',
    description: 'Solusi end-to-end penyediaan infrastruktur Wi-Fi enterprise berkelas bisnis lengkap dengan Access Point, Cloud Controller, kustomisasi Captive Portal / Landing Page, voucher management, dan analytics pengunjung.',
    sla: '99.0%',
    mttr: '< 6 Jam',
    ipAllocation: 'DHCP Pool Lokal (/24 atau /22 untuk area publik padat user) + Cloud Radius IP',
    topology: 'Modem ONT / Astinet -> MikroTik Router Gateway -> PoE Switch -> Enterprise AP (Ruijie Reyee / UniFi / Omada) -> Cloud WMS Controller',
    keyFeatures: [
      'Multi-SSID (misal: Corporate SSID WPA2/WPA3 + Guest SSID Captive Portal)',
      'Custom Landing Page (Logo perusahaan, login via OTP WhatsApp, Social Media, atau Voucher)',
      'Bandwidth Limiter per-user (User Rate Limit 2 Mbps - 10 Mbps)',
      'Seamless Roaming (802.11k/v/r) antar Access Point tanpa terputus',
      'Cloud Monitoring status AP online/offline secara real-time'
    ],
    configNotes: [
      'VLAN 10: Management AP (Static/DHCP)',
      'VLAN 20: Guest Wifi / WMS Portal (DHCP Pool besar /22, Lease time 1-2 jam)',
      'VLAN 30: Internal Staff (WPA2-PSK/Enterprise, isolasi dari Guest)',
      'Setting MikroTik Hotspot: /ip hotspot profile set [find] login-by=http-chap,http-pap'
    ],
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 'sip-trunk',
    name: 'SIP Trunk / IP Voice Corporate',
    category: 'Voice',
    description: 'Layanan sambungan telepon bisnis multi-channel berbasis protokol SIP (Session Initiation Protocol) yang menghubungkan IP-PBX pelanggan dengan sentral PSTN / IMS Telkom melalui kabel optik/data link privat.',
    sla: '99.5%',
    mttr: '< 4 Jam',
    ipAllocation: 'Point-to-point IP Privat ke SBC (Session Border Controller) Telkom + Nomor Hunting Headset 021-xxxx',
    topology: 'IP-PBX / Voice Gateway Pelanggan (Grandstream/Yeastar) -> Router MikroTik (VLAN Voice) -> ONT GPON -> SBC IMS Telkom',
    keyFeatures: [
      'Mendukung banyak concurrent calls (10, 30, hingga 100+ concurrent channel)',
      'Kualitas audio jernih HD Voice (Codec G.711a, G.711u, G.729)',
      'Efisiensi biaya dibanding sambungan E1 / PRI konvensional',
      'Koneksi melalui VLAN tertutup (khusus Voice) bebas interferensi internet'
    ],
    configNotes: [
      'Port SIP Signaling: UDP 5060, Port Audio RTP: UDP 10000-20000',
      'MikroTik SIP ALG: Seringkali harus DIMATIKAN (/ip firewall service-port set sip disabled=yes) agar tidak corrupt paket SDP',
      'Prioritaskan paket Voice di MikroTik Queue dengan DSCP / TOS marking EF (Expedited Forwarding)'
    ],
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  },
  {
    id: 'indibiz-hsi',
    name: 'IndiBiz (High Speed Internet Enterprise)',
    category: 'Internet',
    description: 'Layanan internet broadband berbasis FTTH (Fiber to the Home/Building) khusus pelaku usaha mikro, kecil, dan menengah (SME) dengan rasio kecepatan stabil dan layanan add-on bisnis.',
    sla: '98.5% - 99.0%',
    mttr: '< 8 Jam',
    ipAllocation: 'IP Publik Dinamis atau Statis (via Add-on IP Static)',
    topology: 'ODC -> ODP -> Dropcore Optik -> Roset -> Patchcord -> ONT ZTE/Huawei -> LAN / Wi-Fi',
    keyFeatures: [
      'Kecepatan mulai 50 Mbps s/d 300 Mbps',
      'Paket bundling aplikasi kasir, CCTV Cloud, dan komunikasi bisnis',
      'Cocok untuk retail, cafe, ruko, dan kantor cabang UKM'
    ],
    configNotes: [
      'Dial PPPoE langsung di ONT atau di-Bridge ke port LAN 1 untuk dial di MikroTik',
      'MTU standar PPPoE: 1492 / 1480'
    ],
    badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  }
];

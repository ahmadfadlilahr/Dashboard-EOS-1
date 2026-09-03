import { TroubleshootingStep } from '../types';

export const TROUBLESHOOTING_FLOWS: TroubleshootingStep[] = [
  {
    id: 'flow-total-down',
    title: 'Link Total Down (LOS Merah / Link Down)',
    category: 'Total Down / LOS',
    severity: 'Critical',
    summary: 'Pelanggan melaporkan koneksi mati total, tidak bisa akses internet/intranet, lampu indikator router/ONT mati atau merah.',
    initialCheck: [
      'Tanyakan apakah ada pemadaman listrik di lokasi pelanggan atau perangkat mati?',
      'Periksa status lampu LED di ONT/Modem: Apakah LOS Merah, PON Mati, atau LAN Mati?',
      'Periksa status port fisik di MikroTik (/interface print): Apakah Flag "R" (Running) menyala pada ether1 WAN?'
    ],
    diagnosticFlow: [
      {
        phase: 'Fase 1: Layer 1 (Fisik & Optik)',
        action: 'Cek lampu LOS di ONT/Modem. Jika LOS BERKEDIP MERAH:',
        commandOrTool: 'Buka Web GUI ONT -> Status -> Optical Information atau gunakan Optical Power Meter (OPM)',
        expectedResult: 'Redaman Rx harus antara -8 dBm s/d -24 dBm.',
        ifFailed: 'Jika Rx < -28 dBm atau "No Optical Power": Periksa patchcord SC-UPC/APC apakah patah/tertekuk, bersihkan ujung ferrule, atau eskalasi ke Tim Jarlit/Datin (Kabel Dropcore Putus / ODP Rusak).'
      },
      {
        phase: 'Fase 2: Registrasi ONT ke OLT',
        action: 'Jika Lampu LOS Mati tetapi Lampu PON Berkedip terus-menerus (Blinking):',
        commandOrTool: 'Cek SN/MAC ONT pada label belakang perangkat vs sistem OLT Telkom (U2000 / NetNumen)',
        expectedResult: 'Lampu PON harus menyala HIJAU STATIS (Solid).',
        ifFailed: 'Eskalasi ke ROC/NOC Witel untuk cek otorisasi registrasi profile GPON ONT (Re-bind Serial Number).'
      },
      {
        phase: 'Fase 3: Layer 2 & 3 (Ethernet & IP Routing)',
        action: 'Jika PON Hijau Statis, uji ping dari MikroTik ke IP Gateway PE Telkom:',
        commandOrTool: '/ping 180.250.x.1 count=10',
        expectedResult: 'Reply respons 1-5 ms tanpa RTO (Packet Loss 0%).',
        ifFailed: 'Jika RTO 100%: Cek konfigurasi IP WAN /30 dan VLAN ID di interface MikroTik. Pastikan port binding LAN pada ONT Bridge mengarah ke ether1 MikroTik.'
      },
      {
        phase: 'Fase 4: DNS & NAT Check',
        action: 'Jika ping IP Gateway & 8.8.8.8 reply, tetapi PC pelanggan tidak bisa browsing:',
        commandOrTool: '/ping google.com & cek /ip firewall nat print',
        expectedResult: 'Domain berhasil resolved dan rule masquerade aktif.',
        ifFailed: 'Tambahkan rule Masquerade di Firewall NAT dan pasang DNS Telkom 202.134.0.155 di DNS router.'
      }
    ],
    escalationMatrix: 'Jika redaman optik putus -> Eskalasi Tiket ke Tim Lapangan Fiber Optik (Jarlit). Jika konfigurasi link di sisi PE Telkom suspended/down -> Eskalasi ke ROC / HD Datin Witel.'
  },
  {
    id: 'flow-flapping',
    title: 'Link Intermittent / Flapping (Putus-Nyambung)',
    category: 'Flapping / Intermittent',
    severity: 'Major',
    summary: 'Koneksi naik turun setiap beberapa menit/jam, sesi VPN IP putus-nyambung, atau panggilan SIP Trunk putus di tengah pembicaraan.',
    initialCheck: [
      'Cek log MikroTik: Apakah ada notifikasi "link down -> link up" berulang kali di ether1?',
      'Cek redaman optik: Apakah nilainya berada di batas kritis (-26 dBm s/d -28 dBm)?',
      'Apakah terjadi di jam-jam tertentu (faktor suhu rak panas / adaptor power drop)?'
    ],
    diagnosticFlow: [
      {
        phase: 'Fase 1: Uji Redaman Optik Marginal',
        action: 'Pantau redaman optik selama 5-10 menit. Redaman yang goyang (misal dari -22 dBm tiba-tiba drop ke -29 dBm):',
        commandOrTool: 'Web ONT / SFP DDM (/interface ethernet monitor sfp1 once)',
        expectedResult: 'Redaman stabil tanpa fluktuasi > 1 dBm.',
        ifFailed: 'Ganti patchcord fiber optik dari Roset ke ONT. Pastikan radius bending kabel tidak terlalu tajam (< 30mm).'
      },
      {
        phase: 'Fase 2: Cek CRC Errors pada Kabel UTP LAN',
        action: 'Periksa statistik error pada interface Ethernet MikroTik:',
        commandOrTool: '/interface ethernet print stats where name=ether1-WAN',
        expectedResult: 'Rx/Tx FCS Errors = 0, Alignment Errors = 0.',
        ifFailed: 'Jika FCS/CRC errors terus bertambah: Kabel RJ45 UTP rusak, konektor korosi, atau kabel lewat dekat kabel power PLN tegangan tinggi (induksi). Ganti dengan kabel Cat6 STP berpindai.'
      },
      {
        phase: 'Fase 3: Cek BGP Hold Time Flap (Khusus VPN IP)',
        action: 'Pada layanan VPN IP, cek apakah BGP sering Reset:',
        commandOrTool: '/log print where topics~"bgp"',
        expectedResult: 'BGP session Established terus-menerus tanpa Reset notification.',
        ifFailed: 'Jika "HoldTimer expired": Terjadi congestion paket keepalive. Pasang QoS prioritasi untuk paket BGP (TCP port 179).'
      }
    ],
    escalationMatrix: 'Lakukan penggantian kabel patchcord di site. Jika masih berlanjut, hubungi ROC untuk pembersihan adapter di ODP/ODC atau pengecekan port card OLT/Switch Metro.'
  },
  {
    id: 'flow-high-latency',
    title: 'High Latency, Jitter & Bandwidth Drop (Lemot)',
    category: 'High Latency / Drop',
    severity: 'Major',
    summary: 'Internet atau VPN IP terasa sangat lambat, video conference patah-patah, ping melonjak dari 15ms menjadi 200-500ms.',
    initialCheck: [
      'Berapa kapasitas paket langganan pelanggan (misal Astinet 50 Mbps)?',
      'Berapa traffic aktual yang sedang lewat saat komplain terjadi?',
      'Apakah ada IP lokal yang sedang melakukan download/upload besar atau torrent?'
    ],
    diagnosticFlow: [
      {
        phase: 'Fase 1: Cek Saturasi Bandwidth (Penuh 100%)',
        action: 'Buka Tool Torch di MikroTik untuk melihat real-time traffic per-IP:',
        commandOrTool: '/tool torch ether1-WAN',
        expectedResult: 'Penggunaan bandwidth < 90% dari total bandwidth langganan.',
        ifFailed: 'Jika bandwidth menyentuh limit (contoh: langganan 50M, traffic terpakai 49.8M): Link mengalami kongesti normal karena kapasitas penuh. Sarankan pelanggan pasang Simple Queue/PCQ atau upgrade bandwidth.'
      },
      {
        phase: 'Fase 2: Cek Traceroute & Hop PE Telkom',
        action: 'Lakukan traceroute untuk mengetahui di mana latensi mulai naik:',
        commandOrTool: '/tool traceroute 8.8.8.8 use-dns=yes count=5',
        expectedResult: 'Latensi ke Gateway Hop 1 (PE Telkom) < 5ms, ke Core Telkom < 15ms.',
        ifFailed: 'Jika dari Hop 1 sudah > 100ms: Masalah ada di transmisi radio/optik segmen akses Telkom. Laporkan hasil traceroute ke ROC/NOC.'
      },
      {
        phase: 'Fase 3: Deteksi Loop / Broadcast Storm',
        action: 'Periksa paket per detik (pps) pada interface LAN:',
        commandOrTool: '/interface monitor-traffic ether2-LAN',
        expectedResult: 'Rx/Tx packet rate wajar (< 3.000 pps untuk kantor normal).',
        ifFailed: 'Jika pps mencapai > 50.000 pps padahal traffic Mbps kecil: Terjadi looping switch di jaringan lokal pelanggan atau virus broadcast. Aktifkan Loop Protect di MikroTik.'
      }
    ],
    escalationMatrix: 'Kirimkan bukti grafik MRTG Telkom dan hasil Torch kepada pelanggan. Jika saturasi terjadi di segmen Telkom (bukan LAN pelanggan), eskalasi ke ROC.'
  },
  {
    id: 'flow-wms-ap',
    title: 'Kendala WMS (Wifi Managed Service) & Access Point',
    category: 'WMS & AP',
    severity: 'Major',
    summary: 'Pengunjung tidak bisa connect Wi-Fi, tidak mendapat IP address (Obtaining IP stuck), atau Landing Page / Captive Portal tidak terbuka.',
    initialCheck: [
      'Apakah lampu status di Access Point (Ruijie/UniFi) menyala Biru / Hijau / Oranye / Mati?',
      'Apakah SSID Wi-Fi terdeteksi di smartphone pengunjung?',
      'Apakah DHCP Pool di MikroTik/Controller sudah penuh?'
    ],
    diagnosticFlow: [
      {
        phase: 'Fase 1: Cek Power PoE & Fisik AP',
        action: 'Periksa lampu indikator pada AP dan port Switch PoE:',
        commandOrTool: 'Inspeksi LED AP dan Switch PoE',
        expectedResult: 'Lampu AP menyala Biru Solid (Ruijie/UniFi) dan Link Port Switch PoE 1 Gbps.',
        ifFailed: 'Jika AP mati/berkedip oranye: Kabel UTP PoE drop tegangan (panjang > 70m kabel non-tembaga murni) atau adapter PoE rusak. Ganti adaptor PoE.'
      },
      {
        phase: 'Fase 2: Cek Ketersediaan IP DHCP Pool',
        action: 'Periksa apakah IP Pool untuk VLAN Guest/WMS sudah habis:',
        commandOrTool: '/ip dhcp-server lease print count-only & /ip pool print',
        expectedResult: 'Jumlah Active Lease < Total Range IP Pool.',
        ifFailed: 'Jika Pool penuh: Perbesar subnet dari `/24` (254 IP) menjadi `/22` (1022 IP) dan pendekkan Lease Time menjadi 30 menit s/d 1 jam.'
      },
      {
        phase: 'Fase 3: Cek Captive Portal Hijacking / DNS',
        action: 'Jika user berhasil connect Wi-Fi tetapi Landing Page Login tidak muncul:',
        commandOrTool: 'Akses manual via browser: http://172.16.20.1 atau http://captive.telkom.co.id',
        expectedResult: 'Halaman portal terbuka dan meminta input voucher/OTP.',
        ifFailed: 'Pastikan Port 80 & 53 (DNS) tidak diblokir di firewall. Pada smartphone, matikan fitur "Private MAC / Randomized MAC" jika sistem autentikasi mengikat MAC.'
      }
    ],
    escalationMatrix: 'Jika masalah terjadi pada server autentikasi Cloud WMS Telkom (Radius Server Timeout), buat tiket eskalasi ke Tim WMS Telkom / ROC.'
  },
  {
    id: 'flow-sip-trunk',
    title: 'Kendala SIP Trunk / Telepon IP Corporate',
    category: 'SIP Trunk',
    severity: 'Major',
    summary: 'Telepon kantor tidak bisa melakukan panggilan keluar/masuk, status SIP Unregistered, atau terjadi suara satu arah (One-Way Audio).',
    initialCheck: [
      'Apakah link data / VLAN khusus Voice ke SBC Telkom berstatus UP?',
      'Apakah status registrasi SIP di IP-PBX / Grandstream berstatus Registered atau Request Timeout?',
      'Apakah SIP ALG di Router MikroTik aktif atau disabled?'
    ],
    diagnosticFlow: [
      {
        phase: 'Fase 1: Matikan SIP ALG di MikroTik',
        action: 'Periksa status SIP ALG helper pada firewall MikroTik:',
        commandOrTool: '/ip firewall service-port print where name="sip"',
        expectedResult: 'SIP ALG helper berstatus DISABLED (`X`).',
        ifFailed: 'Jalankan perintah: `/ip firewall service-port set sip disabled=yes`. SIP ALG bawaan router sering memodifikasi payload SDP secara salah yang menyebabkan One-Way Audio.'
      },
      {
        phase: 'Fase 2: Ping & Traceroute ke IP SBC IMS Telkom',
        action: 'Uji konektivitas dari router ke SBC Telkom (Port SIP UDP 5060):',
        commandOrTool: '/ping [IP_SBC_TELKOM] routing-table=VLAN-VOICE',
        expectedResult: 'Ping reply < 20ms tanpa jitter.',
        ifFailed: 'Periksa VLAN ID Voice di switch/ONT dan pastikan routing table VoIP mengarah ke gateway SBC Telkom.'
      },
      {
        phase: 'Fase 3: Cek Codec Audio & RTP Port Range',
        action: 'Periksa pengaturan Codec di IP-PBX / IP Phone pelanggan:',
        commandOrTool: 'Web Management IP-PBX -> SIP Trunk Settings',
        expectedResult: 'Urutan Codec: 1. G.711a (PCMA) / G.711u (PCMU), 2. G.729.',
        ifFailed: 'Samakan urutan codec dengan parameter IMS Telkom, dan buka range port RTP UDP 10000-20000 di firewall.'
      }
    ],
    escalationMatrix: 'Jika status IP-PBX terus 403 Forbidden atau 408 Timeout padahal IP reachable, eskalasi ke Tim Voice/IMS Datin Telkom untuk reset auth credential.'
  }
];

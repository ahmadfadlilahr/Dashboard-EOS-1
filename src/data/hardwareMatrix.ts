import { HardwareInfo } from '../types';

export const HARDWARE_MATRIX: HardwareInfo[] = [
  {
    id: 'zte-f670l-f609',
    category: 'ONT/Modem',
    brand: 'ZTE',
    model: 'ZXHN F670L / F609 (GPON ONT)',
    specs: 'Dual Band AC1200 (2.4GHz & 5GHz) / Single Band, 4x Gigabit LAN, 1x FXS POTS (Voice), 1x SC-UPC Port GPON',
    defaultIp: '192.168.1.1',
    defaultLogin: 'Username: admin / User: user | Password: Telkomdso123 / admin / %0nZte$Hg / user1234',
    keyFunctions: [
      'Konfigurasi Bridge Mode untuk meneruskan IP Publik/VLAN ke MikroTik',
      'PPPoE Client Dial-up untuk layanan IndiBiz / Astinet Lite',
      'SIP VoIP configuration untuk telepon rumah/kantor',
      'Pengecekan redaman optik Rx/Tx secara langsung via Web GUI'
    ],
    stepByStepConfig: [
      {
        title: 'Langkah Setting Bridge Mode (Untuk diteruskan ke MikroTik)',
        steps: [
          'Login ke Web GUI ZTE (192.168.1.1) menggunakan user admin.',
          'Buka menu: Network -> WAN -> WAN Connection.',
          'Pilih Connection Name yang sudah ada (misal: 1_INTERNET_R_VID_) atau buat baru "Create WAN Connection".',
          'Ubah "Type" dari Route menjadi "Bridge Connection".',
          'Pilih Service List: "Internet". Masukkan VLAN ID sesuai instruksi Witel/ROC (atau disable VLAN jika untagged dari OLT).',
          'Buka menu: Network -> Port Binding. Centang LAN1 (atau port yang terhubung ke ether1 WAN MikroTik) ke WAN Connection Bridge tadi.',
          'Buka menu: Security -> Firewall / ALG, pastikan tidak memblokir traffic passthrough.',
          'Koneksikan kabel LAN dari LAN1 ZTE ke Port Ether1 MikroTik. Setting IP WAN atau DHCP/PPPoE di MikroTik.'
        ]
      },
      {
        title: 'Cara Cek Redaman Optik (Optical Power)',
        steps: [
          'Buka menu: Status -> Optical Information.',
          'Lihat parameter "Rx Optical Power" (Redaman Masuk).',
          'Nilai normal wajib berada di antara -8.00 dBm sampai -24.00 dBm.',
          'Jika Rx < -27.00 dBm, lakukan pengecekan pada konektor patchcord, roset, atau lapor ke tim Datin/Jarlit.'
        ]
      }
    ],
    indicatorsGuide: [
      { led: 'POWER', status: 'Hijau Menyala', meaning: 'Suplai listrik normal', action: 'Tidak ada tindakan' },
      { led: 'PON', status: 'Hijau Menyala Statis', meaning: 'ONT teregistrasi sukses di OLT GPON Telkom', action: 'Siap digunakan' },
      { led: 'PON', status: 'Berkedip Cepat (Blinking)', meaning: 'ONT sedang proses registrasi / sinkronisasi OLT', action: 'Tunggu 1-3 menit. Jika terus berkedip, cek SN/MAC ONT di sistem OLT' },
      { led: 'LOS', status: 'Mati', meaning: 'Sinyal optik diterima normal (ada laser)', action: 'Normal' },
      { led: 'LOS', status: 'MERAH BERKEDIP', meaning: 'TIDAK ADA SINYAL OPTIK / KABEL PUTUS', action: 'Cek patchcord optik, pastikan tidak terlipat/patah, ukur dengan OPM' },
      { led: 'LAN 1-4', status: 'Hijau Berkedip', meaning: 'Koneksi kabel LAN ke router/PC terdeteksi dan ada traffic', action: 'Normal' }
    ]
  },
  {
    id: 'huawei-hg8245h5-w5',
    category: 'ONT/Modem',
    brand: 'Huawei',
    model: 'EchoLife HG8245H / HG8245H5 / HG8245W5 (GPON)',
    specs: '4x GE/FE Port, 2x POTS, Wi-Fi 802.11b/g/n/ac, 1x SC-UPC/APC GPON Port',
    defaultIp: '192.168.100.1 atau 192.168.18.1',
    defaultLogin: 'Username: TelecomAdmin / admin | Password: admintelecom / Support99 / admin',
    keyFunctions: [
      'Konfigurasi Bridge WAN ke MikroTik',
      'Port Mapping & VLAN Binding',
      'Optical Power Diagnosis',
      'DMZ & Static NAT passthrough'
    ],
    stepByStepConfig: [
      {
        title: 'Langkah Setting Bridge Mode Huawei',
        steps: [
          'Buka browser, akses 192.168.100.1 (login dengan TelecomAdmin).',
          'Masuk ke tab: WAN -> WAN Configuration.',
          'Klik "New" atau edit profile yang ada.',
          'Centang "Enable WAN Connection". Ubah "Mode" menjadi "Bridge WAN".',
          'Ubah Bridge Type menjadi "IP_Bridged". Centang VLAN: Masukkan VLAN ID (misal VLAN 100 / 200).',
          'Pada bagian Binding Options, centang LAN1.',
          'Klik Apply. Hubungkan LAN1 Huawei ke Port MikroTik.'
        ]
      },
      {
        title: 'Cek Redaman Optik di Huawei',
        steps: [
          'Masuk ke tab: Status -> Optical Information.',
          'Periksa "Rx Optical Power (dBm)" dan "Tx Optical Power (dBm)".',
          'Pastikan Rx Power bernilai antara -9 dBm s/d -24 dBm.',
          'Tx Power normal ONT GPON biasanya berada di kisaran +1.5 s/d +3.5 dBm.'
        ]
      }
    ],
    indicatorsGuide: [
      { led: 'POWER', status: 'Hijau', meaning: 'Power Adaptor normal 12V 1.5A', action: 'Normal' },
      { led: 'PON', status: 'Hijau Statis', meaning: 'OMCI & OLT terhubung sempurna', action: 'Normal' },
      { led: 'LOS', status: 'Merah Berkedip', meaning: 'Daya optik di bawah sensitivity threshold (< -28 dBm) atau no optical signal', action: 'Inspeksi fisik kabel dropcore/patchcord, bersihkan ujung ferrule konektor' },
      { led: 'LAN', status: 'Mati padahal kabel tertancap', meaning: 'Kabel UTP putus/rusak, atau port ethernet router MikroTik mati/disabled', action: 'Ganti patchcord UTP Cat6, cek link speed di MikroTik' }
    ]
  },
  {
    id: 'fiberhome-an5506',
    category: 'ONT/Modem',
    brand: 'Fiberhome',
    model: 'AN5506-04-F / AN5506-02-B',
    specs: '4x GE Port, Wi-Fi 300Mbps, 1x FXS Voice, GPON Class B+/C+',
    defaultIp: '192.168.1.1',
    defaultLogin: 'Username: admin / user | Password: %0nFh productivity / admin / user1234',
    keyFunctions: [
      'Bridge Layer 2 WAN ke Router MikroTik',
      'Optical Info & GPON State Check',
      'Port Isolation & Binding'
    ],
    stepByStepConfig: [
      {
        title: 'Konfigurasi Bridge Mode Fiberhome',
        steps: [
          'Login ke Web Management Fiberhome.',
          'Pilih menu: Network -> WAN Configuration.',
          'Pilih WAN Mode: Bridge. Service Type: INTERNET.',
          'Aktifkan VLAN Tagging jika diperlukan, masukkan VLAN ID.',
          'Assign ke Port LAN 1 dan simpan konfigurasi.'
        ]
      }
    ],
    indicatorsGuide: [
      { led: 'LOS', status: 'Merah', meaning: 'Rx Power Loss', action: 'Cek kabel optik' },
      { led: 'PON', status: 'Hijau', meaning: 'Sync OK', action: 'Normal' }
    ]
  },
  {
    id: 'mikrotik-cpe-router',
    category: 'Router CPE',
    brand: 'MikroTik',
    model: 'RouterBOARD / Cloud Core Router (CCR2004, RB4011, RB5009, RB750Gr3 hEX, RB960PGS Hex S)',
    specs: 'RouterOS v7/v6, Multi-core CPU, SFP/SFP+ Port 1G/10G, Gigabit Ethernet, Hardware NAT, IPsec acceleration',
    defaultIp: '192.168.88.1 (Atau via MAC Address di Winbox)',
    defaultLogin: 'Username: admin | Password: (kosong / default blank, wajib diubah saat pertama setup)',
    keyFunctions: [
      'Gateway Utama Enterprise (Astinet / VPN IP / Metro-E)',
      'BGP Dynamic Routing Peering & VRF L3VPN',
      'VLAN Sub-interfaces (802.1Q & QinQ 802.1ad)',
      'NAT (Masquerade Internet & Port Forwarding DST-NAT Server/CCTV)',
      'Bandwidth Management (Simple Queue & PCQ)',
      'DHCP Server untuk WMS / Hotspot / LAN Pelanggan',
      'Realtime Traffic Monitoring menggunakan Tool Torch & Packet Sniffer'
    ],
    stepByStepConfig: [
      {
        title: 'Konfigurasi Dasar IP Publik Astinet di MikroTik',
        steps: [
          'Buka Winbox, connect ke MikroTik via MAC Address.',
          'Beri nama interface: /interface set ether1 name=ether1-WAN, /interface set ether2 name=ether2-LAN',
          'Pasang IP WAN: /ip address add address=180.250.10.2/30 interface=ether1-WAN',
          'Pasang Default Route Gateway: /ip route add dst-address=0.0.0.0/0 gateway=180.250.10.1',
          'Pasang DNS Telkom / Public: /ip dns set servers=202.134.0.155,202.134.1.10,8.8.8.8 allow-remote-requests=yes',
          'Pasang IP LAN Pelanggan: /ip address add address=192.168.10.1/24 interface=ether2-LAN',
          'Pasang NAT Internet: /ip firewall nat add chain=srcnat out-interface=ether1-WAN action=masquerade',
          'Uji koneksi di Terminal Winbox: /ping 8.8.8.8 dan /ping google.com'
        ]
      },
      {
        title: 'Konfigurasi BGP Peering untuk VPN IP Telkom',
        steps: [
          'Pasang IP Point-to-Point WAN: /ip address add address=10.200.1.2/30 interface=ether1-WAN',
          'Di RouterOS v7: /routing bgp template add name=tpl-telkom as=65500',
          'Buat BGP Connection: /routing bgp connection add name=bgp-to-telkom-pe remote.address=10.200.1.1 remote.as=65001 template=tpl-telkom output.network=bgp-networks',
          'Advertise subnet LAN lokal ke BGP: /routing bgp network add network=192.168.100.0/24',
          'Cek status BGP: /routing bgp session print, pastikan state "established".'
        ]
      }
    ],
    indicatorsGuide: [
      { led: 'USR / ACT', status: 'Blinking Hijau/Biru', meaning: 'CPU processing / Heartbeat router normal', action: 'Normal' },
      { led: 'SFP / SFP+', status: 'Menyala Solid', meaning: 'Optical link SFP connected (ada light Rx & Tx terdeteksi)', action: 'Normal' },
      { led: 'ETHERNET 1-5', status: 'Kedip Oranye/Hijau', meaning: 'Hijau = 1 Gbps Gigabit link, Oranye = 100 Mbps Fast Ethernet', action: 'Jika kabel Cat6 tapi terdeteksi Oranye (100M), periksa crimping kabel RJ45' }
    ]
  },
  {
    id: 'ruijie-reyee-wms-ap',
    category: 'Access Point / WMS',
    brand: 'Ruijie Reyee / UniFi / TP-Link Omada',
    model: 'Ruijie RG-RAP2200(E) / UniFi U6-Lite / Omada EAP610',
    specs: 'Wi-Fi 6 AX1800 / Wi-Fi 5 AC1300 Dual-Band, 802.3af/at PoE In, Multi-SSID, Cloud Management, Seamless Roaming',
    defaultIp: '192.168.110.1 (atau via DHCP dari Router MikroTik)',
    defaultLogin: 'Ruijie Cloud App / UniFi Network Controller / Web: admin / admin',
    keyFunctions: [
      'Infrastruktur Wi-Fi WMS Telkom (@wifi.id, Guest Portal, Staff Wifi)',
      'Captive Portal & Landing Page Voucher / OTP Login',
      'VLAN Tagging per-SSID (Isolasi traffic tamu vs operasional)',
      'Rate Limiting / Bandwidth Shaping per-client (misal: 5 Mbps/user)',
      'Client Isolation (mencegah antar user di satu Wi-Fi saling sniffing/hack)'
    ],
    stepByStepConfig: [
      {
        title: 'Konfigurasi Multi-SSID dengan VLAN Trunking di AP',
        steps: [
          'Hubungkan AP ke Switch PoE yang terhubung ke Trunk Port MikroTik.',
          'Buat VLAN di MikroTik: VLAN 10 (Management), VLAN 20 (Guest-WMS), VLAN 30 (Staff).',
          'Set DHCP Server pada masing-masing VLAN di MikroTik.',
          'Buka Ruijie Cloud / UniFi Controller, adopt Access Point.',
          'Buat SSID 1: "@WIFI-ENTERPRISE-GUEST" -> Bind ke VLAN 20 -> Aktifkan Captive Portal / Isolation.',
          'Buat SSID 2: "STAFF-OFFICE" -> Bind ke VLAN 30 -> WPA2/WPA3 Password.',
          'Test konek HP ke masing-masing SSID, pastikan mendapat IP sesuai range VLAN dan captive portal muncul otomatis.'
        ]
      }
    ],
    indicatorsGuide: [
      { led: 'SYS / Status', status: 'Biru Solid', meaning: 'AP online dan terkoneksi ke Cloud Controller / internet', action: 'Normal operasional' },
      { led: 'SYS / Status', status: 'Oranye / Hijau Kedip', meaning: 'AP sedang booting atau gagal mendapatkan IP DHCP dari Router', action: 'Periksa kabel PoE, pastikan DHCP Server di VLAN Management aktif' },
      { led: 'SYS / Status', status: 'Mati', meaning: 'Tidak ada power PoE dari Switch atau PoE Injector rusak', action: 'Cek kabel UTP pin 4,5 (+), 7,8 (-), pastikan PoE switch mencukupi budget watt' }
    ]
  },
  {
    id: 'optical-hardware-field',
    category: 'Optical & Fisik',
    brand: 'Hardware Optik Telkom',
    model: 'OTB, Roset, Patchcord, SFP BiDi, Converter Media',
    specs: 'Single Mode Fiber (SMF 9/125um), SC/UPC (Biru), SC/APC (Hijau), LC/UPC, SFP BiDi 1.25G TX1310/RX1550 & TX1550/RX1310',
    defaultIp: 'N/A (Layer 1 Physical Component)',
    defaultLogin: 'N/A',
    keyFunctions: [
      'Terminasi kabel feeder & dropcore ke perangkat aktif',
      'Konversi sinyal elektrik RJ45 ke cahaya optik (Media Converter)',
      'Interkoneksi port SFP Switch Metro / MikroTik CCR'
    ],
    stepByStepConfig: [
      {
        title: 'Aturan Emas Patchcord Optik (SC-UPC vs SC-APC)',
        steps: [
          'Konektor BIRU = SC-UPC (Ultra Physical Contact, ujung rata/flat). Wajib dicolokkan ke port BIRU (ONT/SFP standar).',
          'Konektor HIJAU = SC-APC (Angled Physical Contact, ujung miring 8 derajat). Wajib dicolokkan ke Roset/Adapter HIJAU.',
          'JANGAN PERNAH menyambung konektor Biru langsung ke adapter Hijau tanpa adapter konversi! Redaman akan melonjak > 10 dBm dan merusak ujung ferrule keramik.',
          'Gunakan pembersih Alkohol Isopropyl 99% / One-Click Optical Cleaner jika ferrule kotor sebelum dicolokkan.'
        ]
      },
      {
        title: 'Aturan Pasangan SFP BiDi (Single Core WDM)',
        steps: [
          'SFP BiDi bekerja berpasangan menggunakan 1 core fiber:',
          'Sisi A (misal di Switch Metro/OLT): SFP TX 1310nm / RX 1550nm (Klip Biru).',
          'Sisi B (di MikroTik CPE Pelanggan): SFP TX 1550nm / RX 1310nm (Klip Kuning/Hijau).',
          'Jika kedua sisi menggunakan panjang gelombang yang sama (TX1310 ketemu TX1310), LINK TIDAK AKAN UP!'
        ]
      }
    ],
    opticReadingGuide: 'Standar Redaman Telkom GPON: -8 dBm s/d -24 dBm (Ideal: -15 s/d -21 dBm). Di bawah -27 dBm = Link Kritis / Flapping.',
    indicatorsGuide: [
      { led: 'Converter FX (Fiber)', status: 'Menyala Solid', meaning: 'Sinyal optik RX & TX terdeteksi oleh Media Converter', action: 'Normal' },
      { led: 'Converter FX (Fiber)', status: 'Mati', meaning: 'Optik putus (LOS) atau pasangan TX/RX kabel fiber terbalik (pada Dual Core LC/SC)', action: 'Tukar posisi kabel TX dan RX, atau ukur laser dengan VFL Pen' },
      { led: 'Converter TX (LAN)', status: 'Menyala Solid/Kedip', meaning: 'Kabel UTP RJ45 ke router terhubung', action: 'Normal' }
    ]
  }
];

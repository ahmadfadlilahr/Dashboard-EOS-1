export interface CliCommandGroup {
  category: string;
  description: string;
  commands: {
    name: string;
    description: string;
    command: string;
    exampleOutput?: string;
  }[];
}

export const MIKROTIK_CHEATSHEET: CliCommandGroup[] = [
  {
    category: 'Diagnosa & Realtime Monitoring',
    description: 'Perintah cepat untuk menganalisis traffic, packet loss, dan status hardware di lapangan.',
    commands: [
      {
        name: 'Torch Tool (Pantau Traffic Real-Time)',
        description: 'Melihat source IP, destination IP, port protokol, dan bandwidth yang sedang lewat di suatu interface.',
        command: '/tool torch ether1-WAN src-address=0.0.0.0/0 dst-address=0.0.0.0/0 port=any'
      },
      {
        name: 'Monitor Traffic Interface',
        description: 'Melihat throughput Tx/Rx saat ini (bps dan pps) secara langsung.',
        command: '/interface monitor-traffic ether1-WAN,ether2-LAN'
      },
      {
        name: 'Tes Kualitas Kabel LAN (Cable Test)',
        description: 'Mendeteksi apakah kabel UTP putus (open), korslet (short), atau normal pada jarak berapa meter.',
        command: '/interface ethernet cable-test ether1-WAN'
      },
      {
        name: 'Cek Log Error & Link Flapping',
        description: 'Memfilter log sistem untuk melihat apakah link pernah down/up atau ada serangan login.',
        command: '/log print where topics~"error" or topics~"critical" or topics~"link"'
      },
      {
        name: 'Cek Status CPU, RAM & Uptime',
        description: 'Mengecek beban prosesor router untuk memastikan tidak ada bottleneck (CPU 100%).',
        command: '/system resource print'
      }
    ]
  },
  {
    category: 'Routing & Konektivitas Telkom',
    description: 'Setup routing statis, BGP peering VPN IP, dan pengecekan jalur data.',
    commands: [
      {
        name: 'Cek Tabel Routing Detail',
        description: 'Menampilkan seluruh rute aktif (DAC, DAX, BGP) beserta distance dan status gateway reachable.',
        command: '/ip route print detail where active=yes'
      },
      {
        name: 'Traceroute Cek Hop Jalur PE Telkom',
        description: 'Menelusuri setiap router hop untuk mendeteksi titik mana yang menyebabkan spike latency atau RTO.',
        command: '/tool traceroute address=8.8.8.8 use-dns=yes count=10'
      },
      {
        name: 'BGP Peering Session Status (RouterOS v7)',
        description: 'Mengecek apakah sesi BGP dengan PE Telkom berstatus Established atau Connect/Active (Down).',
        command: '/routing bgp session print detail'
      },
      {
        name: 'Ping dengan Ukuran Paket Besar (DF Bit MTU Test)',
        description: 'Menguji apakah jalur optik / switch melewatkan paket tanpa fragmentasi MTU 1500.',
        command: '/ping address=180.250.10.5 size=1472 do-not-fragment=yes count=5'
      }
    ]
  },
  {
    category: 'VLAN & Trunking Interface',
    description: 'Membuat sub-interface VLAN untuk interkoneksi Metro-E, WMS, dan Multi-Service.',
    commands: [
      {
        name: 'Buat VLAN Sub-Interface',
        description: 'Membuat interface VLAN pada port SFP atau Ethernet untuk membawa traffic Metro-E / Internet.',
        command: '/interface vlan add name=vlan100-astinet vlan-id=100 interface=ether1-WAN comment="VLAN Astinet"'
      },
      {
        name: 'Buat Trunking Bridge VLAN Filtering',
        description: 'Mengaktifkan VLAN Filtering di bridge untuk mendistribusikan beberapa VLAN ke access point / switch.',
        command: `/interface bridge add name=bridge-trunk vlan-filtering=yes
/interface bridge port add bridge=bridge-trunk interface=ether2-AP
/interface bridge vlan add bridge=bridge-trunk tagged=bridge-trunk,ether2-AP vlan-ids=10,20,30`
      }
    ]
  },
  {
    category: 'Bandwidth Limiter (Simple Queue & PCQ)',
    description: 'Manajemen alokasi bandwidth agar pelanggan tidak komplain internet lemot karena 1 user rakus.',
    commands: [
      {
        name: 'Simple Queue per IP / Subnet',
        description: 'Membatasi kecepatan download dan upload untuk IP atau subnet tertentu.',
        command: '/queue simple add name="Limit-Staff" target=192.168.10.0/24 max-limit=20M/20M comment="Limit LAN 20Mbps"'
      },
      {
        name: 'PCQ Equal Bandwidth Divider (Bagi Rata Otomatis)',
        description: 'Membagi bandwidth secara adil otomatis ke semua user yang sedang aktif.',
        command: `/queue type add name=pcq-download-custom kind=pcq pcq-rate=0 pcq-classifier=dst-address
/queue type add name=pcq-upload-custom kind=pcq pcq-rate=0 pcq-classifier=src-address
/queue simple add name="Bagi-Rata-WMS" target=172.16.20.0/22 max-limit=50M/50M queue=pcq-upload-custom/pcq-download-custom`
      }
    ]
  },
  {
    category: 'Backup, Export & Maintenance',
    description: 'Perintah wajib saat serah terima pekerjaan (BAP) dan backup berkala sebelum change config.',
    commands: [
      {
        name: 'Export Konfigurasi Teks (.rsc)',
        description: 'Menyimpan seluruh script konfigurasi router yang dapat dibaca dan di-restore ke router lain.',
        command: '/export compact file=backup_eos_telkom'
      },
      {
        name: 'Backup Binary Lengkap (.backup)',
        description: 'Menyimpan full snapshot database router termasuk password dan MAC address.',
        command: '/system backup save name=full_backup_eos'
      },
      {
        name: 'DNS Flush Cache',
        description: 'Membersihkan cache DNS MikroTik jika ada domain yang baru saja dipindah/diupdate.',
        command: '/ip dns cache flush'
      },
      {
        name: 'Clear ARP Cache',
        description: 'Menghapus tabel ARP jika baru saja mengganti perangkat CPE/ONT agar MAC baru terdeteksi.',
        command: '/ip arp remove [find dynamic=yes]'
      }
    ]
  }
];

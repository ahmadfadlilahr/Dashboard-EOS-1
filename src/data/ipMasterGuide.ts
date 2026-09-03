import { IpConfigSection } from '../types';

export const IP_MASTER_GUIDE: IpConfigSection[] = [
  {
    id: 'ip-fundamentals',
    title: '1. Pemahaman Dasar IP Address & Subnetting',
    icon: 'Network',
    description: 'Konsep dasar penting bagi EOS untuk memahami pengalamatan IP, perbedaan IP Publik vs Privat, serta anatomi subnet mask.',
    content: [
      {
        subtitle: 'Perbedaan IP Publik vs IP Privat (RFC 1918)',
        badge: 'Fundamental',
        points: [
          '**IP Publik**: Alamat IP yang unik secara global di seluruh dunia dan dapat di-routing langsung di internet. Digunakan pada WAN Astinet, Server Web, VPN IP Gateway. Dialokasikan oleh APNIC / Telkom.',
          '**IP Privat (RFC 1918)**: Alamat IP yang hanya berlaku di jaringan lokal (LAN) dan tidak bisa langsung diakses dari internet tanpa NAT (Network Address Translation):',
          '• **Kelas A**: `10.0.0.0/8` (Rentang: `10.0.0.0` s/d `10.255.255.255`) -> Sering dipakai di jaringan backbone VPN IP / MPLS & Metro-E Telkom.',
          '• **Kelas B**: `172.16.0.0/12` (Rentang: `172.16.0.0` s/d `172.31.255.255`) -> Dipakai di infrastruktur WMS & VLAN Corporate.',
          '• **Kelas C**: `192.168.0.0/16` (Rentang: `192.168.0.0` s/d `192.168.255.255`) -> Standar default modem ONT (192.168.1.1) dan LAN kantor.'
        ]
      },
      {
        subtitle: 'Anatomi IP Address: Network ID, Host, Gateway & Broadcast',
        points: [
          '**Network ID (IP Pertama)**: Alamat identitas seluruh segmen jaringan. Tidak boleh dipasang pada perangkat host/router.',
          '**Gateway (Biasa IP Pertama setelah Network ID)**: Pintu keluar-masuk lalu lintas data menuju jaringan luar / internet (pada Astinet biasanya IP interface PE Router Telkom).',
          '**Usable IP Host**: Rentang IP yang boleh dipasang ke perangkat pengguna, server, CCTV, access point, atau router client.',
          '**Broadcast ID (IP Terakhir)**: Alamat khusus untuk mengirim paket broadcast ke semua host dalam satu subnet. Tidak boleh dipasang pada perangkat.',
          '**Subnet Mask / CIDR Prefix**: Menentukan berapa banyak bit porsi Network dan porsi Host (contoh: `/24` = `255.255.255.0` = 254 Usable IP).'
        ]
      }
    ]
  },
  {
    id: 'telkom-ip-allocation',
    title: '2. Skema Standar Alokasi IP Link Enterprise Telkom',
    icon: 'Layers',
    description: 'Standar pembagian IP yang wajib dikuasai EOS saat instalasi, aktivasi, dan migrasi link Astinet & VPN IP.',
    content: [
      {
        subtitle: 'A. Subnet Point-to-Point WAN: Prefix /30 (4 IP Total, 2 Usable)',
        badge: 'Standar WAN Telkom',
        points: [
          'Total IP: 4 | Subnet Mask: `255.255.255.252`',
          'Contoh Alokasi Telkom: `180.250.10.4/30`',
          '• **Network ID**: `180.250.10.4`',
          '• **Gateway (Sisi PE Router Telkom)**: `180.250.10.5`',
          '• **IP WAN Router Pelanggan (Sisi CE MikroTik)**: `180.250.10.6`',
          '• **Broadcast**: `180.250.10.7`',
          '💡 *Catatan EOS*: Pastikan MikroTik pelanggan dipasang IP `180.250.10.6/30` dengan Default Gateway `180.250.10.5`.'
        ],
        codeBlock: `/ip address add address=180.250.10.6/30 interface=ether1-WAN comment="IP WAN Astinet Telkom"
/ip route add dst-address=0.0.0.0/0 gateway=180.250.10.5 comment="Default Gateway Telkom PE"`
      },
      {
        subtitle: 'B. Subnet LAN IP Publik Enterprise: Prefix /29 (8 IP Total, 6 Usable / 5 Client)',
        badge: 'Standar Blok IP Astinet',
        points: [
          'Total IP: 8 | Subnet Mask: `255.255.255.248`',
          'Contoh Alokasi Telkom: `180.250.20.0/29`',
          '• **Network ID**: `180.250.20.0`',
          '• **IP Gateway LAN Publik (Interface MikroTik)**: `180.250.20.1`',
          '• **IP Tersedia untuk Server Pelanggan**: `180.250.20.2` s/d `180.250.20.6` (5 IP Publik)',
          '• **Broadcast**: `180.250.20.7`'
        ],
        codeBlock: `/ip address add address=180.250.20.1/29 interface=ether2-LAN-PUBLIC comment="Gateway LAN IP Public"`
      },
      {
        subtitle: 'C. Tabel Cepat Subnetting Enterprise (Cheat Sheet CIDR)',
        points: [
          '• **/30** -> Mask `255.255.255.252` -> Total 4 IP -> **2 Usable** (Point-to-Point WAN)',
          '• **/29** -> Mask `255.255.255.248` -> Total 8 IP -> **6 Usable** (5 Host + 1 Gateway)',
          '• **/28** -> Mask `255.255.255.240` -> Total 16 IP -> **14 Usable** (13 Host + 1 Gateway)',
          '• **/27** -> Mask `255.255.255.224` -> Total 32 IP -> **30 Usable** (29 Host + 1 Gateway)',
          '• **/24** -> Mask `255.255.255.0` -> Total 256 IP -> **254 Usable** (Standar LAN / WMS Pool)',
          '• **/22** -> Mask `255.255.252.0` -> Total 1024 IP -> **1022 Usable** (WMS Area Publik / Event Besar)'
        ]
      }
    ]
  },
  {
    id: 'mikrotik-ip-config',
    title: '3. Panduan Praktek Konfigurasi IP di MikroTik RouterOS',
    icon: 'Cpu',
    description: 'Langkah praktis setup pengalamatan IP, routing, DNS, dan NAT di MikroTik untuk koneksi link Telkom.',
    content: [
      {
        subtitle: 'Langkah 1: Memasang IP Address pada Interface',
        points: [
          'Gunakan perintah CLI atau menu Winbox: **IP -> Addresses -> Add (+)**',
          'Pastikan menyertakan prefix slash (misal `/30` atau `/24`). Jika lupa memasukkan slash, MikroTik otomatis menganggap `/32` (1 IP saja) sehingga koneksi tidak akan jalan!'
        ],
        codeBlock: `# Setting IP WAN Astinet
/ip address add address=180.250.10.6/30 interface=ether1-WAN comment="WAN Telkom"

# Setting IP LAN Lokal Privat
/ip address add address=192.168.10.1/24 interface=ether2-LAN comment="Gateway LAN Kantor"`
      },
      {
        subtitle: 'Langkah 2: Menentukan Default Gateway (Routing 0.0.0.0/0)',
        points: [
          'Default Route `0.0.0.0/0` berfungsi mengarahkan semua lalu lintas yang tujuannya tidak diketahui ke router Telkom (PE Router).',
          'Menu Winbox: **IP -> Routes -> Add (+)**, `Dst. Address: 0.0.0.0/0`, `Gateway: [IP PE Telkom]`.'
        ],
        codeBlock: `/ip route add dst-address=0.0.0.0/0 gateway=180.250.10.5 check-gateway=ping comment="Default Route Internet"`
      },
      {
        subtitle: 'Langkah 3: Konfigurasi DNS Server & Cache',
        points: [
          'Gunakan kombinasi DNS Telkom dan Public DNS (Google / Cloudflare) untuk redundansi.',
          'Aktifkan `Allow Remote Requests` jika MikroTik dijadikan DNS resolver untuk client LAN.'
        ],
        codeBlock: `/ip dns set servers=202.134.0.155,202.134.1.10,8.8.8.8,1.1.1.1 allow-remote-requests=yes cache-size=4096KiB`
      },
      {
        subtitle: 'Langkah 4: Konfigurasi NAT (Masquerade & Port Forwarding)',
        badge: 'Wajib untuk Internet',
        points: [
          '**Masquerade (Src-NAT)**: Mengubah IP Privat LAN pelanggan menjadi IP Publik WAN saat keluar ke internet.',
          '**Port Forwarding (Dst-NAT)**: Meneruskan akses dari internet (IP Publik) ke server lokal / CCTV di LAN (misal: Port 80, 443, 8000, 3389).'
        ],
        codeBlock: `# 1. NAT Masquerade untuk semua client LAN
/ip firewall nat add chain=srcnat out-interface=ether1-WAN action=masquerade comment="NAT Internet"

# 2. Port Forwarding Web Server Lokal (IP 192.168.10.10 Port 80)
/ip firewall nat add chain=dstnat in-interface=ether1-WAN protocol=tcp dst-port=80 action=dst-nat to-addresses=192.168.10.10 to-ports=80 comment="Web Server"

# 3. Port Forwarding DVR CCTV (IP 192.168.10.50 Port 8000 & 554)
/ip firewall nat add chain=dstnat in-interface=ether1-WAN protocol=tcp dst-port=8000 action=dst-nat to-addresses=192.168.10.50 to-ports=8000 comment="CCTV DVR"`
      }
    ]
  },
  {
    id: 'dhcp-wms-config',
    title: '4. Konfigurasi DHCP Server & Pool untuk WMS / Hotspot',
    icon: 'Wifi',
    description: 'Panduan setting alokasi IP dinamis otomatis untuk Access Point dan ribuan user Wi-Fi tamu / WMS.',
    content: [
      {
        subtitle: 'Setup IP Pool & DHCP Server di MikroTik',
        points: [
          'Tentukan rentang IP yang akan dibagikan (misal `172.16.20.10` s/d `172.16.23.250` pada subnet `/22` untuk kapasitas 1000 user).',
          '**Lease Time**: Untuk area publik (Cafe, Event, Mall), atur Lease Time pendek (`01:00:00` atau `00:30:00`) agar IP yang sudah tidak terpakai cepat dilepas dan tidak habis (IP Pool Exhaustion).'
        ],
        codeBlock: `# 1. Buat IP Pool
/ip pool add name=pool-wms ranges=172.16.20.10-172.16.23.250

# 2. Buat DHCP Server di Interface VLAN WMS
/ip dhcp-server add name=dhcp-wms interface=vlan20-wms address-pool=pool-wms lease-time=01:00:00 disabled=no

# 3. Setting DHCP Network (Gateway & DNS untuk client)
/ip dhcp-server network add address=172.16.20.0/22 gateway=172.16.20.1 dns-server=202.134.0.155,8.8.8.8 comment="DHCP Network WMS"`
      }
    ]
  },
  {
    id: 'ip-troubleshooting',
    title: '5. Troubleshooting Masalah IP & Routing Lapangan',
    icon: 'AlertTriangle',
    description: 'Penyebab dan solusi kendala IP yang paling sering ditemui teknisi EOS di lapangan.',
    content: [
      {
        subtitle: 'A. IP Conflict / Tabrakan IP',
        points: [
          '**Gejala**: Internet putus-nyambung (flapping), ping ke gateway request time out berselang, status ARP berkedip-kedip.',
          '**Penyebab**: Ada 2 perangkat di jaringan LAN yang dipasang IP yang sama secara statis.',
          '**Solusi EOS**: Cek tabel ARP di MikroTik (`/ip arp print`). Perhatikan IP yang duplicate MAC address-nya. Lakukan isolasi port switch atau ubah IP salah satu perangkat.'
        ],
        codeBlock: `/ip arp print where complete=yes`
      },
      {
        subtitle: 'B. Website Tertentu Tidak Bisa Dibuka (MTU / MSS Clamping Issue)',
        badge: 'Solusi Penting',
        points: [
          '**Gejala**: Ping ke `8.8.8.8` dan `google.com` normal respon 15ms, tetapi browsing website perbankan / portal HTTPS tertentu loading berputar terus (*spinning*) atau error timeout.',
          '**Penyebab**: Terjadi fragmentasi paket TCP karena overhead VLAN / PPPoE / MPLS (MTU melewati 1500 byte).',
          '**Solusi EOS**: Pasang aturan Change TCP MSS Clamping di Firewall Mangle MikroTik.'
        ],
        codeBlock: `/ip firewall mangle add chain=forward protocol=tcp tcp-flags=syn action=change-mss new-mss=clamp-to-pmtu comment="Fix MTU MSS Clamping Browsing Issue"`
      },
      {
        subtitle: 'C. Default Gateway "Unreachable" / Status Inactive',
        points: [
          '**Gejala**: Pada `/ip route print`, route `0.0.0.0/0` berwarna biru atau bertuliskan status `unreachable`.',
          '**Penyebab**: Interface WAN mati (Link Down), kabel LAN lepas, atau IP WAN belum satu subnet dengan IP Gateway Telkom.',
          '**Solusi EOS**: Pastikan link fisik ether1 berstatus `R` (Running), cek IP Address di ether1 apakah sudah terpasang subnet `/30` dengan benar.'
        ]
      }
    ]
  }
];

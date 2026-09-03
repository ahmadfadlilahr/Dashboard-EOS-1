import React, { useState } from 'react';
import { 
  Binary, 
  Copy, 
  Check, 
  Terminal
} from 'lucide-react';

export const SubnetCalc: React.FC = () => {
  const [ipInput, setIpInput] = useState('180.250.10.6');
  const [cidrPrefix, setCidrPrefix] = useState<number>(30);
  const [copiedScript, setCopiedScript] = useState(false);

  // Helper functions for IP calculation
  const ipToLong = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
  };

  const longToIp = (long: number): string => {
    return [
      (long >>> 24) & 255,
      (long >>> 16) & 255,
      (long >>> 8) & 255,
      long & 255
    ].join('.');
  };

  const calculateSubnet = () => {
    try {
      const parts = ipInput.trim().split('.');
      if (parts.length !== 4 || parts.some(p => isNaN(parseInt(p, 10)) || parseInt(p, 10) < 0 || parseInt(p, 10) > 255)) {
        return null;
      }

      const ipLong = ipToLong(ipInput.trim());
      const maskLong = (cidrPrefix === 0 ? 0 : (~0 << (32 - cidrPrefix))) >>> 0;
      const wildcardLong = (~maskLong) >>> 0;

      const networkLong = (ipLong & maskLong) >>> 0;
      const broadcastLong = (networkLong | wildcardLong) >>> 0;

      const totalHosts = Math.pow(2, 32 - cidrPrefix);
      let usableHosts = totalHosts > 2 ? totalHosts - 2 : (totalHosts === 2 ? 2 : 1);

      let firstHostLong = networkLong + 1;
      let lastHostLong = broadcastLong - 1;

      if (cidrPrefix === 31) {
        firstHostLong = networkLong;
        lastHostLong = broadcastLong;
        usableHosts = 2;
      } else if (cidrPrefix === 32) {
        firstHostLong = networkLong;
        lastHostLong = networkLong;
        usableHosts = 1;
      }

      return {
        ip: ipInput.trim(),
        prefix: cidrPrefix,
        network: longToIp(networkLong),
        broadcast: longToIp(broadcastLong),
        netmask: longToIp(maskLong),
        wildcard: longToIp(wildcardLong),
        firstUsable: longToIp(firstHostLong),
        lastUsable: longToIp(lastHostLong),
        gatewaySuggestion: longToIp(firstHostLong),
        customerIpSuggestion: longToIp(firstHostLong + 1 <= lastHostLong ? firstHostLong + 1 : firstHostLong),
        totalHosts,
        usableHosts,
      };
    } catch (e) {
      return null;
    }
  };

  const result = calculateSubnet();

  const generateMikrotikScript = () => {
    if (!result) return '';
    if (result.prefix === 30) {
      return `# Konfigurasi IP WAN Astinet Point-to-Point di MikroTik
/ip address add address=${result.customerIpSuggestion}/30 interface=ether1-WAN comment="WAN Astinet Telkom"
/ip route add dst-address=0.0.0.0/0 gateway=${result.gatewaySuggestion} check-gateway=ping comment="Gateway Telkom PE"
/ip dns set servers=202.134.0.155,202.134.1.10,8.8.8.8 allow-remote-requests=yes`;
    }
    return `# Konfigurasi Blok Subnet di MikroTik
/ip address add address=${result.firstUsable}/${result.prefix} interface=ether2-LAN comment="Gateway LAN Subnet"
/ip pool add name=pool-custom ranges=${result.firstUsable === result.lastUsable ? result.firstUsable : longToIp(ipToLong(result.firstUsable) + 1) + '-' + result.lastUsable}`;
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generateMikrotikScript());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-6">
      
      <div>
        <h3 className="text-base font-semibold text-gray-900">Subnet Calculator</h3>
        <p className="text-xs text-gray-500">Alokasi IP, gateway, usable range & script MikroTik</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        <div className="md:col-span-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            IP Address:
          </label>
          <input
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="Contoh: 180.250.10.6"
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Subnet Prefix CIDR: <span className="font-mono text-gray-500 font-normal">/{cidrPrefix}</span>
          </label>
          <select
            value={cidrPrefix}
            onChange={(e) => setCidrPrefix(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          >
            <option value={30}>/30 (255.255.255.252) - 2 Usable IP (Point-to-Point WAN)</option>
            <option value={29}>/29 (255.255.255.248) - 6 Usable IP (Blok LAN Astinet 5 Host)</option>
            <option value={28}>/28 (255.255.255.240) - 14 Usable IP (13 Host)</option>
            <option value={27}>/27 (255.255.255.224) - 30 Usable IP (29 Host)</option>
            <option value={26}>/26 (255.255.255.192) - 62 Usable IP</option>
            <option value={25}>/25 (255.255.255.128) - 126 Usable IP</option>
            <option value={24}>/24 (255.255.255.0) - 254 Usable IP (Standard Office LAN)</option>
            <option value={23}>/23 (255.255.254.0) - 510 Usable IP</option>
            <option value={22}>/22 (255.255.252.0) - 1022 Usable IP (WMS Public Area Pool)</option>
          </select>
        </div>

      </div>

      {/* Quick Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-gray-500 shrink-0 font-medium">Preset Cepat:</span>
        <button
          onClick={() => { setIpInput('180.250.10.6'); setCidrPrefix(30); }}
          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-700 border border-gray-200 transition-colors"
        >
          /30 WAN Astinet
        </button>
        <button
          onClick={() => { setIpInput('180.250.20.1'); setCidrPrefix(29); }}
          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-700 border border-gray-200 transition-colors"
        >
          /29 LAN Blok Publik
        </button>
        <button
          onClick={() => { setIpInput('192.168.10.1'); setCidrPrefix(24); }}
          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-700 border border-gray-200 transition-colors"
        >
          /24 LAN Kantor
        </button>
        <button
          onClick={() => { setIpInput('172.16.20.1'); setCidrPrefix(22); }}
          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-mono text-gray-700 border border-gray-200 transition-colors"
        >
          /22 WMS Pool
        </button>
      </div>

      {/* Calculation Results */}
      {result ? (
        <div className="space-y-4">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Network ID</span>
              <span className="text-sm font-mono font-medium text-emerald-600">{result.network}</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Subnet Mask</span>
              <span className="text-sm font-mono font-medium text-blue-600">{result.netmask}</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Gateway Telkom (PE)</span>
              <span className="text-sm font-mono font-medium text-amber-600">{result.gatewaySuggestion}</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-xs font-semibold text-gray-500 block mb-1">Broadcast ID</span>
              <span className="text-sm font-mono font-medium text-rose-600">{result.broadcast}</span>
            </div>

          </div>

          {/* Usable Range Card */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900 font-semibold">Rentang IP Host yang Boleh Dipakai:</span>
              <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-mono text-xs">
                {result.usableHosts} Usable Hosts
              </span>
            </div>
            <p className="font-mono text-sm text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
              {result.firstUsable} <span className="text-gray-400">s/d</span> {result.lastUsable}
            </p>
          </div>

          {/* Script Output Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-700" />
                Script MikroTik Siap Pakai
              </span>
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
              >
                {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? 'Tersalin' : 'Salin Script'}</span>
              </button>
            </div>
            <pre className="p-3 bg-gray-900 rounded-lg text-sm font-mono text-gray-100 overflow-x-auto">
              {generateMikrotikScript()}
            </pre>
          </div>

        </div>
      ) : (
        <p className="text-sm text-rose-600 font-mono">Format IP Address tidak valid. Harap masukkan IP yang benar (contoh: 180.250.10.6).</p>
      )}

    </div>
  );
};

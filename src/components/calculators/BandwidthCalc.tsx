import React, { useState } from 'react';
import { 
  Activity, 
  Copy, 
  Check, 
  Zap, 
  Cpu
} from 'lucide-react';

export const BandwidthCalc: React.FC = () => {
  const [mbpsValue, setMbpsValue] = useState<number>(50);
  const [targetSubnet, setTargetSubnet] = useState('192.168.10.0/24');
  const [queueName, setQueueName] = useState('Limit-Astinet-Office');
  const [copiedQueue, setCopiedQueue] = useState(false);
  const [copiedMss, setCopiedMss] = useState(false);

  // Bandwidth conversions
  const kbps = mbpsValue * 1000;
  const megaBytesPerSec = (mbpsValue / 8).toFixed(2);
  const gigabytesPerHour = ((mbpsValue / 8) * 3600 / 1024).toFixed(2);

  const generateSimpleQueue = () => {
    return `/queue simple add name="${queueName}" target=${targetSubnet} max-limit=${mbpsValue}M/${mbpsValue}M limit-at=${Math.floor(mbpsValue * 0.8)}M/${Math.floor(mbpsValue * 0.8)}M priority=8/8 comment="EOS Bandwidth Management"`;
  };

  const generateMssMangle = () => {
    return `/ip firewall mangle add chain=forward protocol=tcp tcp-flags=syn action=change-mss new-mss=clamp-to-pmtu comment="Fix MTU MSS Clamping Browsing Issue"
/ip firewall mangle add chain=output protocol=tcp tcp-flags=syn action=change-mss new-mss=clamp-to-pmtu comment="Fix Router Local MSS"`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-6">
      
      <div>
        <h3 className="text-base font-semibold text-gray-900">Bandwidth & Queue Helper</h3>
        <p className="text-xs text-gray-500">Konversi throughput, Simple Queue & MTU clamping</p>
      </div>

      {/* Converter Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Input (4 cols) */}
        <div className="md:col-span-4 space-y-3">
          <label className="block text-sm font-semibold text-gray-900">
            Kapasitas Bandwidth Langganan:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10000"
              value={mbpsValue}
              onChange={(e) => setMbpsValue(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-base font-mono font-medium text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
            />
            <span className="font-mono text-sm text-gray-500 font-medium">Mbps</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {[10, 20, 50, 100, 200, 500, 1000].map((val) => (
              <button
                key={val}
                onClick={() => setMbpsValue(val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  mbpsValue === val
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {val}M
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Cards (8 cols) */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
            <span className="text-xs font-semibold text-gray-500">Kilobits / detik</span>
            <p className="text-sm font-mono font-medium text-gray-900">{kbps.toLocaleString()} Kbps</p>
            <span className="text-xs text-gray-400">Nilai bit rate</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
            <span className="text-xs font-semibold text-gray-500">Kecepatan Download Nyata</span>
            <p className="text-sm font-mono font-medium text-gray-900">{megaBytesPerSec} MB/s</p>
            <span className="text-xs text-gray-400">Megabytes per detik</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
            <span className="text-xs font-semibold text-gray-500">Transfer Data Maksimal</span>
            <p className="text-sm font-mono font-medium text-gray-900">{gigabytesPerHour} GB / Jam</p>
            <span className="text-xs text-gray-400">Kapasitas volume per jam</span>
          </div>

        </div>

      </div>

      {/* Generator Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        
        {/* Simple Queue Generator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gray-700" />
              Generator Simple Queue MikroTik
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateSimpleQueue());
                setCopiedQueue(true);
                setTimeout(() => setCopiedQueue(false), 2000);
              }}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              {copiedQueue ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedQueue ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-xs text-gray-700 font-medium block mb-1">Nama Queue:</label>
              <input
                type="text"
                value={queueName}
                onChange={(e) => setQueueName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm font-mono focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-700 font-medium block mb-1">Target IP / Subnet:</label>
              <input
                type="text"
                value={targetSubnet}
                onChange={(e) => setTargetSubnet(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm font-mono focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <pre className="p-3 bg-gray-900 rounded-lg text-sm font-mono text-gray-100 overflow-x-auto">
            {generateSimpleQueue()}
          </pre>
        </div>

        {/* MTU & MSS Clamping Solver */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-700" />
              Fix MTU MSS Clamping
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateMssMangle());
                setCopiedMss(true);
                setTimeout(() => setCopiedMss(false), 2000);
              }}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              {copiedMss ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedMss ? 'Tersalin' : 'Salin Rule'}</span>
            </button>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Gunakan rule firewall mangle ini di MikroTik jika pelanggan mengeluhkan bisa ping namun browsing website https perbankan/portal tertentu gagal (timeout):
          </p>

          <pre className="p-3 bg-gray-900 rounded-lg text-sm font-mono text-gray-100 overflow-x-auto">
            {generateMssMangle()}
          </pre>
        </div>

      </div>

    </div>
  );
};

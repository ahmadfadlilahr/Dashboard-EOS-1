import React, { useState } from 'react';
import { 
  Gauge, 
  Info
} from 'lucide-react';

export const OpticalGauge: React.FC = () => {
  const [rxDbm, setRxDbm] = useState<number>(-19.5);
  const [txDbm, setTxDbm] = useState<number>(2.5);

  const getRxHealth = (val: number) => {
    if (val > -8) {
      return {
        status: 'OVERLOAD (Terlalu Kuat / Silau)',
        level: 'danger',
        color: 'text-rose-600',
        bg: 'bg-rose-50 border-rose-200',
        barColor: 'bg-rose-500',
        description: 'Daya optik terlalu tinggi (berada sangat dekat dengan OLT tanpa attenuator). Berisiko merusak receiver photodiode ONT/SFP.',
        recommendation: 'Pasang Optical Attenuator 5dB - 10dB di OTB/Roset.'
      };
    }
    if (val >= -24) {
      return {
        status: 'NORMAL & OPTIMAL (Bagus)',
        level: 'good',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-500',
        description: 'Sinyal optik sangat prima sesuai standar GPON Telkom Indonesia (-8 dBm s/d -24 dBm). Link stabil bebas packet loss.',
        recommendation: 'Kondisi fisik serat optik dan splicing bagus. Siap untuk layanan Astinet/VPN IP.'
      };
    }
    if (val >= -27) {
      return {
        status: 'MARGINAL (Waspada / Kritis)',
        level: 'warning',
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
        description: 'Sinyal optik mendekati batas sensitivitas receiver. Rentan terjadi flapping / putus-nyambung saat hujan atau perubahan suhu kabel.',
        recommendation: 'Inspeksi konektor SC-UPC/APC (bersihkan debu), periksa lekukan kabel (bending) pada dropcore/roset.'
      };
    }
    return {
      status: 'HIGH LOSS / LOS (Rusak / Putus)',
      level: 'danger',
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
      barColor: 'bg-rose-500',
      description: 'Sinyal optik di bawah ambang batas deteksi ONT (< -27 dBm). Lampu LOS akan berkedip merah dan link mati total.',
      recommendation: 'Ukur laser dengan VFL Pen / OPM dari ODP ke Roset. Ganti patchcord optik atau lakukan re-splicing dropcore.'
    };
  };

  const health = getRxHealth(rxDbm);

  // Calculate percentage on gauge range -40 dBm (0%) to 0 dBm (100%)
  const gaugePercent = Math.min(Math.max(((rxDbm + 40) / 40) * 100, 0), 100);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-6">
      
      <div>
        <h3 className="text-base font-semibold text-gray-900">Optical Power Gauge</h3>
        <p className="text-xs text-gray-500">Analisis redaman Rx/Tx serat optik GPON</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-gray-900 mb-2">
              <span>Rx Optical Power (Redaman Masuk):</span>
              <span className="font-mono text-red-600">{rxDbm} dBm</span>
            </label>
            
            <input
              type="range"
              min="-38"
              max="-5"
              step="0.1"
              value={rxDbm}
              onChange={(e) => setRxDbm(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />

            <div className="flex items-center justify-between text-xs text-gray-500 mt-1 font-mono">
              <span>-38</span>
              <span>-24</span>
              <span>-5</span>
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-gray-900 mb-2">
              <span>Tx Optical Power (Laser Keluar ONT):</span>
              <span className="font-mono text-blue-600">+{txDbm} dBm</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={txDbm}
              onChange={(e) => setTxDbm(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-xs text-gray-500 font-mono block mt-1">Tx Normal: +1.5 dBm s/d +3.5 dBm</span>
          </div>

          {/* Quick preset buttons */}
          <div className="pt-2">
            <span className="text-xs text-gray-500 block mb-2 font-medium">Uji Nilai Cepat:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setRxDbm(-18.2)}
                className="px-2 py-1.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 text-xs font-mono hover:bg-gray-200 transition-colors"
              >
                -18.2 (Bagus)
              </button>
              <button
                onClick={() => setRxDbm(-26.4)}
                className="px-2 py-1.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 text-xs font-mono hover:bg-gray-200 transition-colors"
              >
                -26.4 (Marginal)
              </button>
              <button
                onClick={() => setRxDbm(-31.5)}
                className="px-2 py-1.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 text-xs font-mono hover:bg-gray-200 transition-colors"
              >
                -31.5 (High Loss)
              </button>
            </div>
          </div>

        </div>

        {/* Visual Meter & Status (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Health Card */}
          <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-sm font-semibold text-gray-900">
                Status Diagnosa Redaman
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${health.color} ${health.bg}`}>
                {health.status}
              </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {health.description}
            </p>

            <div className="pt-2 text-sm text-gray-700">
              <strong className="text-gray-900">Rekomendasi Tindakan EOS: </strong>
              {health.recommendation}
            </div>
          </div>

          {/* Graphical Reference Scale */}
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
            <span className="text-sm font-semibold text-gray-900">Standar Redaman GPON Telkom Indonesia</span>
            
            <div className="h-4 w-full bg-gray-200 rounded-lg overflow-hidden flex relative border border-gray-300">
              <div style={{ width: '30%' }} className="bg-rose-500/80" title="High Loss (< -28)" />
              <div style={{ width: '10%' }} className="bg-amber-500/80" title="Marginal (-25 s/d -27)" />
              <div style={{ width: '45%' }} className="bg-emerald-500/80" title="Normal (-8 s/d -24)" />
              <div style={{ width: '15%' }} className="bg-rose-500/80" title="Overload (> -8)" />
            </div>

            <div className="flex justify-between text-xs text-gray-500 font-mono">
              <span>-40</span>
              <span>-28</span>
              <span>-24</span>
              <span>-8</span>
              <span>0</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

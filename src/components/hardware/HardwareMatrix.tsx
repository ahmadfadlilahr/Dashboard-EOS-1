import React, { useState } from 'react';
import { 
  Server, 
  Search, 
  Radio
} from 'lucide-react';
import { HARDWARE_MATRIX } from '../../data/hardwareMatrix';
import { HardwareInfo } from '../../types';

export const HardwareMatrix: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedHardware, setSelectedHardware] = useState<HardwareInfo>(HARDWARE_MATRIX[0]);

  const categories = ['ALL', 'ONT/Modem', 'Router CPE', 'Access Point / WMS', 'Optical & Fisik'];

  const filteredHardware = HARDWARE_MATRIX.filter((hw) => {
    const matchesCat = selectedCategory === 'ALL' || hw.category === selectedCategory;
    const matchesSearch =
      hw.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.keyFunctions.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-lg bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Server className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Hardware & Field Device
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Panduan ONT, Router, Access Point & perangkat optik
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ZTE, Huawei, MikroTik, SFP..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat === 'ALL' ? 'Semua Perangkat' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Device Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredHardware.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">Tidak ada hasil untuk "{searchQuery}"</p>
              <p className="text-xs mt-1">Coba kata kunci yang berbeda</p>
            </div>
          )}
          {filteredHardware.map((hw) => {
            const isSelected = selectedHardware.id === hw.id;
            return (
              <div
                key={hw.id}
                onClick={() => setSelectedHardware(hw)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {hw.category}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {hw.brand}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900">
                  {hw.model}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {hw.specs}
                </p>
              </div>
            );
          })}
        </div>

        {/* Device Detail (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {selectedHardware.category}
                </span>
                <span className="text-sm text-gray-500">
                  Brand: <strong className="text-gray-900">{selectedHardware.brand}</strong>
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedHardware.model}
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                {selectedHardware.specs}
              </p>
            </div>

            {/* Login & Access Details */}
            {selectedHardware.defaultIp !== 'N/A' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-semibold text-gray-900 block mb-1">
                    Default IP Gateway Web GUI
                  </span>
                  <p className="text-sm font-mono text-gray-700">{selectedHardware.defaultIp}</p>
                </div>

                <div>
                  <span className="text-sm font-semibold text-gray-900 block mb-1">
                    Default Credential Login
                  </span>
                  <p className="text-sm font-mono text-gray-700">{selectedHardware.defaultLogin}</p>
                </div>
              </div>
            )}

            {/* Step-by-Step Config Instructions */}
            <div className="space-y-4">
              {selectedHardware.stepByStepConfig.map((configBlock, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {configBlock.title}
                  </h4>
                  <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside leading-relaxed">
                    {configBlock.steps.map((st, sIdx) => (
                      <li key={sIdx} className="pl-1">
                        <span>{st}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            {/* LED Status Guide */}
            {selectedHardware.indicatorsGuide && selectedHardware.indicatorsGuide.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-gray-500" />
                  Arti Lampu Indikator LED & Solusi Lapangan
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-3">LED</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Arti / Kondisi</th>
                        <th className="p-3">Tindakan EOS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedHardware.indicatorsGuide.map((ind, iIdx) => (
                        <tr key={iIdx} className="hover:bg-gray-50">
                          <td className="p-3 font-medium text-gray-900">{ind.led}</td>
                          <td className="p-3 text-gray-700">{ind.status}</td>
                          <td className="p-3 text-gray-700">{ind.meaning}</td>
                          <td className="p-3 text-gray-700">{ind.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

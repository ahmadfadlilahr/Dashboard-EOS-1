import React, { useState } from 'react';
import { 
  Gauge, 
  Binary, 
  Activity
} from 'lucide-react';
import { OpticalGauge } from './OpticalGauge';
import { SubnetCalc } from './SubnetCalc';
import { BandwidthCalc } from './BandwidthCalc';

export const NetworkToolsHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'optic' | 'subnet' | 'bandwidth'>('optic');

  return (
    <div className="space-y-6">
      
      {/* Top Selector Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveSubTab('optic')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-all ${
              activeSubTab === 'optic'
                ? 'border-red-600 text-gray-900 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Gauge className={`w-4 h-4 ${activeSubTab === 'optic' ? 'text-red-600' : 'text-gray-400'}`} />
            <span>Optical Power Gauge (dBm)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('subnet')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-all ${
              activeSubTab === 'subnet'
                ? 'border-red-600 text-gray-900 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Binary className={`w-4 h-4 ${activeSubTab === 'subnet' ? 'text-red-600' : 'text-gray-400'}`} />
            <span>Subnet & CIDR Visualizer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('bandwidth')}
            className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-all ${
              activeSubTab === 'bandwidth'
                ? 'border-red-600 text-gray-900 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className={`w-4 h-4 ${activeSubTab === 'bandwidth' ? 'text-red-600' : 'text-gray-400'}`} />
            <span>Bandwidth & Simple Queue</span>
          </button>
        </nav>
      </div>

      {/* Dynamic Sub Tab Display */}
      {activeSubTab === 'optic' && <OpticalGauge />}
      {activeSubTab === 'subnet' && <SubnetCalc />}
      {activeSubTab === 'bandwidth' && <BandwidthCalc />}

    </div>
  );
};

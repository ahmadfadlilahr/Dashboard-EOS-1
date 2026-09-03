import React, { useState } from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  Copy, 
  Check, 
  Terminal, 
  Search,
  HelpCircle
} from 'lucide-react';
import { TROUBLESHOOTING_FLOWS } from '../../data/troubleshootingTree';
import { TroubleshootingStep } from '../../types';

export const TroubleshootingTree: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlow, setSelectedFlow] = useState<TroubleshootingStep>(TROUBLESHOOTING_FLOWS[0]);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const filteredFlows = TROUBLESHOOTING_FLOWS.filter((flow) =>
    flow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flow.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flow.diagnosticFlow.some((d) => d.action.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopyCmd = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 rounded-lg bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <GitFork className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Troubleshooting Decision Tree
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Alur diagnosa bertahap dari Layer 1 hingga eskalasi ROC
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
            placeholder="Cari alur LOS, flapping, WMS..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Flow Selector Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 px-1">
            Kategori Gejala Gangguan
          </h3>

          <div className="space-y-2">
            {filteredFlows.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">Tidak ada hasil untuk "{searchQuery}"</p>
                <p className="text-xs mt-1">Coba kata kunci yang berbeda</p>
              </div>
            )}
            {filteredFlows.map((flow) => {
              const isSelected = selectedFlow.id === flow.id;
              return (
                <div
                  key={flow.id}
                  onClick={() => setSelectedFlow(flow)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gray-50 border-gray-300 text-gray-900'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {flow.category}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        flow.severity === 'Critical'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {flow.severity}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-900">
                    {flow.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {flow.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Steps Tree (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {selectedFlow.category}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  Severity: {selectedFlow.severity}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedFlow.title}
              </h3>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                {selectedFlow.summary}
              </p>
            </div>

            {/* Initial Check Checklist */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-500" />
                Pemeriksaan Awal (Quick Checklist):
              </span>
              <ul className="space-y-2 text-sm text-gray-700">
                {selectedFlow.initialCheck.map((chk, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>{chk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diagnostic Flow Steps */}
            <div className="space-y-4">
              <span className="text-sm font-semibold text-gray-900 block">
                Langkah Eksekusi Diagnosa Bertahap (Decision Flow):
              </span>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
                {selectedFlow.diagnosticFlow.map((step, sIdx) => (
                  <div key={sIdx} className="relative pl-8 space-y-2">
                    
                    {/* Node Dot */}
                    <div className="absolute left-1.5 top-2 w-4 h-4 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {step.phase}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700">
                        {step.action}
                      </p>

                      {step.commandOrTool && (
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="font-mono text-gray-500 flex items-center gap-1">
                              <Terminal className="w-3.5 h-3.5" /> Perintah / Tool:
                            </span>
                            <button
                              onClick={() => handleCopyCmd(`${selectedFlow.id}-${sIdx}`, step.commandOrTool!)}
                              className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
                            >
                              {copiedCmd === `${selectedFlow.id}-${sIdx}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600">Tersalin</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-3 bg-gray-900 rounded-lg text-sm font-mono text-gray-100 overflow-x-auto">
                            {step.commandOrTool}
                          </pre>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2">
                        <div className="p-3 bg-white border-y border-r border-l-2 border-gray-200 border-l-emerald-500 rounded text-gray-800">
                          <strong className="block text-xs font-semibold text-gray-900 mb-1">Hasil yang Diharapkan:</strong>
                          <span>{step.expectedResult}</span>
                        </div>
                        <div className="p-3 bg-white border-y border-r border-l-2 border-gray-200 border-l-rose-500 rounded text-gray-800">
                          <strong className="block text-xs font-semibold text-gray-900 mb-1">Jika Gagal / Tidak Sesuai:</strong>
                          <span>{step.ifFailed}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escalation Matrix */}
            <div className="pt-4 border-t border-gray-200">
              <strong className="text-sm font-semibold text-gray-900 block mb-2">Alur Eskalasi Lanjutan (Escalation Matrix):</strong>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedFlow.escalationMatrix}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

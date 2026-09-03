import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  Copy, 
  Check
} from 'lucide-react';
import { MIKROTIK_CHEATSHEET } from '../../data/mikrotikCheatSheet';

export const CliCheatSheet: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const filteredGroups = MIKROTIK_CHEATSHEET.map((group) => ({
    ...group,
    commands: group.commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((group) => group.commands.length > 0);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-gray-700" />
            MikroTik CLI Cheat Sheet
          </h2>
          <p className="text-sm text-gray-500">
            Perintah diagnosa, konfigurasi & monitoring RouterOS
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari perintah torch, bgp, vlan..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Cheat Sheet Sections */}
      <div className="space-y-6">
        {filteredGroups.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">Tidak ada hasil untuk "{searchQuery}"</p>
            <p className="text-xs mt-1">Coba kata kunci yang berbeda</p>
          </div>
        )}
        {filteredGroups.map((group, gIdx) => (
          <div key={gIdx} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4">
            
            <div className="pb-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {group.category}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">{group.description}</p>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {group.commands.length} Commands
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.commands.map((cmd, cIdx) => {
                const uniqueId = `${gIdx}-${cIdx}`;
                return (
                  <div
                    key={cIdx}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 space-y-2.5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {cmd.name}
                      </h4>
                      <button
                        onClick={() => handleCopy(uniqueId, cmd.command)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 shrink-0"
                        title="Salin perintah"
                      >
                        {copiedIndex === uniqueId ? (
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

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {cmd.description}
                    </p>

                    <pre className="p-2.5 bg-gray-900 rounded-lg text-xs font-mono text-gray-200 overflow-x-auto border border-gray-800 leading-relaxed whitespace-pre-wrap">
                      {cmd.command}
                    </pre>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

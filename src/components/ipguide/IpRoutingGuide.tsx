import React, { useState } from 'react';
import { 
  Binary, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  BookOpen,
  Terminal
} from 'lucide-react';
import { IP_MASTER_GUIDE } from '../../data/ipMasterGuide';

export const IpRoutingGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>(IP_MASTER_GUIDE[0].id);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const filteredSections = IP_MASTER_GUIDE.filter((sec) =>
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.content.some((c) =>
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.points.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const activeData = IP_MASTER_GUIDE.find((s) => s.id === selectedSection) || IP_MASTER_GUIDE[0];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 rounded-lg bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Panduan IP & Routing
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pengalamatan, subnetting, NAT, DHCP & konfigurasi MikroTik
            </p>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari konsep IP, /30, NAT..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Nav List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 px-1">
            Topik Pembelajaran & Referensi
          </h3>

          <div className="space-y-2">
            {filteredSections.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">Tidak ada hasil untuk "{searchQuery}"</p>
                <p className="text-xs mt-1">Coba kata kunci yang berbeda</p>
              </div>
            )}
            {filteredSections.map((sec) => {
              const isSelected = selectedSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSection(sec.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-gray-100 border-gray-200 border-l-2 !border-l-red-600 text-gray-900'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Binary className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-red-600' : 'text-gray-400'}`} />
                  <div>
                    <h4 className={`text-sm font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                      {sec.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {sec.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Content (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-6">
            
            {/* Section Header */}
            <div className="pb-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-600" />
                {activeData.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {activeData.description}
              </p>
            </div>

            {/* Sub-blocks */}
            <div className="space-y-6">
              {activeData.content.map((block, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gray-50 border-l-2 border-l-red-600 border-y border-r border-gray-200 space-y-3">
                  
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {block.subtitle}
                    </h4>
                    {block.badge && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {block.badge}
                      </span>
                    )}
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
                    {block.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5 shrink-0">•</span>
                        <div className="flex-1" dangerouslySetInnerHTML={{ 
                          __html: pt.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>').replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded font-mono text-xs border border-gray-200">$1</code>')
                        }} />
                      </li>
                    ))}
                  </ul>

                  {/* Code block if any */}
                  {block.codeBlock && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Terminal className="w-3.5 h-3.5" /> Script MikroTik:
                        </span>
                        <button
                          onClick={() => handleCopyCode(`${activeData.id}-${idx}`, block.codeBlock!)}
                          className="flex items-center gap-1 text-gray-500 hover:text-gray-900"
                        >
                          {copiedBlock === `${activeData.id}-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Script</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 bg-gray-900 rounded-lg text-sm font-mono text-gray-100 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                        {block.codeBlock}
                      </pre>
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

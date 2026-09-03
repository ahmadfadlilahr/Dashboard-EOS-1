import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  CheckCircle2, 
  Network
} from 'lucide-react';
import { TELKOM_PRODUCTS } from '../../data/telkomProducts';
import { TelkomProduct } from '../../types';

export const ProductWiki: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<TelkomProduct>(TELKOM_PRODUCTS[0]);

  const categories = ['ALL', 'Internet', 'VPN / Data', 'Wifi Managed', 'Voice'];

  const filteredProducts = TELKOM_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.keyFeatures.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-lg bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Layers className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Katalog Layanan Telkom
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Spesifikasi teknis, SLA, topologi & parameter konfigurasi
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
            placeholder="Cari Astinet, Metro-E, WMS..."
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
            {cat === 'ALL' ? 'Semua Produk' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Product Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">Tidak ada hasil untuk "{searchQuery}"</p>
              <p className="text-xs mt-1">Coba kata kunci yang berbeda</p>
            </div>
          )}
          {filteredProducts.map((prod) => {
            const isSelected = selectedProduct.id === prod.id;
            return (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {prod.category}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    SLA {prod.sla}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900">
                  {prod.name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {prod.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Product Detail Panel (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {selectedProduct.category}
                </span>
                <span className="text-sm text-gray-500">
                  Target MTTR: {selectedProduct.mttr}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedProduct.name}
              </h3>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* SLA & IP Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-semibold text-gray-900 block mb-1">
                  Target SLA & MTTR
                </span>
                <p className="text-sm text-gray-700">{selectedProduct.sla}</p>
                <p className="text-sm text-gray-500 mt-0.5">MTTR: {selectedProduct.mttr}</p>
              </div>

              <div>
                <span className="text-sm font-semibold text-gray-900 block mb-1">
                  Alokasi Pengalamatan IP
                </span>
                <p className="text-sm text-gray-700 leading-snug">{selectedProduct.ipAllocation}</p>
              </div>
            </div>

            {/* Topology */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Network className="w-4 h-4 text-gray-500" />
                Alur Topologi Jaringan Standar Telkom
              </span>
              <p className="text-sm font-mono text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed whitespace-pre-wrap">
                {selectedProduct.topology}
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-gray-900">Karakteristik & Fitur Kunci:</span>
              <ul className="space-y-2 text-sm text-gray-700">
                {selectedProduct.keyFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Config Notes */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-gray-900">Catatan Konfigurasi EOS:</span>
              <ul className="space-y-2 text-sm text-gray-700">
                {selectedProduct.configNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gray-400 shrink-0 mt-0.5">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

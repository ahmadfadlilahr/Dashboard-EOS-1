import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { ApiSettings } from '../../types';
import { callAiApi, fetchActiveGeminiModels, fetchActiveGroqModels } from '../../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSaveSettings: (settings: ApiSettings) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<ApiSettings>(settings);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  // Dynamic models state
  const [geminiModels, setGeminiModels] = useState<string[]>([
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ]);
  const [groqModels, setGroqModels] = useState<string[]>([
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile',
    'llama3-70b-8192',
    'llama3-8b-8192'
  ]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    if (settings.groqKey) {
      handleFetchGroqModels(settings.groqKey);
    }
    if (settings.geminiKey) {
      handleFetchGeminiModels(settings.geminiKey);
    }
  }, [isOpen, settings]);

  const handleFetchGroqModels = async (key?: string) => {
    const keyToUse = key || localSettings.groqKey;
    if (!keyToUse) return;
    setIsFetchingModels(true);
    try {
      const models = await fetchActiveGroqModels(keyToUse);
      if (models.length > 0) {
        setGroqModels(models);
        if (!models.includes(localSettings.groqModel)) {
          setLocalSettings(prev => ({ ...prev, groqModel: models[0] }));
        }
      }
    } catch (e) {}
    setIsFetchingModels(false);
  };

  const handleFetchGeminiModels = async (key?: string) => {
    const keyToUse = key || localSettings.geminiKey;
    if (!keyToUse) return;
    setIsFetchingModels(true);
    try {
      const models = await fetchActiveGeminiModels(keyToUse);
      if (models.length > 0) {
        setGeminiModels(models);
        if (!models.includes(localSettings.geminiModel)) {
          setLocalSettings(prev => ({ ...prev, geminiModel: models[0] }));
        }
      }
    } catch (e) {}
    setIsFetchingModels(false);
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Menghubungi server AI...');
    try {
      const reply = await callAiApi({
        prompt: 'Halo AI EOS, tes koneksi 123. Jawab singkat "Koneksi AI EOS Berhasil!"',
        settings: localSettings
      });
      setTestStatus('success');
      setTestMessage(reply);
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'Gagal terhubung ke API AI');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-gray-700" />
            <div>
              <h2 className="text-base font-semibold text-gray-900">Pengaturan Provider AI</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Provider Selector Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Provider AI Aktif
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, activeProvider: 'gemini' })}
                className={`p-3 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                  localSettings.activeProvider === 'gemini'
                    ? 'border-gray-300 bg-gray-50 ring-1 ring-red-500'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${localSettings.activeProvider === 'gemini' ? 'text-red-600' : 'text-gray-500'}`} />
                <span className="text-sm font-medium text-gray-900">Google Gemini</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, activeProvider: 'groq' })}
                className={`p-3 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                  localSettings.activeProvider === 'groq'
                    ? 'border-gray-300 bg-gray-50 ring-1 ring-red-500'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <Zap className={`w-4 h-4 ${localSettings.activeProvider === 'groq' ? 'text-red-600' : 'text-gray-500'}`} />
                <span className="text-sm font-medium text-gray-900">Groq Cloud</span>
              </button>
            </div>
          </div>

          {/* Gemini Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gray-500" />
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Dapatkan Key Gratis
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={localSettings.geminiKey}
                onChange={(e) => {
                  setLocalSettings({ ...localSettings, geminiKey: e.target.value });
                  handleFetchGeminiModels(e.target.value);
                }}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowGeminiKey(!showGeminiKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                Model:
                <button
                  type="button"
                  onClick={() => handleFetchGeminiModels()}
                  disabled={isFetchingModels || !localSettings.geminiKey}
                  className="text-gray-500 hover:text-gray-700"
                  title="Refresh models"
                >
                  <RefreshCw className={`w-3 h-3 ${isFetchingModels ? 'animate-spin' : ''}`} />
                </button>
              </span>
              <select
                value={localSettings.geminiModel}
                onChange={(e) => setLocalSettings({ ...localSettings, geminiModel: e.target.value })}
                className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-red-500"
              >
                {geminiModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Groq Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-gray-500" />
                Groq API Key
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Dapatkan Key Gratis
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showGroqKey ? 'text' : 'password'}
                value={localSettings.groqKey}
                onChange={(e) => {
                  setLocalSettings({ ...localSettings, groqKey: e.target.value });
                  handleFetchGroqModels(e.target.value);
                }}
                placeholder="gsk_..."
                className="w-full px-3 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowGroqKey(!showGroqKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                Model:
                <button
                  type="button"
                  onClick={() => handleFetchGroqModels()}
                  disabled={isFetchingModels || !localSettings.groqKey}
                  className="text-gray-500 hover:text-gray-700"
                  title="Refresh models"
                >
                  <RefreshCw className={`w-3 h-3 ${isFetchingModels ? 'animate-spin' : ''}`} />
                </button>
              </span>
              <select
                value={localSettings.groqModel}
                onChange={(e) => setLocalSettings({ ...localSettings, groqModel: e.target.value })}
                className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-red-500"
              >
                {groqModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2 text-sm text-gray-600 mt-4">
            <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <p>
              API Key disimpan lokal di browser Anda dan tidak pernah dikirim ke server kami.
            </p>
          </div>

          {/* Test Status Feedback */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-lg text-sm flex items-start gap-2 border ${
                testStatus === 'testing'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : testStatus === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {testStatus === 'testing' && <RefreshCw className="w-4 h-4 animate-spin shrink-0" />}
              {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
              <div>
                <span className="font-semibold">
                  {testStatus === 'testing' ? 'Sedang menguji: ' : testStatus === 'success' ? 'Sukses: ' : 'Error: '}
                </span>
                {testMessage}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {testStatus === 'testing' ? 'Sedang Tes...' : 'Tes Koneksi'}
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

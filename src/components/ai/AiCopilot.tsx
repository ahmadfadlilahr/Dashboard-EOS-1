import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  Key, 
  Cpu, 
  FileText
} from 'lucide-react';
import { AiMessage, ApiSettings } from '../../types';
import { callAiApi } from '../../services/aiService';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface AiCopilotProps {
  apiSettings: ApiSettings;
  onOpenSettings: () => void;
}

const STORAGE_CHAT_KEY = 'eos_dashboard_ai_chat_history';

export const AiCopilot: React.FC<AiCopilotProps> = ({
  apiSettings,
  onOpenSettings,
}) => {
  const [messages, setMessages] = useState<AiMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `Halo, ada yang bisa dibantu hari ini?\n\nKamu bisa tanya soal troubleshooting, minta script MikroTik, kirim foto perangkat untuk dianalisis, atau pilih salah satu preset di bawah.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ base64: string; name: string; mimeType: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
    } catch (e) {}
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/') && !file.type.includes('pdf') && !file.type.includes('text')) {
        alert('Format file tidak didukung. Harap upload gambar (JPG/PNG/WebP), PDF, atau file teks.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setAttachedFiles((prev) => [
          ...prev,
          {
            base64,
            name: file.name,
            mimeType: file.type,
          }
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if ((!query.trim() && attachedFiles.length === 0) || isLoading) return;

    const isKeyConfigured = 
      (apiSettings.activeProvider === 'gemini' && !!apiSettings.geminiKey) ||
      (apiSettings.activeProvider === 'groq' && !!apiSettings.groqKey);

    if (!isKeyConfigured) {
      onOpenSettings();
      return;
    }

    const userMessage: AiMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: attachedFiles.map((f) => ({
        type: f.mimeType.startsWith('image/') ? 'image' : 'file',
        url: f.base64,
        name: f.name,
        mimeType: f.mimeType,
      })),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    const currentFiles = [...attachedFiles];
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      const reply = await callAiApi({
        prompt: query,
        images: currentFiles.map((f) => ({ base64: f.base64, mimeType: f.mimeType })),
        settings: apiSettings,
      });

      const assistantMessage: AiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: apiSettings.activeProvider === 'gemini' ? apiSettings.geminiModel : apiSettings.groqModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: AiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Gagal memproses permintaan:**\n\n${err.message || 'Terjadi kesalahan pada koneksi API.'}\n\n*Silakan cek konfigurasi API Key Anda.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Bersihkan riwayat percakapan AI?')) {
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: 'Riwayat percakapan dibersihkan. Ada yang bisa saya bantu untuk troubleshooting link hari ini?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  };

  const quickPresets = [
    {
      title: 'Diagnosa Lampu ONT',
      prompt: 'Tolong jelaskan diagnosa jika lampu LOS di ONT ZTE/Huawei berkedip merah dan PON mati. Apa langkah pertama yang harus dilakukan teknisi EOS di lokasi?',
    },
    {
      title: 'Script BGP Astinet',
      prompt: 'Buatkan script konfigurasi MikroTik RouterOS v7 lengkap untuk link Astinet IP Publik: IP WAN 180.250.10.6/30, Gateway 180.250.10.5, Blok LAN Publik 180.250.20.0/29, dan DNS Telkom.',
    },
    {
      title: 'AP WMS Offline',
      prompt: 'Access Point Ruijie Reyee di lokasi pelanggan statusnya Offline di Cloud Controller dan lampu LED berkedip oranye. Bagaimana langkah troubleshooting bertahap dari layer fisik, PoE, hingga DHCP VLAN?',
    },
    {
      title: 'Fix MTU Clamping',
      prompt: 'Pelanggan Astinet bisa ping ke 8.8.8.8 tapi tidak bisa buka website perbankan/portal tertentu. Bagaimana rule mangle change TCP MSS clamping di MikroTik untuk mengatasi masalah ini?',
    },
    {
      title: 'Format Broadcast WA',
      prompt: 'Buatkan contoh format broadcast WhatsApp update tiket gangguan Astinet untuk dilaporkan ke grup koordinasi ROC/Witel saat status sedang investigasi kabel dropcore putus.',
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-57px)] sm:h-[calc(100vh-80px)] bg-white sm:rounded-lg sm:border sm:border-gray-200 sm:shadow-sm overflow-hidden">
      
      {/* Top Bar inside Copilot */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-red-600" />
          <h2 className="text-sm font-semibold text-gray-900">AI Copilot</h2>
          <span className="hidden sm:inline text-xs text-gray-400">
            {apiSettings.activeProvider === 'gemini' ? apiSettings.geminiModel : apiSettings.groqModel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded text-gray-500 hover:text-red-600 hover:bg-gray-200 transition-colors text-xs flex items-center gap-1"
            title="Bersihkan riwayat chat"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors text-xs flex items-center gap-1"
            title="Ganti model / API Key"
          >
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">API Key</span>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        
        {/* Quick Presets Carousel */}
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-400 mb-1.5">Preset cepat</p>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset.prompt)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-all disabled:opacity-50"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Bubbles */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-gray-200 text-gray-600'
                    : 'bg-red-600 text-white'
                }`}
              >
                {isUser ? <Cpu className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[90%] sm:max-w-[75%] rounded-lg p-3 sm:p-4 text-sm leading-relaxed relative ${
                  isUser
                    ? 'bg-gray-100 text-gray-900 rounded-tr-none'
                    : 'bg-white text-gray-900 rounded-tl-none border border-gray-200 shadow-sm'
                }`}
              >
                {/* Attachments Preview */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {msg.attachments.map((att, i) => (
                      <div key={i} className="relative rounded bg-gray-50 border border-gray-200 overflow-hidden">
                        {att.type === 'image' ? (
                          <img
                            src={att.url}
                            alt={att.name}
                            className="w-full h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => window.open(att.url, '_blank')}
                          />
                        ) : (
                          <div className="p-3 flex items-center gap-2 text-gray-700">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <span className="truncate text-xs">{att.name}</span>
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-gray-900/80 text-xs rounded text-white">
                          {att.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Content with Rich Markdown Rendering */}
                <div>
                  <MarkdownRenderer content={msg.content} isUser={isUser} />
                </div>

                {/* Bubble Footer */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopyText(msg.id, msg.content)}
                      className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                      title="Salin jawaban"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-lg rounded-tl-none p-4 border border-gray-200 shadow-sm flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600 loading-dot"></span>
                <span className="w-2 h-2 rounded-full bg-red-600 loading-dot"></span>
                <span className="w-2 h-2 rounded-full bg-red-600 loading-dot"></span>
              </div>
              <span>Menganalisis...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input & Upload Area */}
      <div className="p-2 sm:p-3 bg-white border-t border-gray-200 space-y-1.5 sm:space-y-2">
        
        {/* Attachment Previews before sending */}
        {attachedFiles.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {attachedFiles.map((file, idx) => (
              <div key={idx} className="relative flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded border border-gray-200 text-xs text-gray-800">
                {file.mimeType.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4 text-gray-500 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                )}
                <span className="truncate max-w-[120px]">{file.name}</span>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="p-0.5 text-gray-400 hover:text-red-600 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Box */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*,.pdf,.txt,.log,.rsc"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 sm:p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200 transition-colors shrink-0"
            title="Upload Foto ONT / Grafik MRTG / Log"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <textarea
            rows={1}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ketik pertanyaan..."
            className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none max-h-28"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isLoading || (!inputPrompt.trim() && attachedFiles.length === 0)}
            className="p-2 sm:p-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden sm:flex items-center justify-between text-xs text-gray-400 px-1">
          <span>Enter kirim · Shift+Enter baris baru</span>
          <span>JPG, PNG, WebP, PDF & log</span>
        </div>

      </div>
    </div>
  );
};

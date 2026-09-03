import React from 'react';
import { 
  Network, 
  Bot, 
  Settings, 
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { ApiSettings } from '../../types';

interface HeaderProps {
  apiSettings: ApiSettings;
  onOpenSettings: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  sidebarCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  apiSettings,
  onOpenSettings,
  mobileMenuOpen,
  onToggleMobileMenu,
  sidebarCollapsed,
  onToggleCollapse
}) => {
  const isKeyConfigured = 
    (apiSettings.activeProvider === 'gemini' && !!apiSettings.geminiKey) ||
    (apiSettings.activeProvider === 'groq' && !!apiSettings.groqKey);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleMobileMenu}
            className="p-1.5 -ml-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 -ml-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-red-600" />
            <h1 className="text-base font-semibold text-gray-900">
              EOS <span className="font-bold">COMMAND CENTER</span>
            </h1>
          </div>
        </div>

        {/* Right: AI Status & Settings Button */}
        <div className="flex items-center gap-4">
          {/* AI Status */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600">
            <Bot className="w-4 h-4" />
            <span>AI: {apiSettings.activeProvider.toUpperCase()}</span>
            <span className={`w-2 h-2 rounded-full ${isKeyConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Pengaturan</span>
          </button>
        </div>

      </div>
    </header>
  );
});

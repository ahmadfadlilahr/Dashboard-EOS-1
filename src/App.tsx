import React, { useState, useEffect } from 'react';
import { TabType, ApiSettings } from './types';
import { getStoredApiSettings, saveStoredApiSettings } from './services/aiService';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ApiKeyModal } from './components/layout/ApiKeyModal';

// Modules
import { AiCopilot } from './components/ai/AiCopilot';
import { TicketGenerator } from './components/incident/TicketGenerator';
import { IpRoutingGuide } from './components/ipguide/IpRoutingGuide';
import { NetworkToolsHub } from './components/calculators/NetworkToolsHub';
import { ProductWiki } from './components/products/ProductWiki';
import { HardwareMatrix } from './components/hardware/HardwareMatrix';
import { TroubleshootingTree } from './components/troubleshooting/TroubleshootingTree';
import { CliCheatSheet } from './components/cheatsheet/CliCheatSheet';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('ai-copilot');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiSettings, setApiSettings] = useState<ApiSettings>(getStoredApiSettings);

  const handleSaveSettings = (newSettings: ApiSettings) => {
    setApiSettings(newSettings);
    saveStoredApiSettings(newSettings);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        const tabs: TabType[] = [
          'ai-copilot',
          'ticket-generator',
          'ip-master',
          'network-tools',
          'telkom-products',
          'hardware-matrix',
          'troubleshooting',
          'mikrotik-cheatsheet'
        ];
        
        if (key >= '1' && key <= '8') {
          e.preventDefault();
          const index = parseInt(key) - 1;
          if (tabs[index]) setCurrentTab(tabs[index]);
        } else if (key === 'b') {
          e.preventDefault();
          setSidebarCollapsed(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveModule = () => {
    switch (currentTab) {
      case 'ai-copilot':
        return (
          <AiCopilot
            apiSettings={apiSettings}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        );
      case 'ticket-generator':
        return <TicketGenerator />;
      case 'ip-master':
        return <IpRoutingGuide />;
      case 'network-tools':
        return <NetworkToolsHub />;
      case 'telkom-products':
        return <ProductWiki />;
      case 'hardware-matrix':
        return <HardwareMatrix />;
      case 'troubleshooting':
        return <TroubleshootingTree />;
      case 'mikrotik-cheatsheet':
        return <CliCheatSheet />;
      default:
        return <AiCopilot apiSettings={apiSettings} onOpenSettings={() => setIsSettingsOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      
      {/* Top Navbar */}
      <Header
        apiSettings={apiSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        sidebarCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex">
        
        {/* Sidebar Nav */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Main Content Viewport */}
        <main className={`flex-1 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'} p-2 sm:p-4 md:p-6 lg:p-8 sm:max-w-6xl mx-auto w-full transition-all duration-200`}>
          <div key={currentTab} className="animate-fade-in">
            {renderActiveModule()}
          </div>
        </main>

      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={apiSettings}
        onSaveSettings={handleSaveSettings}
      />

    </div>
  );
};

export default App;

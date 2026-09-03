import React from 'react';
import { 
  Bot, 
  FileText, 
  Binary, 
  Calculator, 
  Layers, 
  Server, 
  GitFork, 
  Terminal
} from 'lucide-react';
import { TabType } from '../../types';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  sidebarCollapsed: boolean;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'ai-copilot',
    label: 'AI Network Copilot',
    icon: Bot
  },
  {
    id: 'ticket-generator',
    label: 'Smart Ticket & Laporan',
    icon: FileText
  },
  {
    id: 'ip-master',
    label: 'IP Config & Routing Master',
    icon: Binary
  },
  {
    id: 'network-tools',
    label: 'Kalkulator & Tool Jaringan',
    icon: Calculator
  },
  {
    id: 'telkom-products',
    label: 'Katalog Layanan Telkom',
    icon: Layers
  },
  {
    id: 'hardware-matrix',
    label: 'Hardware & Field Device',
    icon: Server
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting Tree',
    icon: GitFork
  },
  {
    id: 'mikrotik-cheatsheet',
    label: 'MikroTik Command Sheet',
    icon: Terminal
  }
];

export const Sidebar: React.FC<SidebarProps> = React.memo(({
  currentTab,
  onSelectTab,
  mobileMenuOpen,
  onCloseMobileMenu,
  sidebarCollapsed
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-[53px] bottom-0 left-0 z-40 bg-white border-r border-gray-200 overflow-y-auto lg:translate-x-0 transition-all duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'w-16 p-2' : 'w-64 p-4'}`}
      >
        {!sidebarCollapsed && (
          <div className="mb-3 px-2">
            <p className="text-xs font-medium text-gray-400">
              Navigasi Modul Operasional
            </p>
          </div>
        )}

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                title={item.label}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobileMenu();
                }}
                className={`w-full flex items-center rounded-lg text-left transition-colors ${
                  sidebarCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2'
                } ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 border-l-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
});

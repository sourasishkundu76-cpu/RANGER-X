import React from 'react';
import { NavigationPath } from '../types';

interface SidebarProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  meshSynced?: boolean;
}

interface NavItem {
  id: NavigationPath;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'command-center', label: 'Command Center', icon: 'grid_view' },
  { id: 'live-sensor-monitor', label: 'Live Sensor Monitor', icon: 'sensors' },
  { id: 'ranger-x-device', label: 'RANGER-X Device', icon: 'view_in_ar' },
  { id: 'rescue-modules', label: 'Rescue Modules', icon: 'health_and_safety' },
  { id: 'emergency-response', label: 'Emergency Response', icon: 'crisis_alert' },
  { id: 'incident-simulator', label: 'Incident Simulator', icon: 'model_training' },
  { id: 'system-logs', label: 'System Logs', icon: 'receipt_long' },
  { id: 'device-settings', label: 'Device Settings', icon: 'tune' },
  {
    id: 'project-info-and-design-thinking',
    label: 'Project Info & Design Thinking',
    icon: 'lightbulb',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  meshSynced = true,
}) => {
  return (
    <aside className="fixed left-0 top-16 bottom-10 w-72 bg-[#151b2b]/95 backdrop-blur-2xl z-40 flex flex-col justify-between py-4 border-r border-[#3e4850]/40 shadow-[1px_0_16px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col flex-1 px-3 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#bec8d2] uppercase font-['Inter']">
            Navigation Console
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-left transition-all ${
                  isActive
                    ? 'bg-[#0ea5e9] text-[#003751] font-semibold shadow-[0_0_14px_rgba(14,165,233,0.4)]'
                    : 'text-[#bec8d2] hover:bg-[#242a3a] hover:text-[#dde2f8]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] flex-shrink-0">
                  {item.icon}
                </span>
                <span className="truncate font-['Inter']">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mesh Node Link Status */}
      <div className="px-4 pt-2">
        <div className="bg-[#191f2f]/80 border border-[#3e4850]/40 rounded-xl p-3 shadow-inner">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-[#bec8d2] uppercase font-['Inter'] tracking-wider">
              Mesh Node 04A
            </span>
            <span className="text-xs font-mono font-medium text-[#4edea3] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              {meshSynced ? 'SYNCED' : 'OFFLINE'}
            </span>
          </div>
          <div className="w-full bg-[#2f3445] rounded-full h-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                meshSynced ? 'bg-[#00b17b] w-full' : 'bg-[#ffb4ab] w-1/4'
              }`}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#88929b] mt-1.5 font-mono">
            <span>RSSI: -44 dBm</span>
            <span>FREQ: 868.1 MHz</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

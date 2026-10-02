import React, { useEffect, useState } from 'react';

export const Footer: React.FC = () => {
  const [clock, setClock] = useState('14:42:09 UTC');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setClock(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-10 bg-[#080e1d]/95 backdrop-blur-xl z-50 px-6 flex items-center justify-between border-t border-[#3e4850]/40 shadow-[0_-1px_12px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-3 truncate text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#89ceff] animate-ping flex-shrink-0"></span>
        <span className="text-[11px] font-medium text-[#bec8d2] tracking-wider truncate font-['Inter']">
          RANGER-X — ENGINEERING CONCEPT / SIMULATION | First-Year B.Tech Design Thinking Demonstrator | Safe Harmless Rescue Architecture
        </span>
      </div>

      <div className="flex items-center gap-6 flex-shrink-0 text-xs">
        <div className="flex items-center gap-1.5 text-[#4edea3] font-mono">
          <span className="material-symbols-outlined text-[14px]">
            wifi_tethering
          </span>
          <span>12ms PING</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[#d3fbff]">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span>SIM CLOCK {clock}</span>
        </div>
      </div>
    </footer>
  );
};

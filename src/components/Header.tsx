import React from 'react';
import officerAvatar from '../assets/images/officer_vance_portrait_1790696375195.jpg';

interface HeaderProps {
  sosActive: boolean;
  onSosToggle: () => void;
  onOpenOfficerProfile: () => void;
  batteryLevel?: number;
  systemMode?: string;
}

export const Header: React.FC<HeaderProps> = ({
  sosActive,
  onSosToggle,
  onOpenOfficerProfile,
  batteryLevel = 93,
  systemMode = 'PATROL',
}) => {
  const crestLogoUrl =
    'https://lh3.googleusercontent.com/aida/AEtjO1V-Zb_hhpk71mBxIwqK0DFU0W6pUPrnzWHnbeYNYSmBecvv1I_QpqREY4P2g2_EiLcyJ1aVA1gt80sY3GbJGcIgCBc02LWMJ9aL7BT5_-6iDh1pDlhCknYLXaeqDiUgOQv7t1332XT-v2FrolKKt7Ydb1g4MRuxYJ82ppY2V2xpbfA5ldXsiJC3yWgu1HyIuJvOJla_9DKiHmC7zz4CsUWNEMDNzVjS6e852NqEYu4O-WjYQz-aKRytmFKQ';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0d1322]/90 backdrop-blur-xl z-50 px-6 flex items-center justify-between border-b border-[#3e4850]/40 shadow-[0_1px_16px_rgba(0,0,0,0.45)]">
      {/* Brand & Crest Lockup */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img
            src={crestLogoUrl}
            alt="RANGER-X Tactical Crest Logo"
            className="h-8 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,238,252,0.4)]"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-['Inter'] text-lg tracking-tight font-bold text-[#89ceff]">
                RANGER-X
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#2f3445] text-[#4edea3] text-[10px] font-semibold tracking-wider uppercase font-['Inter']">
                ENGINEERING CONCEPT / SIMULATION
              </span>
            </div>
            <span className="text-[10px] tracking-widest text-[#bec8d2] font-semibold uppercase font-['Inter']">
              DETECT. RESPOND. PROTECT.
            </span>
          </div>
        </div>

        {/* Global Telemetry Bar */}
        <div className="hidden xl:flex items-center gap-4 pl-4 bg-[#151b2b]/70 rounded-lg px-4 py-1.5 border border-[#3e4850]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="text-[11px] font-semibold text-[#bec8d2]">SYS:</span>
            <span className="text-xs font-mono font-medium text-[#4edea3]">ONLINE</span>
          </div>
          <div className="w-px h-3.5 bg-[#2f3445]"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#89ceff]">
              battery_charging_90
            </span>
            <span className="text-[11px] font-semibold text-[#bec8d2]">BATT:</span>
            <span className="text-xs font-mono font-medium text-[#89ceff]">
              {batteryLevel}%
            </span>
          </div>
          <div className="w-px h-3.5 bg-[#2f3445]"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#d3fbff]">
              shield
            </span>
            <span className="text-[11px] font-semibold text-[#bec8d2]">MODE:</span>
            <span className="text-xs font-mono font-medium text-[#00eefc]">
              {systemMode}
            </span>
          </div>
          <div className="w-px h-3.5 bg-[#2f3445]"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#4edea3]">
              satellite_alt
            </span>
            <span className="text-[11px] font-semibold text-[#bec8d2]">SAT-COM:</span>
            <span className="text-xs font-mono font-medium text-[#4edea3]">
              CONNECTED
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: SOS & Officer Profile */}
      <div className="flex items-center gap-4">
        {/* Emergency SOS Button */}
        <button
          onClick={onSosToggle}
          type="button"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-['Inter'] text-sm font-semibold tracking-wide transition-all ${
            sosActive
              ? 'bg-[#ef4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-pulse'
              : 'bg-[#93000a] text-[#ffdad6] hover:bg-[#ffb4ab] hover:text-[#690005] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
          }`}
          title="Toggle Emergency SOS broadcast"
        >
          <span className="material-symbols-outlined text-[18px]">
            {sosActive ? 'crisis_alert' : 'e911_emergency'}
          </span>
          <span>{sosActive ? 'SOS DISPATCHED' : 'EMERGENCY SOS'}</span>
        </button>

        {/* Officer Vance Avatar & Info */}
        <button
          onClick={onOpenOfficerProfile}
          type="button"
          className="flex items-center gap-3 pl-3 pr-1.5 py-1 bg-[#151b2b]/90 hover:bg-[#242a3a] border border-[#3e4850]/60 rounded-xl transition-all cursor-pointer text-left group"
          title="View Officer Vance Credentials and Field Vitals"
        >
          <div className="flex flex-col text-right">
            <span className="text-xs font-medium text-[#dde2f8] leading-tight group-hover:text-[#89ceff] transition-colors">
              Officer Vance
            </span>
            <span className="text-[10px] text-[#bec8d2] font-mono">
              Zone 4 Sector Alpha
            </span>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#89ceff]/70 group-hover:border-[#00eefc] transition-colors bg-[#080e1d] flex-shrink-0">
            <img
              src={officerAvatar}
              alt="Officer Vance portrait"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>
        </button>
      </div>
    </header>
  );
};

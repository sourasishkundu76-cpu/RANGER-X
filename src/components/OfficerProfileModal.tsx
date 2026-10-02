import React from 'react';
import officerAvatar from '../assets/images/officer_vance_portrait_1790696375195.jpg';

interface OfficerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  sosActive: boolean;
}

export const OfficerProfileModal: React.FC<OfficerProfileModalProps> = ({
  isOpen,
  onClose,
  sosActive,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#151b2b] border border-[#3e4850]/70 rounded-2xl shadow-2xl overflow-hidden p-6 flex flex-col gap-5">
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-[#3e4850]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#89ceff] text-[22px]">
              badge
            </span>
            <span className="font-['Inter'] text-sm font-bold text-[#dde2f8] uppercase tracking-wider">
              Wildland Officer Field Credentials
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#242a3a] hover:bg-[#2f3445] text-[#bec8d2] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Officer Profile Hero */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#89ceff] shadow-xl flex-shrink-0 bg-[#080e1d]">
            <img
              src={officerAvatar}
              alt="Officer Vance portrait"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex flex-col text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-['Inter'] text-xl font-bold text-[#dde2f8]">
                Officer Vance
              </h2>
              <span className="px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-mono font-bold">
                BADGE RS-27
              </span>
            </div>
            <span className="text-xs text-[#89ceff] font-medium mt-0.5">
              Senior Field Ranger • Wildlife Rapid Response Specialist
            </span>
            <p className="text-xs text-[#bec8d2] mt-2 leading-relaxed">
              Assigned to deep-canopy nocturnal patrol along Moyar Gorge and Teak Ridge Alpha. Certified operative for RANGER-X zero-harm bio-robotic wearable field evaluation.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 text-[10px] font-mono">
              <span className="bg-[#242a3a] border border-[#3e4850]/40 px-2.5 py-1 rounded text-[#dde2f8]">
                Station: Zone 4 Sector Alpha
              </span>
              <span className="bg-[#242a3a] border border-[#3e4850]/40 px-2.5 py-1 rounded text-[#dde2f8]">
                Exp: 18 Years Wildland Service
              </span>
              <span
                className={`border px-2.5 py-1 rounded font-bold ${
                  sosActive
                    ? 'bg-[#93000a]/30 border-[#ffb4ab] text-[#ffb4ab]'
                    : 'bg-[#003b26]/30 border-[#4edea3]/40 text-[#4edea3]'
                }`}
              >
                {sosActive ? 'STATUS: DISTRESS ACTIVE' : 'STATUS: ON PATROL'}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Field Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#080e1d]/80 border border-[#3e4850]/40 rounded-xl p-3.5 text-center">
          <div>
            <span className="text-[9px] font-bold text-[#bec8d2] uppercase font-['Inter'] block">
              HEART RATE
            </span>
            <span className="font-mono text-lg font-bold text-[#4edea3]">
              74 <span className="text-[10px] text-[#bec8d2]">BPM</span>
            </span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#bec8d2] uppercase font-['Inter'] block">
              BODY THERMAL
            </span>
            <span className="font-mono text-lg font-bold text-[#89ceff]">
              36.8 <span className="text-[10px] text-[#bec8d2]">°C</span>
            </span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#bec8d2] uppercase font-['Inter'] block">
              POSTURE (MPU)
            </span>
            <span className="font-mono text-lg font-bold text-[#00eefc]">
              0.98 G
            </span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#bec8d2] uppercase font-['Inter'] block">
              LIPO CELL
            </span>
            <span className="font-mono text-lg font-bold text-[#dde2f8]">
              93 %
            </span>
          </div>
        </div>

        {/* Active Gear Manifest */}
        <div className="bg-[#191f2f] border border-[#3e4850]/40 rounded-xl p-4 flex flex-col gap-2 text-xs">
          <span className="text-[10px] font-bold text-[#89ceff] uppercase font-['Inter']">
            Assigned Field Equipment Manifest
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#dde2f8] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              <span>RANGER-X Wrist-HUD MK-IV (CAD V2.4)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              <span>Cartridge 01: Soft Tether Rescue Assist</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              <span>Dual-MCU: ESP32-S3 + ATmega328P</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              <span>LoRa 868MHz Mesh Transceiver (Node 04A)</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#3e4850]/40 text-xs">
          <span className="text-[10px] text-[#bec8d2] font-mono">
            Bio-telemetry stream synchronized with Mesh Node 04A.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#242a3a] hover:bg-[#2f3445] text-[#dde2f8] font-semibold text-xs font-['Inter'] transition-colors"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

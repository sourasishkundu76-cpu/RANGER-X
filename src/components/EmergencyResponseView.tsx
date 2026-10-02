import React, { useState } from 'react';

interface EmergencyResponseProps {
  sosActive: boolean;
  onSosToggle: () => void;
}

export const EmergencyResponseView: React.FC<EmergencyResponseProps> = ({
  sosActive,
  onSosToggle,
}) => {
  const [droneDispatched, setDroneDispatched] = useState(false);
  const [beaconActive, setBeaconActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Play tactical buzzer alert using Web Audio API
  const playTacticalAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
      setSoundEnabled(true);
    } catch {
      // Audio fallback
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-xl p-5 rounded-xl shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#93000a]/30 text-[#ffb4ab] text-[10px] font-semibold uppercase font-['Inter']">
              Priority Red Direct Channel
            </span>
            <span className="px-2 py-0.5 rounded bg-[#2f3445] text-[#89ceff] text-[10px] font-semibold font-mono">
              LORA FLOOD PROTOCOL V2
            </span>
          </div>
          <div className="flex items-baseline gap-4 mt-1">
            <h1 className="font-['Inter'] text-2xl font-bold text-[#dde2f8] tracking-tight">
              Emergency Response & Distress Dispatch
            </h1>
            <span className="text-xs font-mono text-[#00eefc]">
              ENCRYPTED AD-HOC MESH (868MHz)
            </span>
          </div>
        </div>

        {/* SOS Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playTacticalAlertSound();
              onSosToggle();
            }}
            type="button"
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-['Inter'] text-sm font-bold tracking-wider transition-all select-none ${
              sosActive
                ? 'bg-[#ef4444] text-white shadow-[0_0_24px_rgba(239,68,68,0.7)] animate-pulse'
                : 'bg-[#93000a] text-[#ffdad6] hover:bg-[#ffb4ab] hover:text-[#690005] shadow-[0_0_16px_rgba(239,68,68,0.3)]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {sosActive ? 'crisis_alert' : 'e911_emergency'}
            </span>
            <span>{sosActive ? 'DISTRESS BROADCAST ACTIVE' : 'TRIGGER EMERGENCY SOS'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sector Tactical Map + Incident Dispatch Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sector 04 Tactical Geo Map (7 cols) */}
        <div className="lg:col-span-7 bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#3e4850]/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#89ceff] text-[20px]">
                map
              </span>
              <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                Bandipur Tiger Reserve • Sector 04 Alpha Tactical Grid
              </span>
            </div>
            <span className="text-xs font-mono text-[#00eefc]">GPS FIXED (8 SATS)</span>
          </div>

          {/* Interactive Map Visualizer */}
          <div className="relative w-full h-[360px] bg-[#080e1d] border border-[#3e4850]/40 rounded-xl my-3 overflow-hidden flex items-center justify-center">
            {/* Topographic Lines SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 600 360">
              <path
                d="M 50 180 Q 200 80 400 140 T 580 90"
                fill="none"
                stroke="#3e4850"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <path
                d="M 20 280 Q 240 200 450 260 T 590 220"
                fill="none"
                stroke="#3e4850"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <circle
                cx="300"
                cy="180"
                r="120"
                stroke="#0ea5e9"
                strokeDasharray="3 6"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <circle
                cx="300"
                cy="180"
                r="60"
                stroke="#00eefc"
                strokeDasharray="2 4"
                strokeOpacity="0.6"
                strokeWidth="1"
              />
            </svg>

            {/* Mesh Nodes on Map */}
            {/* Ranger Vance Center Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className={`w-8 h-8 rounded-full ${sosActive ? 'bg-[#ef4444]/40 animate-ping' : 'bg-[#89ceff]/30 animate-pulse'}`}></span>
                <span className={`absolute w-4 h-4 rounded-full ${sosActive ? 'bg-[#ef4444]' : 'bg-[#0ea5e9]'} border-2 border-white shadow-lg`}></span>
              </div>
              <div className="mt-2 bg-[#151b2b]/90 border border-[#89ceff]/40 px-2 py-0.5 rounded text-[10px] font-mono text-[#dde2f8] whitespace-nowrap shadow">
                OFFICER VANCE (YOU)
              </div>
            </div>

            {/* Team Bravo Node */}
            <div className="absolute top-1/4 right-1/4 flex flex-col items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-[#4edea3] border border-white shadow"></div>
              <div className="mt-1 bg-[#151b2b]/90 border border-[#3e4850] px-1.5 py-0.5 rounded text-[9px] font-mono text-[#4edea3] whitespace-nowrap">
                TEAM BRAVO (850m NE)
              </div>
            </div>

            {/* Base Station Relay */}
            <div className="absolute bottom-1/4 left-1/4 flex flex-col items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-[#00eefc] border border-white shadow"></div>
              <div className="mt-1 bg-[#151b2b]/90 border border-[#3e4850] px-1.5 py-0.5 rounded text-[9px] font-mono text-[#00eefc] whitespace-nowrap">
                BASE RELAY 04A (1.4km SW)
              </div>
            </div>

            {/* Drone Escort Node if Dispatched */}
            {droneDispatched && (
              <div className="absolute top-1/3 left-1/2 -translate-x-12 flex flex-col items-center animate-bounce">
                <span className="material-symbols-outlined text-[#89ceff] text-[20px]">
                  flight
                </span>
                <span className="bg-[#080e1d] border border-[#89ceff] text-[#89ceff] text-[8px] font-mono px-1 rounded">
                  UAV-02 IN TRANSIT
                </span>
              </div>
            )}

            {/* Coordinate Overlay */}
            <div className="absolute bottom-3 left-3 bg-[#151b2b]/90 border border-[#3e4850]/50 p-2 rounded-lg text-xs font-mono">
              <div className="text-[10px] text-[#bec8d2]">CURRENT GPS STANDOFF</div>
              <div className="text-[#89ceff] font-bold">11°42'18.4"N 76°38'22.1"E</div>
              <div className="text-[#4edea3] text-[10px]">Altitude: 914m MSL • Accuracy ±1.2m</div>
            </div>
          </div>

          {/* Quick Dispatch Actions Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => setDroneDispatched(!droneDispatched)}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                droneDispatched
                  ? 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-[#89ceff]'
                  : 'bg-[#191f2f] border-[#3e4850]/40 text-[#bec8d2] hover:bg-[#242a3a]'
              }`}
              type="button"
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[20px]">flight</span>
                <span className="text-[10px] font-mono uppercase">
                  {droneDispatched ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <div className="mt-2">
                <div className="font-['Inter'] text-xs font-bold text-[#dde2f8]">
                  Deploy Drone Escort
                </div>
                <div className="text-[10px] text-[#bec8d2]">Thermal UAV 2.4km</div>
              </div>
            </button>

            <button
              onClick={() => setBeaconActive(!beaconActive)}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                beaconActive
                  ? 'bg-[#4edea3]/20 border-[#4edea3] text-[#4edea3]'
                  : 'bg-[#191f2f] border-[#3e4850]/40 text-[#bec8d2] hover:bg-[#242a3a]'
              }`}
              type="button"
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[20px]">flare</span>
                <span className="text-[10px] font-mono uppercase">
                  {beaconActive ? 'STROBING' : 'IDLE'}
                </span>
              </div>
              <div className="mt-2">
                <div className="font-['Inter'] text-xs font-bold text-[#dde2f8]">
                  Perimeter Strobe Beacon
                </div>
                <div className="text-[10px] text-[#bec8d2]">850 Lumen Flash</div>
              </div>
            </button>

            <button
              onClick={playTacticalAlertSound}
              className="p-3 rounded-lg border bg-[#191f2f] border-[#3e4850]/40 text-[#bec8d2] hover:bg-[#242a3a] text-left flex flex-col justify-between transition-all"
              type="button"
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[20px] text-[#00eefc]">
                  volume_up
                </span>
                <span className="text-[10px] font-mono text-[#00eefc]">TEST TONE</span>
              </div>
              <div className="mt-2">
                <div className="font-['Inter'] text-xs font-bold text-[#dde2f8]">
                  Acoustic Dispersal Audio
                </div>
                <div className="text-[10px] text-[#bec8d2]">Humane Sweep Wave</div>
              </div>
            </button>
          </div>
        </div>

        {/* Right: LoRa Mesh Broadcast Packet Feed & Protocols (5 cols) */}
        <div className="lg:col-span-5 bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#3e4850]/30">
              <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                Mesh Node Dispatch Logs
              </span>
              <span className="text-[10px] font-mono text-[#4edea3] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                FLOOD PACKET PIPELINE OK
              </span>
            </div>

            <div className="my-3 bg-[#080e1d] border border-[#3e4850]/40 rounded-lg p-3 space-y-2 font-mono text-xs max-h-72 overflow-y-auto">
              <div className="text-[#4edea3]">
                [14:42:01] [TX_BROADCAST] Node_04A: Beacon packet sent. Frequency: 868.100 MHz SF=7.
              </div>
              <div className="text-[#89ceff]">
                [14:42:04] [ACK_RECEIVED] Relay_Base_04: Standby telemetry received. Signal SNR +8.5 dB.
              </div>
              <div className={sosActive ? 'text-[#ffb4ab] font-bold animate-pulse' : 'text-[#bec8d2]'}>
                {sosActive
                  ? '[14:42:08] [CRITICAL_FLOOD] EMERGENCY DISTRESS CODE #99-ALERT SENT TO ALL NODES!'
                  : '[14:42:08] [NOMINAL] Zero perimeter breach. Heartbeat acknowledged.'}
              </div>
              <div className="text-[#00eefc]">
                [14:42:12] [GPS_UPDATE] Fix Lat 11.70511°N Lon 76.63947°E Alt 914m. HDOP 0.9.
              </div>
              {droneDispatched && (
                <div className="text-[#89ceff] font-bold">
                  [14:42:15] [UAV_RELAY] Tactical drone escort UAV-02 launched from Basecam Alpha. ETA: 4m 12s.
                </div>
              )}
            </div>
          </div>

          {/* Officer Vance Emergency Card */}
          <div className="bg-[#191f2f] border border-[#3e4850]/40 p-4 rounded-lg flex flex-col gap-2">
            <span className="text-[10px] font-bold text-[#89ceff] uppercase font-['Inter']">
              Officer On-Duty Profile
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                  Officer Vance
                </span>
                <div className="text-xs text-[#bec8d2]">Badge #RS-27 • Zone 4 Sector Alpha</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-mono font-bold">
                VITALS NORMAL
              </span>
            </div>
            <div className="text-[11px] text-[#bec8d2] border-t border-[#242a3a] pt-2 font-mono">
              In case of unresponsiveness (&gt;60s fall posture detected by MPU6050), automated distress flood will dispatch base camp team without manual intervention.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

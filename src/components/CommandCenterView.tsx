import React, { useState, useEffect, useRef } from 'react';
import { NavigationPath } from '../types';

interface CommandCenterViewProps {
  onNavigate: (path: NavigationPath) => void;
  onSosTrigger: () => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  onNavigate,
  onSosTrigger,
}) => {
  // Gauntlet visualizer angle state
  const [activeView, setActiveView] = useState<'top' | 'profile' | 'port' | 'wireframe'>('top');

  // Patrol state
  const [patrolActive, setPatrolActive] = useState(true);

  // Diagnostic sweep modal state
  const [isDiagOpen, setIsDiagOpen] = useState(false);
  const [diagStep, setDiagStep] = useState(0);
  const [diagLogs, setDiagLogs] = useState<string[]>([
    '[INIT] Dual-Core ESP32-S3 ready. Click "RUN DIAGNOSTIC SWEEP" to trigger live hardware loop test...',
  ]);

  // SOS hold progress state
  const [sosProgress, setSosProgress] = useState(0);
  const [sosDispatched, setSosDispatched] = useState(false);
  const sosIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Live telemetry stream state
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    '[14:42:07.120] MCU0_ESP32: US_ECHO=124.2cm | PIR=LOW | BATT=3.98V | LORA_RSSI=-42dBm',
    '[14:42:07.820] GAUNTLET_CORE: FSR_PALM=0.00N | AMBIENT_LUX=420lx (DAY_FILTER) | LATCH=ENGAGED',
    '[14:42:08.410] RADAR_VECTOR: SCAN_AZIMUTH=048° | OBSTACLE_DIST=4.22m | CLASS=ORGANIC_HERBIVORE',
    '[14:42:09.002] SYNC_PACKET_OK: Mesh Node 04A ack recvd. No human-wildlife conflict detected in 50m radius.',
  ]);

  // Periodic telemetry log update
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toISOString().substring(11, 23);
      const dist = (120 + Math.random() * 8).toFixed(1);
      const pktId = Math.floor(1000 + Math.random() * 9000);
      const tilt = (0.5 + Math.random() * 0.6).toFixed(1);
      const newLog = `[${timeStr}] US_JSN_SR04T: PING_RT=${dist}cm | TILT=${tilt}° | MESH_PKT_ACK#${pktId}`;

      setTelemetryLogs((prev) => {
        const next = [...prev, newLog];
        if (next.length > 6) next.shift();
        return next;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  // Diagnostic sweep execution
  const runDiagnosticSweep = () => {
    setIsDiagOpen(true);
    setDiagStep(1);
    setDiagLogs([
      '[INIT] Initiating dual-bus self-test sweep across 6 hardware endpoints...',
    ]);

    const cards = [
      'ULTRASONIC TRANSDUCER (HC-SR04/JSN-SR04T)',
      'PIR MOTION ARRAY (Pyroelectric)',
      'SSD1306 0.96" OLED (I2C 0x3C)',
      'PIEZO ALARM 85dB (PWM 2.7kHz)',
      'SG90 CART RELEASE SERVO (0°-90° Detent)',
      'HAPTIC COIN VIBRATOR (Silent ERM)',
    ];

    cards.forEach((item, index) => {
      setTimeout(() => {
        setDiagStep(index + 2);
        setDiagLogs((prev) => [
          ...prev,
          `[OK] Subsystem #${index + 1}: ${item} verified with latency < 3ms. Response nominal.`,
        ]);
      }, (index + 1) * 380);
    });
  };

  // SOS Hold Press Handlers
  const startSosHold = () => {
    if (sosDispatched) return;
    setSosProgress(0);
    if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);

    sosIntervalRef.current = setInterval(() => {
      setSosProgress((prev) => {
        if (prev >= 100) {
          if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
          setSosDispatched(true);
          onSosTrigger();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const cancelSosHold = () => {
    if (sosProgress < 100) {
      if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
      setSosProgress(0);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-10">
      {/* TOP CONSOLE TICKER & STATUS HERO BAR */}
      <div className="w-full bg-[#151b2b]/70 border border-[#3e4850]/40 backdrop-blur-xl rounded-xl p-4 shadow-xl relative overflow-hidden flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#89ceff]/5 blur-3xl pointer-events-none"></div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5 bg-[#242a3a]/90 border border-[#3e4850]/50 px-4 py-2 rounded-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4edea3]"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-[#bec8d2] uppercase tracking-wider font-['Inter']">
                RANGER STATUS
              </span>
              <span className="font-['Inter'] text-sm font-bold text-[#4edea3] tracking-wide leading-none">
                {patrolActive ? 'PATROL ACTIVE' : 'PATROL PAUSED'}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-[#2f3445] hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-[#bec8d2] uppercase tracking-wider font-['Inter']">
              HARDWARE CORE
            </span>
            <span className="text-xs text-[#dde2f8] flex items-center gap-1 font-semibold font-mono">
              <span className="text-[#89ceff]">ESP32-S3 Dual-Core</span> + ATmega328P Aux
            </span>
          </div>

          <div className="h-8 w-px bg-[#2f3445] hidden md:block"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-[#bec8d2] uppercase tracking-wider font-['Inter']">
              SEC-LOC COORDINATES
            </span>
            <span className="text-xs text-[#d3fbff] flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              11°42'18"N 76°38'22"E (Bandipur S-04)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch xl:self-auto justify-between xl:justify-end">
          <div className="flex items-center gap-1.5 bg-[#4edea3]/10 border border-[#4edea3]/30 px-3 py-1 rounded">
            <span className="material-symbols-outlined text-[#4edea3] text-[16px]">
              verified_user
            </span>
            <span className="text-[10px] text-[#4edea3] uppercase font-semibold font-['Inter']">
              SAFE HARMFUL-FREE HARNESS
            </span>
          </div>
          <span className="text-[10px] text-[#bec8d2] bg-[#2f3445]/80 px-2.5 py-1 rounded font-mono border border-[#3e4850]/40">
            TICK #8841-A09
          </span>
        </div>
      </div>

      {/* EXECUTIVE TELEMETRY OVERVIEW GRID (7 NODES) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {/* Node 1: System */}
        <div className="bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-md rounded-xl p-3 shadow-md flex flex-col justify-between hover:bg-[#242a3a] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
              SYSTEM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
          </div>
          <div className="my-1.5">
            <div className="font-['Geist'] text-lg font-bold text-[#4edea3] leading-tight">
              ONLINE
            </div>
            <div className="text-[10px] text-[#bec8d2] truncate">Dual MCU Ready</div>
          </div>
          <div className="w-full bg-[#2f3445] h-1 rounded-full overflow-hidden">
            <div className="bg-[#4edea3] h-full w-full"></div>
          </div>
        </div>

        {/* Node 2: Battery */}
        <div className="bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-md rounded-xl p-3 shadow-md flex flex-col justify-between hover:bg-[#242a3a] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
              BATTERY
            </span>
            <span className="material-symbols-outlined text-[#89ceff] text-[15px]">
              battery_saver
            </span>
          </div>
          <div className="my-1.5">
            <div className="font-['Geist'] text-lg font-bold text-[#89ceff] leading-tight">
              93%
            </div>
            <div className="text-[10px] text-[#bec8d2] truncate">LiPo 1200mAh / 14.2h</div>
          </div>
          <div className="w-full bg-[#2f3445] h-1 rounded-full overflow-hidden">
            <div className="bg-[#89ceff] h-full w-[93%]"></div>
          </div>
        </div>

        {/* Node 3: Current Mode */}
        <div className="bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-md rounded-xl p-3 shadow-md flex flex-col justify-between hover:bg-[#242a3a] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
              MODE
            </span>
            <span className="material-symbols-outlined text-[#00eefc] text-[15px]">
              routine
            </span>
          </div>
          <div className="my-1.5">
            <div className="font-['Geist'] text-lg font-bold text-[#00eefc] leading-tight">
              PATROL
            </div>
            <div className="text-[10px] text-[#bec8d2] truncate">Adaptive Photocell</div>
          </div>
          <div className="w-full bg-[#2f3445] h-1 rounded-full overflow-hidden">
            <div className="bg-[#00eefc] h-full w-4/5"></div>
          </div>
        </div>

        {/* Node 4: Proximity */}
        <div className="bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-md rounded-xl p-3 shadow-md flex flex-col justify-between hover:bg-[#242a3a] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
              PROXIMITY
            </span>
            <span className="material-symbols-outlined text-[#89ceff] text-[15px]">
              radar
            </span>
          </div>
          <div className="my-1.5">
            <div className="font-['Geist'] text-lg font-bold text-[#dde2f8] leading-tight font-mono">
              124<span className="text-xs font-normal text-[#bec8d2]">cm</span>
            </div>
            <div className="text-[10px] text-[#bec8d2] truncate">JSN-SR04T Beam</div>
          </div>
          <div className="w-full bg-[#2f3445] h-1 rounded-full overflow-hidden">
            <div className="bg-[#0ea5e9] h-full w-3/5"></div>
          </div>
        </div>

        {/* Node 5: Threat */}
        <div className="bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-md rounded-xl p-3 shadow-md flex flex-col justify-between hover:bg-[#242a3a] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
              PERIMETER
            </span>
            <span className="material-symbols-outlined text-[#4edea3] text-[15px]">
              verified_user
            </span>
          </div>
          <div className="my-1.5">
            <div className="font-['Geist'] text-lg font-bold text-[#4edea3] leading-tight">
              NORMAL
            </div>
            <div className="text-[10px] text-[#bec8d2] truncate">Zero Breach Detected</div>
          </div>
          <div className="w-full bg-[#2f3445] h-1 rounded-full overflow-hidden">
            <div className="bg-[#4edea3] h-full w-full"></div>
          </div>
        </div>

        {/* Node 6: Mesh Link */}
        <div className="bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-md rounded-xl p-3 shadow-md flex flex-col justify-between hover:bg-[#242a3a] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
              COMMS
            </span>
            <span className="material-symbols-outlined text-[#89ceff] text-[15px]">hub</span>
          </div>
          <div className="my-1.5">
            <div className="font-['Geist'] text-lg font-bold text-[#89ceff] leading-tight">
              LORA+BLE
            </div>
            <div className="text-[10px] text-[#bec8d2] truncate">868MHz Mesh Link</div>
          </div>
          <div className="w-full bg-[#2f3445] h-1 rounded-full overflow-hidden">
            <div className="bg-[#89ceff] h-full w-[95%]"></div>
          </div>
        </div>

        {/* Node 7: Active Module */}
        <div className="col-span-2 sm:col-span-1 bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-md rounded-xl p-3 shadow-md flex flex-col justify-between hover:bg-[#242a3a] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
              CARTRIDGE
            </span>
            <span className="material-symbols-outlined text-[#d3fbff] text-[15px]">lock</span>
          </div>
          <div className="my-1.5">
            <div className="font-['Geist'] text-lg font-bold text-[#00eefc] leading-tight truncate">
              CART-01
            </div>
            <div className="text-[10px] text-[#bec8d2] truncate">Tether Assist Primed</div>
          </div>
          <div className="w-full bg-[#2f3445] h-1 rounded-full overflow-hidden">
            <div className="bg-[#00eefc] h-full w-full"></div>
          </div>
        </div>
      </div>

      {/* MAIN DUAL-PANE COCKPIT: WRIST DEVICE VISUALIZER + TACTICAL RADAR HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: WRIST DEVICE 3D/SCHEMATIC INTERACTIVE VISUALIZER (7 cols) */}
        <div className="lg:col-span-7 bg-[#151b2b]/90 border border-[#3e4850]/40 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl relative flex flex-col justify-between overflow-hidden">
          {/* Ambient Backdrops */}
          <div className="absolute -left-10 -bottom-10 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top HUD Header Inside Visualizer */}
          <div className="flex flex-wrap items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#89ceff] text-[22px]">
                view_in_ar
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                    RANGER-X WEAPONIZED GAUNTLET CHASSIS
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2f3445] text-[#89ceff] border border-[#3e4850]/60">
                    CAD-V2.4
                  </span>
                </div>
                <p className="text-[11px] text-[#bec8d2]">
                  Spider-Man Web-Shooter Inspired Wildlife-Rescue Exo-Wearable
                </p>
              </div>
            </div>

            {/* View Angle Switcher */}
            <div className="flex items-center bg-[#2f3445]/90 p-1 rounded-lg gap-1 border border-[#3e4850]/50">
              <button
                onClick={() => setActiveView('top')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                  activeView === 'top'
                    ? 'bg-[#0ea5e9] text-[#003751] shadow'
                    : 'text-[#bec8d2] hover:text-[#dde2f8]'
                }`}
                type="button"
              >
                Top HUD
              </button>
              <button
                onClick={() => setActiveView('profile')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                  activeView === 'profile'
                    ? 'bg-[#0ea5e9] text-[#003751] shadow'
                    : 'text-[#bec8d2] hover:text-[#dde2f8]'
                }`}
                type="button"
              >
                Gauntlet Arc
              </button>
              <button
                onClick={() => setActiveView('port')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                  activeView === 'port'
                    ? 'bg-[#0ea5e9] text-[#003751] shadow'
                    : 'text-[#bec8d2] hover:text-[#dde2f8]'
                }`}
                type="button"
              >
                Bay Port
              </button>
              <button
                onClick={() => setActiveView('wireframe')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                  activeView === 'wireframe'
                    ? 'bg-[#0ea5e9] text-[#003751] shadow'
                    : 'text-[#bec8d2] hover:text-[#dde2f8]'
                }`}
                type="button"
              >
                Mesh HUD
              </button>
            </div>
          </div>

          {/* Device Interactive SVG Canvas Stage */}
          <div className="relative w-full h-[360px] my-3 flex items-center justify-center">
            {/* Ultrasonic 15-degree Emission Cone Projection */}
            <svg
              className={`absolute inset-0 w-full h-full pointer-events-none z-0 transition-all duration-500 ${
                activeView === 'wireframe' ? 'opacity-40' : 'opacity-100'
              }`}
              fill="none"
              viewBox="0 0 600 360"
            >
              <defs>
                <radialGradient
                  cx="50%"
                  cy="50%"
                  fx="50%"
                  fy="50%"
                  id="sonarGlow"
                  r="50%"
                >
                  <stop offset="0%" stopColor="#00eefc" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0d1322" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="beamGradient" x1="300" x2="300" y1="200" y2="20">
                  <stop offset="0%" stopColor="#00eefc" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#89ceff" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* 15 Degree Ultrasonic Emitter Wave Arc */}
              <path
                className="opacity-70 animate-pulse"
                d="M 270 190 L 190 20 A 420 420 0 0 1 410 20 Z"
                fill="url(#beamGradient)"
              />
              <path
                className="opacity-80"
                d="M 230 80 A 180 180 0 0 1 370 80"
                stroke="#00eefc"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <path
                className="opacity-50"
                d="M 205 40 A 240 240 0 0 1 395 40"
                stroke="#89ceff"
                strokeWidth="1"
              />

              {/* Reticle Rings */}
              <circle
                cx="300"
                cy="200"
                r="160"
                stroke="#2f3445"
                strokeDasharray="2 6"
                strokeWidth="1"
              />
              <circle
                cx="300"
                cy="200"
                r="120"
                stroke="#0ea5e9"
                strokeOpacity="0.25"
                strokeWidth="1"
              />

              {/* Live Crosshair Marker */}
              <line
                stroke="#0ea5e9"
                strokeOpacity="0.2"
                strokeWidth="0.7"
                x1="300"
                x2="300"
                y1="30"
                y2="330"
              />
              <line
                stroke="#0ea5e9"
                strokeOpacity="0.2"
                strokeWidth="0.7"
                x1="120"
                x2="480"
                y1="200"
                y2="200"
              />

              {/* Active Gauntlet Vector Illustration */}
              {/* Forearm Base Brace */}
              <path
                d="M 220 310 C 220 280 230 250 240 240 L 360 240 C 370 250 380 280 380 310 Z"
                fill="#151b2b"
                stroke="#3e4850"
                strokeWidth="2"
              />
              {/* Wrist Locking Collar */}
              <rect
                fill="#191f2f"
                height="28"
                rx="6"
                stroke="#0ea5e9"
                strokeWidth="1.5"
                width="130"
                x="235"
                y="220"
              />
              <circle cx="248" cy="234" fill="#89ceff" r="4" />
              <circle cx="352" cy="234" fill="#89ceff" r="4" />

              {/* Main Core Chassis (Spider-Man Inspired Spider-Shell) */}
              <polygon
                fill="#0d1322"
                points="300,140 355,175 355,225 245,225 245,175"
                stroke="#89ceff"
                strokeWidth="2"
              />
              <polygon
                fill="#151b2b"
                points="300,152 342,180 342,218 258,218 258,180"
                stroke="#0ea5e9"
                strokeOpacity="0.6"
                strokeWidth="1"
              />

              {/* Center Cartridge Bay Housing Cartridge 01 */}
              <rect
                fill="#080e1d"
                height="52"
                rx="4"
                stroke="#00eefc"
                strokeWidth="1.5"
                width="48"
                x="276"
                y="158"
              />
              <rect
                fill="#003b26"
                height="38"
                rx="2"
                stroke="#4edea3"
                strokeWidth="1"
                width="36"
                x="282"
                y="164"
              />

              {/* Tether Spool Core */}
              <circle
                className="animate-pulse"
                cx="300"
                cy="183"
                fill="#00b17b"
                r="10"
              />
              <path
                d="M 300 173 L 300 150"
                stroke="#4edea3"
                strokeLinecap="round"
                strokeWidth="2.5"
              />

              {/* Ultrasonic Twin Transducers (HC-SR04 / JSN-SR04T) */}
              <circle
                cx="270"
                cy="138"
                fill="#191f2f"
                r="12"
                stroke="#89ceff"
                strokeWidth="2"
              />
              <circle cx="270" cy="138" fill="#0ea5e9" r="7" />
              <circle
                cx="330"
                cy="138"
                fill="#191f2f"
                r="12"
                stroke="#89ceff"
                strokeWidth="2"
              />
              <circle cx="330" cy="138" fill="#0ea5e9" r="7" />

              {/* Dual High-Luminance Tactical LED Beacons */}
              <rect
                fill="#00eefc"
                filter="drop-shadow(0 0 6px #00eefc)"
                height="12"
                rx="2"
                width="8"
                x="248"
                y="148"
              />
              <rect
                fill="#00eefc"
                filter="drop-shadow(0 0 6px #00eefc)"
                height="12"
                rx="2"
                width="8"
                x="344"
                y="148"
              />

              {/* Gauntlet Palm Actuator Wire Cable */}
              <path
                d="M 300 230 C 300 270 300 300 300 330"
                stroke="#0ea5e9"
                strokeDasharray="3 3"
                strokeWidth="2.5"
              />

              {/* HUD Overlaid Target Box */}
              <g
                className="transition-transform duration-500 hover:scale-105 cursor-pointer"
                transform="translate(240, 60)"
              >
                <rect
                  fill="#080e1d"
                  fillOpacity="0.85"
                  height="42"
                  rx="6"
                  stroke="#00eefc"
                  strokeWidth="1"
                  width="120"
                />
                <text
                  fill="#88929b"
                  fontFamily="Inter"
                  fontSize="9"
                  fontWeight="600"
                  x="12"
                  y="18"
                >
                  US-BEAM CONE: 15°
                </text>
                <text
                  fill="#00eefc"
                  fontFamily="Geist"
                  fontSize="12"
                  fontWeight="700"
                  x="12"
                  y="32"
                >
                  124.6 cm CLEAR
                </text>
              </g>
            </svg>

            {/* Dynamic Overlay Pin Labels */}
            <div className="absolute left-4 bottom-4 bg-[#2f3445]/80 border border-[#3e4850]/60 backdrop-blur-md px-3 py-2 rounded-lg text-left shadow-lg">
              <div className="text-[10px] text-[#4edea3] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                CART-01: SOFT TETHER
              </div>
              <div className="text-xs font-semibold text-[#dde2f8]">
                Non-Harmful Assist Primed
              </div>
              <div className="text-[10px] text-[#bec8d2] font-mono">
                Tensile: 450N | Eco-Degradable Poly
              </div>
            </div>

            <div className="absolute right-4 top-16 bg-[#2f3445]/80 border border-[#3e4850]/60 backdrop-blur-md px-3 py-2 rounded-lg text-right shadow-lg hidden sm:block">
              <div className="text-[10px] text-[#89ceff] font-semibold">
                PALM PRESSURE SENSOR
              </div>
              <div className="text-xs font-bold text-[#dde2f8] font-mono">
                FSR-402 ARMED
              </div>
              <div className="text-[10px] text-[#bec8d2]">
                Dual-Tap Trigger Sequence
              </div>
            </div>
          </div>

          {/* Visualizer Footer Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 bg-[#080e1d]/60 border border-[#3e4850]/30 rounded-xl p-3">
            <div>
              <span className="text-[10px] text-[#bec8d2] uppercase font-['Inter']">
                Ejection Solenoid
              </span>
              <p className="text-xs font-semibold text-[#4edea3] font-mono">
                CHARGED (12V STEP)
              </p>
            </div>
            <div>
              <span className="text-[10px] text-[#bec8d2] uppercase font-['Inter']">
                Ultrasonic Ping
              </span>
              <p className="text-xs font-semibold text-[#89ceff] font-mono">
                40 kHz PULSED
              </p>
            </div>
            <div>
              <span className="text-[10px] text-[#bec8d2] uppercase font-['Inter']">
                Gauntlet Thermal
              </span>
              <p className="text-xs font-semibold text-[#dde2f8] font-mono">
                29.4°C NOMINAL
              </p>
            </div>
            <div>
              <span className="text-[10px] text-[#bec8d2] uppercase font-['Inter']">
                Aux Bay 02
              </span>
              <p className="text-xs font-semibold text-[#00eefc] font-mono">
                AEROSOL ENZYME READY
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: ENVIRONMENTAL & 360-DEGREE SPATIAL RADAR (5 cols) */}
        <div className="lg:col-span-5 bg-[#151b2b]/90 border border-[#3e4850]/40 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Radar Title Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00eefc] text-[22px]">
                  radar
                </span>
                <div>
                  <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                    SPATIAL SECTOR RADAR
                  </span>
                  <p className="text-[11px] text-[#bec8d2]">
                    Bandipur Tiger Reserve • Sector 04 Alpha
                  </p>
                </div>
              </div>
              <div className="bg-[#242a3a] border border-[#3e4850]/50 px-2 py-1 rounded text-right">
                <span className="text-[10px] text-[#00eefc] font-mono">
                  SWEEP: 360°/1.2s
                </span>
              </div>
            </div>

            {/* Radar Vector Graphic Canvas */}
            <div className="relative w-full aspect-square max-h-[300px] mx-auto flex items-center justify-center my-2">
              <svg className="w-full h-full" fill="none" viewBox="0 0 320 320">
                {/* Circular Grids */}
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="#3e4850"
                  strokeOpacity="0.5"
                  strokeWidth="1"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="105"
                  stroke="#3e4850"
                  strokeDasharray="4 4"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="70"
                  stroke="#3e4850"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="35"
                  stroke="#0ea5e9"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                />

                {/* Axes */}
                <line
                  stroke="#3e4850"
                  strokeDasharray="2 4"
                  strokeWidth="0.8"
                  x1="160"
                  x2="160"
                  y1="20"
                  y2="300"
                />
                <line
                  stroke="#3e4850"
                  strokeDasharray="2 4"
                  strokeWidth="0.8"
                  x1="20"
                  x2="300"
                  y1="160"
                  y2="160"
                />

                {/* Compass Bearings */}
                <text
                  fill="#88929b"
                  fontFamily="Inter"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  x="160"
                  y="14"
                >
                  000° N
                </text>
                <text
                  fill="#88929b"
                  fontFamily="Inter"
                  fontSize="9"
                  textAnchor="end"
                  x="312"
                  y="163"
                >
                  090° E
                </text>
                <text
                  fill="#88929b"
                  fontFamily="Inter"
                  fontSize="9"
                  textAnchor="middle"
                  x="160"
                  y="315"
                >
                  180° S
                </text>
                <text
                  fill="#88929b"
                  fontFamily="Inter"
                  fontSize="9"
                  textAnchor="start"
                  x="10"
                  y="163"
                >
                  270° W
                </text>

                {/* Canopy Density Arc */}
                <path
                  d="M 160 160 L 250 50 A 140 140 0 0 1 290 190 Z"
                  fill="#00b17b"
                  fillOpacity="0.08"
                />
                <path
                  d="M 60 160 A 140 140 0 0 1 160 20 L 160 160 Z"
                  fill="#0ea5e9"
                  fillOpacity="0.04"
                />

                {/* Rotating Radar Sweep Gradient Ray */}
                <g>
                  <defs>
                    <linearGradient id="radarSweepGrad" gradientTransform="rotate(45)">
                      <stop offset="0%" stopColor="#00eefc" stopOpacity="0" />
                      <stop offset="100%" stopColor="#00eefc" stopOpacity="0.45" />
                    </linearGradient>
                  </defs>
                  <path
                    className="origin-center animate-[spin_4s_linear_infinite]"
                    d="M 160 160 L 260 60 A 140 140 0 0 0 160 20 Z"
                    fill="url(#radarSweepGrad)"
                  />
                </g>

                {/* Target Blip 1: Safe Distance Wildlife (Herbivore / Deer at 4.2m) */}
                <g
                  className="cursor-pointer group"
                  transform="translate(225, 95)"
                  onClick={() => onNavigate('incident-simulator')}
                >
                  <circle
                    className="animate-ping"
                    cx="0"
                    cy="0"
                    fill="#4edea3"
                    fillOpacity="0.25"
                    r="10"
                  />
                  <circle cx="0" cy="0" fill="#4edea3" r="5" />
                  <text
                    fill="#4edea3"
                    fontFamily="Geist"
                    fontSize="10"
                    fontWeight="700"
                    x="8"
                    y="4"
                  >
                    TARGET 01
                  </text>
                  <text fill="#bec8d2" fontFamily="Geist" fontSize="8" x="8" y="15">
                    Herbivore (Deer) ~4.2m
                  </text>
                </g>

                {/* Target Blip 2: Vegetation Cluster */}
                <g transform="translate(100, 215)">
                  <circle cx="0" cy="0" fill="#89ceff" fillOpacity="0.6" r="3" />
                  <text fill="#bec8d2" fontFamily="Geist" fontSize="8" x="6" y="3">
                    Dense Canopy
                  </text>
                </g>

                {/* Ranger Position Marker (Center Hub) */}
                <circle
                  cx="160"
                  cy="160"
                  fill="#89ceff"
                  r="6"
                  stroke="#00344d"
                  strokeWidth="2"
                />
                <circle
                  className="animate-spin"
                  cx="160"
                  cy="160"
                  r="14"
                  stroke="#89ceff"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                />
              </svg>

              {/* Floating Radar Badge */}
              <div className="absolute top-2 left-2 bg-[#2f3445]/90 border border-[#3e4850]/50 px-2 py-1 rounded text-xs">
                <span className="text-[#4edea3] font-semibold flex items-center gap-1 font-['Inter']">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                  SAFE TRACKING
                </span>
              </div>
            </div>

            {/* Radar Legend */}
            <div className="flex items-center justify-between bg-[#242a3a]/60 border border-[#3e4850]/40 rounded-xl p-3 mt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]"></span>
                <div>
                  <span className="text-xs font-semibold text-[#dde2f8]">
                    Target 01: Herbivore Detected
                  </span>
                  <div className="text-[10px] text-[#bec8d2] font-mono">
                    Range: 4.2m • Passive Non-Threat
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#89ceff] font-mono font-bold">
                  ECHO CONF: 96%
                </span>
                <div className="text-[10px] text-[#bec8d2]">Non-Intrusive Audio</div>
              </div>
            </div>
          </div>

          {/* Live Ultrasonic Sparkline Bar Monitor */}
          <div className="mt-3 pt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[10px] font-semibold text-[#bec8d2] uppercase font-['Inter']">
                ECHO AMPLITUDE SPECTRUM
              </span>
              <span className="text-xs text-[#89ceff] font-mono">
                WINDOW: 20ms - 450ms
              </span>
            </div>
            <div className="flex items-end gap-1 h-10 w-full bg-[#080e1d]/80 border border-[#3e4850]/30 p-1 rounded-lg">
              <div className="w-1/12 bg-[#89ceff]/40 h-[25%] rounded-sm"></div>
              <div className="w-1/12 bg-[#89ceff]/50 h-[40%] rounded-sm"></div>
              <div className="w-1/12 bg-[#89ceff]/70 h-[30%] rounded-sm"></div>
              <div className="w-1/12 bg-[#89ceff] h-[85%] rounded-sm"></div>
              <div className="w-1/12 bg-[#4edea3] h-[95%] rounded-sm animate-pulse"></div>
              <div className="w-1/12 bg-[#89ceff] h-[70%] rounded-sm"></div>
              <div className="w-1/12 bg-[#89ceff]/60 h-[45%] rounded-sm"></div>
              <div className="w-1/12 bg-[#89ceff]/40 h-[30%] rounded-sm"></div>
              <div className="w-1/12 bg-[#89ceff]/30 h-[20%] rounded-sm"></div>
              <div className="w-1/12 bg-[#89ceff]/20 h-[15%] rounded-sm"></div>
              <div className="w-1/12 bg-[#89ceff]/20 h-[10%] rounded-sm"></div>
              <div className="w-1/12 bg-[#89ceff]/10 h-[5%] rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* COMMAND CONTROL DECK & INCIDENT SIMULATOR STRIP */}
      <div className="w-full bg-[#151b2b]/90 border border-[#3e4850]/40 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Action Controls Group */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-widest block mb-1 font-['Inter']">
              Field Operation Commands
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Start Patrol Toggle */}
              <button
                onClick={() => setPatrolActive(!patrolActive)}
                type="button"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  patrolActive
                    ? 'bg-[#0ea5e9] text-[#003751] shadow-[0_0_16px_rgba(14,165,233,0.3)]'
                    : 'bg-[#2f3445] text-[#dde2f8] hover:bg-[#33394a]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {patrolActive ? 'explore' : 'pause'}
                </span>
                <span>{patrolActive ? 'START PATROL ROUTE' : 'RESUME PATROL'}</span>
              </button>

              {/* Simulate Incident */}
              <button
                onClick={() => onNavigate('incident-simulator')}
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#242a3a] text-[#dde2f8] hover:bg-[#2f3445] hover:text-[#89ceff] border border-[#3e4850]/40 transition-all text-sm font-medium shadow"
              >
                <span className="material-symbols-outlined text-[#00eefc] text-[20px]">
                  model_training
                </span>
                <span>SIMULATE INCIDENT</span>
              </button>

              {/* Device Test Diagnostic Sweep */}
              <button
                onClick={runDiagnosticSweep}
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#242a3a] text-[#dde2f8] hover:bg-[#2f3445] hover:text-[#4edea3] border border-[#3e4850]/40 transition-all text-sm font-medium shadow"
              >
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                  build_circle
                </span>
                <span>RUN DIAGNOSTIC SWEEP</span>
              </button>
            </div>
          </div>
        </div>

        {/* EMERGENCY SOS HOLD-TRIGGER */}
        <div className="flex items-center gap-4 bg-[#080e1d]/80 border border-[#3e4850]/40 p-2.5 rounded-xl">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-xs font-semibold text-[#ffb4ab]">CRITICAL OVERRIDE</span>
            <span className="text-[10px] text-[#bec8d2]">LoRa Mesh Flood Dispatch</span>
          </div>

          <div className="relative group">
            <button
              onMouseDown={startSosHold}
              onMouseUp={cancelSosHold}
              onMouseLeave={cancelSosHold}
              onTouchStart={startSosHold}
              onTouchEnd={cancelSosHold}
              type="button"
              className={`relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-xl font-['Inter'] text-sm font-bold tracking-wider transition-all select-none ${
                sosDispatched
                  ? 'bg-[#93000a] text-[#ffdad6] shadow-[0_0_24px_rgba(239,68,68,0.5)]'
                  : 'bg-[#ffb4ab] text-[#690005] hover:bg-[#ef4444] hover:text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[24px] animate-bounce">
                sos
              </span>
              <span>{sosDispatched ? 'SOS DISPATCHED' : 'HOLD SOS (3s)'}</span>

              {/* Dynamic hold fill track */}
              <span
                className="absolute bottom-0 left-0 h-1.5 bg-white transition-all duration-75"
                style={{ width: `${sosProgress}%` }}
              ></span>
            </button>
          </div>
        </div>
      </div>

      {/* DIAGNOSTIC SWEEP SIMULATION CONSOLE MODAL */}
      {isDiagOpen && (
        <div className="w-full bg-[#242a3a]/95 border border-[#4edea3]/40 backdrop-blur-2xl rounded-2xl p-5 shadow-2xl transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-[#3e4850]/40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[24px]">
                verified
              </span>
              <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                HARDWARE DIAGNOSTIC SUITE & SUB-CIRCUIT SWEEP
              </span>
            </div>
            <button
              onClick={() => setIsDiagOpen(false)}
              className="text-[#bec8d2] hover:text-[#dde2f8] p-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 my-4">
            {/* 1: Ultrasonic */}
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-2.5 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] text-[#bec8d2]">ULTRASONIC</span>
              <div className="text-[11px] font-mono font-semibold text-[#89ceff] my-1">
                JSN-SR04T
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  diagStep >= 2 ? 'text-[#4edea3]' : 'text-[#bec8d2]'
                }`}
              >
                {diagStep >= 2 ? 'PASSED (0 err)' : 'CHECKING...'}
              </span>
            </div>

            {/* 2: PIR Motion */}
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-2.5 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] text-[#bec8d2]">PIR MOTION</span>
              <div className="text-[11px] font-mono font-semibold text-[#89ceff] my-1">
                HC-SR505
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  diagStep >= 3 ? 'text-[#4edea3]' : 'text-[#bec8d2]'
                }`}
              >
                {diagStep >= 3 ? 'PASSED (0 err)' : 'STANDBY'}
              </span>
            </div>

            {/* 3: OLED */}
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-2.5 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] text-[#bec8d2]">SSD1306 OLED</span>
              <div className="text-[11px] font-mono font-semibold text-[#89ceff] my-1">
                I2C 0x3C
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  diagStep >= 4 ? 'text-[#4edea3]' : 'text-[#bec8d2]'
                }`}
              >
                {diagStep >= 4 ? 'PASSED (0 err)' : 'STANDBY'}
              </span>
            </div>

            {/* 4: Buzzer */}
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-2.5 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] text-[#bec8d2]">PIEZO ALARM</span>
              <div className="text-[11px] font-mono font-semibold text-[#89ceff] my-1">
                85dB PWM
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  diagStep >= 5 ? 'text-[#4edea3]' : 'text-[#bec8d2]'
                }`}
              >
                {diagStep >= 5 ? 'PASSED (0 err)' : 'STANDBY'}
              </span>
            </div>

            {/* 5: Servo */}
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-2.5 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] text-[#bec8d2]">SG90 SERVO</span>
              <div className="text-[11px] font-mono font-semibold text-[#89ceff] my-1">
                9g Metal-Gear
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  diagStep >= 6 ? 'text-[#4edea3]' : 'text-[#bec8d2]'
                }`}
              >
                {diagStep >= 6 ? 'PASSED (0 err)' : 'STANDBY'}
              </span>
            </div>

            {/* 6: Haptic */}
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-2.5 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] text-[#bec8d2]">HAPTIC COIN</span>
              <div className="text-[11px] font-mono font-semibold text-[#89ceff] my-1">
                Silent ERM 1027
              </div>
              <span
                className={`text-[10px] font-semibold ${
                  diagStep >= 7 ? 'text-[#4edea3]' : 'text-[#bec8d2]'
                }`}
              >
                {diagStep >= 7 ? 'PASSED (0 err)' : 'STANDBY'}
              </span>
            </div>
          </div>

          <div className="bg-[#080e1d] p-3 rounded-lg font-mono text-xs text-[#89ceff] space-y-1 max-h-36 overflow-y-auto">
            {diagLogs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* MONOSPACE TELEMETRY STREAM & DEMONSTRATOR NOTICE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Stream Terminal (8 cols) */}
        <div className="lg:col-span-8 bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-md rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#89ceff] text-[18px]">
                terminal
              </span>
              <span className="text-[10px] font-bold text-[#dde2f8] uppercase font-['Inter'] tracking-wider">
                LIVE SENSOR TELEMETRY STREAM
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping"></span>
              <span className="text-[10px] text-[#4edea3] font-mono">10 HZ POLLING</span>
            </div>
          </div>

          <div className="bg-[#080e1d]/90 border border-[#3e4850]/30 rounded-lg p-3 font-mono text-xs text-[#bec8d2] h-28 overflow-hidden relative flex flex-col justify-end space-y-1">
            {telemetryLogs.map((entry, index) => (
              <div
                key={index}
                className={
                  index === telemetryLogs.length - 1
                    ? 'text-[#dde2f8] font-semibold truncate'
                    : 'text-[#89ceff]/70 truncate'
                }
              >
                {entry}
              </div>
            ))}
          </div>
        </div>

        {/* Demonstrator Notice Box (4 cols) */}
        <div className="lg:col-span-4 bg-[#242a3a]/80 border border-[#3e4850]/40 backdrop-blur-md rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                psychology
              </span>
              <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                Design Thinking Demo
              </span>
            </div>
            <p className="text-xs text-[#bec8d2] leading-relaxed">
              RANGER-X demonstrates a zero-harm, Spider-Man-inspired wearable device engineering framework for wildland officers. Engineered with biodegradable soft nets and safe ultrasonic deterrence to prevent animal trauma.
            </p>
          </div>
          <div className="pt-3 flex items-center justify-between border-t border-[#3e4850]/30 mt-2">
            <span className="text-[10px] text-[#89ceff] font-mono">
              B.TECH ENG CONCEPT
            </span>
            <span className="text-[10px] text-[#4edea3] font-semibold uppercase">
              100% NON-LETHAL SPEC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';

type PerspectiveType = 'isometric' | 'top' | 'side' | 'wrist';

interface HardwareData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  desc: string;
  v: string;
  rate: string;
  range: string;
  bus: string;
  rationale: string;
}

const hwSpecs: Record<string, HardwareData> = {
  controller: {
    id: 'MOD-MCU-ESP32',
    title: 'Arduino / ESP32 Controller Hub',
    subtitle: 'Dual-Core 32-Bit Microcontroller System',
    icon: 'memory',
    iconColor: 'text-[#89ceff]',
    desc: 'Acts as the central autonomic logic nucleus of RANGER-X. Polls environmental ultrasonic and PIR sensors at 50Hz, manages battery distribution states, and orchestrates haptic cue sequences.',
    v: '3.3V System Logic',
    rate: '50 Hz Polling Loop',
    range: 'Internal I/O Matrix',
    bus: 'SPI / I2C / UART / GPIO',
    rationale:
      'Affordable, well-documented architecture for undergraduate engineers offering integrated Bluetooth LE for instant mobile node mesh pairing.',
  },
  ultrasonic: {
    id: 'MOD-US-01',
    title: 'Ultrasonic Sensor (Waterproof)',
    subtitle: 'JSN-SR04T Sealed Acoustic Transceiver',
    icon: 'hearing',
    iconColor: 'text-[#89ceff]',
    desc: 'Emits 40kHz acoustic sonar waves with sealed piezoelectric transducer. Accurately gauges distances from 20mm up to 4000mm in dense wet scrub or rainfall without optic fogging, providing early alert of approaching fauna.',
    v: '3.3V – 5.0V DC',
    rate: '50 Hz Continuous',
    range: '2cm to 400cm',
    bus: 'GPIO Pulse / Echo Delay',
    rationale:
      'Selected over infrared LIDAR due to moisture-heavy rainforest canopy reliability and sub-$4 academic budgetary constraints.',
  },
  pir: {
    id: 'MOD-PIR-505',
    title: 'PIR Motion Sensor (Pyroelectric)',
    subtitle: 'Miniature Passive Heat Signature Detector',
    icon: 'motion_photos_on',
    iconColor: 'text-[#4edea3]',
    desc: 'Detects moving biological thermal signatures even through thick foliage. Filters background environmental thermal drift to avoid false alarms from windblown leaves.',
    v: '4.5V – 12V (Reg. 3.3V)',
    rate: '15 Hz Sensitivity Cycle',
    range: 'Up to 3.0m in field',
    bus: 'Digital High/Low Pin',
    rationale:
      'Passive low-power consumption allows 24/7 background perimeter standby without draining battery reserves.',
  },
  oled: {
    id: 'MOD-DSP-096',
    title: 'Micro OLED Display (1.3")',
    subtitle: 'SH1106 High-Contrast Monochrome HUD',
    icon: 'screenshot_monitor',
    iconColor: 'text-[#00eefc]',
    desc: 'Renders crisp high-visibility telemetry in pitch-black nocturnal conditions without eye-fatiguing backlight bleed. Shows distance radar, digital compass heading, and battery reserves.',
    v: '3.3V Supply',
    rate: '60 FPS Refresh',
    range: 'Wide 160° Field of View',
    bus: 'I2C (Address 0x3C)',
    rationale:
      'True black contrast prevents tactical light pollution that could startle skittish nocturnal wildlife.',
  },
  piezo: {
    id: 'MOD-BUZ-85',
    title: 'Piezo Acoustic Deterrence Buzzer',
    subtitle: 'Frequency-Agile Sound Generator',
    icon: 'volume_up',
    iconColor: 'text-[#00eefc]',
    desc: 'Produces frequency-modulated sweep alerts ranging from 2.5kHz up to 4kHz. Capable of generating non-lethal acoustic discomfort to discourage predator approach before physical contact occurs.',
    v: '3.0V – 5.0V DC',
    rate: 'Up to 4 kHz PWM Sweep',
    range: '85dB at 10cm Output',
    bus: 'PWM Output Channel',
    rationale:
      'Harmless acoustic deterrence adheres to zero-injury wildlife intervention engineering design ethics.',
  },
  haptic: {
    id: 'MOD-ERM-10',
    title: 'Silent Haptic Vibration Motor',
    subtitle: 'Subtle Tactile Warning Disc',
    icon: 'vibration',
    iconColor: 'text-[#4edea3]',
    desc: 'Provides variable frequency wrist vibrations. Alerts the ranger to proximity spikes or blind-spot movements completely silently, allowing stealth reconnaissance without alerting animal targets.',
    v: '2.5V – 3.7V Direct',
    rate: '12,000 RPM Max',
    range: 'Direct Wrist Coupling',
    bus: 'Transistor Switched GPIO',
    rationale:
      'Ensures the human operator maintains situational awareness even under high ambient auditory storm noise.',
  },
  servo: {
    id: 'MOD-SRV-9G',
    title: 'Micro Servo Motor Mechanism',
    subtitle: 'MG90S Metal-Gear Actuation Arm',
    icon: 'precision_manufacturing',
    iconColor: 'text-[#89ceff]',
    desc: 'High-torque digital micro servo engineered to mechanically trigger modular rescue payloads (e.g., non-harmful net release, repellent mist, or beacon deployment) on tactile command.',
    v: '4.8V – 6.0V (Boosted)',
    rate: '0.10s / 60 degrees',
    range: '180° Angular Sweep',
    bus: 'Standard 50Hz PWM Servo Pin',
    rationale:
      'Metal internal gears resist jamming caused by fine grit, dust, and outdoor trail vibrations.',
  },
  battery: {
    id: 'MOD-PWR-650',
    title: 'LiPo 3.7V Power Cell & Management',
    subtitle: 'Lithium Polymer Reversible Cell',
    icon: 'battery_saver',
    iconColor: 'text-[#4edea3]',
    desc: 'Provides autonomous wrist-mounted operation for up to 14 hours on intermittent eco-mode. Features magnetic pogo-pin rapid recharging contact points.',
    v: '3.7V Nominal (4.2V Peak)',
    rate: '650 mAh Capacity',
    range: '14 Hours Continuous',
    bus: 'I2C Fuel Gauge (MAX17043)',
    rationale:
      'Ultra-thin pouch factor fits flat under the forearm ergonomically without restricting wrist flexion.',
  },
  trigger: {
    id: 'MOD-SW-EMG',
    title: 'Tactile Emergency Trigger Switch',
    subtitle: 'Sealed SOS Detent Thumb Actuator',
    icon: 'touch_app',
    iconColor: 'text-[#ffb4ab]',
    desc: 'Tactically positioned along the radial index-finger ridge. Features a physical 2.5N threshold spring detent to prevent unintended firing while remaining instantly accessible in distress situations.',
    v: '3.3V Pulled High',
    rate: 'Instantaneous Hardware Interrupt',
    range: 'Single-Action Detent',
    bus: 'Hardware Interrupt GPIO',
    rationale:
      'Guarantees reliable SOS distress telemetry transmission even with gloved, wet, or muddy hands.',
  },
};

export const RangerXDeviceView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'assembled' | 'exploded'>('assembled');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [currentRotY, setCurrentRotY] = useState<number>(0);
  const [currentRotX, setCurrentRotX] = useState<number>(16);
  const [selectedHw, setSelectedHw] = useState<string>('ultrasonic');
  const [inspectStatus, setInspectStatus] = useState<string>('ACTIVE SPEC');

  const rotateModel = (delta: number) => {
    setCurrentRotY((prev) => (prev + delta) % 360);
  };

  const setPerspective = (type: PerspectiveType) => {
    if (type === 'isometric') {
      setCurrentRotX(16);
      setCurrentRotY(25);
    } else if (type === 'top') {
      setCurrentRotX(75);
      setCurrentRotY(0);
    } else if (type === 'side') {
      setCurrentRotX(0);
      setCurrentRotY(90);
    } else if (type === 'wrist') {
      setCurrentRotX(35);
      setCurrentRotY(-45);
    }
  };

  const resetCamera = () => {
    setCurrentRotX(16);
    setCurrentRotY(0);
  };

  const handleInspect = (key: string) => {
    setSelectedHw(key);
    setInspectStatus('INSPECTING');
    setTimeout(() => {
      setInspectStatus('ACTIVE SPEC');
    }, 600);
  };

  const currentHw = hwSpecs[selectedHw] || hwSpecs.ultrasonic;

  return (
    <div className="flex flex-col w-full gap-6 pb-10">
      {/* Top System Header Rail */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-xl p-4 rounded-xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#242a3a] border border-[#3e4850]/50 flex items-center justify-center text-[#89ceff] shadow-sm">
            <span className="material-symbols-outlined text-[28px]">deployed_code</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-['Inter'] text-lg font-bold text-[#dde2f8]">
                RANGER-X WRIST-HUD UNIT
              </span>
              <span className="px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] text-[10px] font-semibold uppercase font-['Inter']">
                CAD V2.4 PROTOTYPE
              </span>
              <span className="px-2 py-0.5 rounded bg-[#89ceff]/10 text-[#89ceff] text-[10px] font-semibold uppercase font-['Inter']">
                ACADEMIC SPEC
              </span>
            </div>
            <span className="text-xs font-mono text-[#bec8d2]">
              MK-IV WEARABLE FAUNA RADAR & ACTUATION TERMINAL // ASSEMBLED BOM ESTIMATE: $41.80
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-[#2f3445]/60 rounded-lg p-1 border border-[#3e4850]/40">
            <button
              onClick={() => setViewMode('assembled')}
              className={`px-4 py-1.5 rounded font-['Inter'] text-xs font-semibold transition-all ${
                viewMode === 'assembled'
                  ? 'text-[#dde2f8] bg-[#191f2f] shadow-sm'
                  : 'text-[#bec8d2] hover:text-[#dde2f8]'
              }`}
              type="button"
            >
              Assembled
            </button>
            <button
              onClick={() => setViewMode('exploded')}
              className={`px-4 py-1.5 rounded font-['Inter'] text-xs font-semibold transition-all ${
                viewMode === 'exploded'
                  ? 'text-[#dde2f8] bg-[#191f2f] shadow-sm'
                  : 'text-[#bec8d2] hover:text-[#dde2f8]'
              }`}
              type="button"
            >
              Exploded View (5 Layers)
            </button>
          </div>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase font-['Inter'] transition-all ${
              wireframe
                ? 'bg-[#0ea5e9]/20 text-[#89ceff] border-[#89ceff]'
                : 'bg-[#191f2f] text-[#bec8d2] hover:text-[#dde2f8] border-[#3e4850]/40'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">schema</span>
            <span>Mesh Ghost</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: CAD Viewer + Detail Inspector Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Center Interactive CAD / SVG Engine Canvas (XL Col 8) */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          <div className="relative w-full h-[620px] bg-[#080e1d] border border-[#3e4850]/40 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center select-none group">
            {/* Background Ambient HUD Reticles & Vector Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    height="40"
                    id="cadGrid"
                    patternUnits="userSpaceOnUse"
                    width="40"
                  >
                    <path
                      className="text-[#89ceff]"
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect fill="url(#cadGrid)" height="100%" width="100%" />
                <circle
                  className="text-[#0ea5e9]"
                  cx="50%"
                  cy="50%"
                  fill="none"
                  r="220"
                  stroke="currentColor"
                  strokeDasharray="4 6"
                  strokeWidth="1"
                />
                <circle
                  className="text-[#d3fbff]"
                  cx="50%"
                  cy="50%"
                  fill="none"
                  r="140"
                  stroke="currentColor"
                  strokeDasharray="2 4"
                  strokeWidth="0.75"
                />
                <line
                  className="text-[#89ceff]"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  strokeWidth="0.5"
                  x1="50%"
                  x2="50%"
                  y1="20"
                  y2="95%"
                />
                <line
                  className="text-[#89ceff]"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  strokeWidth="0.5"
                  x1="5%"
                  x2="95%"
                  y1="50%"
                  y2="50%"
                />
              </svg>
            </div>

            {/* Top-Left CAD Telemetry Pill */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-[#151b2b]/90 border border-[#3e4850]/50 backdrop-blur-md p-3 rounded-lg shadow-md pointer-events-none">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                RENDER STATE:{' '}
                <span
                  className={`font-mono text-xs ${
                    viewMode === 'exploded' ? 'text-[#00eefc]' : 'text-[#89ceff]'
                  }`}
                >
                  {viewMode === 'exploded'
                    ? '5-LAYER EXPLODED CAD'
                    : 'SOLID ASSEMBLED'}
                </span>
              </div>
              <div className="text-xs font-mono text-[#bec8d2] flex gap-4">
                <span>FOV: 55°</span>
                <span>
                  ROT: <span className="text-[#4edea3]">{currentRotY % 360}°</span>
                </span>
                <span>SCALE: 1:1.2</span>
              </div>
            </div>

            {/* Top-Right Layer Counter (Exploded Active) */}
            {viewMode === 'exploded' && (
              <div className="absolute top-4 right-4 z-20 bg-[#0ea5e9]/20 border border-[#0ea5e9]/50 text-[#89ceff] px-4 py-1.5 rounded-lg text-xs font-mono font-bold shadow-md">
                ASSEMBLY EXPLOSION: 5 DISCRETE STACKS (+140mm)
              </div>
            )}

            {/* Central 3D Canvas Stage */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`,
              }}
            >
              {/* Stack container */}
              <div className="relative w-[340px] h-[340px] flex items-center justify-center">
                {/* LAYER 1: Bezel & Sapphire Glass */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    transform:
                      viewMode === 'exploded'
                        ? 'translateY(-140px) translateZ(80px)'
                        : 'translateY(0px) translateZ(0px)',
                  }}
                >
                  <div
                    className={`relative w-72 h-72 rounded-3xl bg-gradient-to-tr from-[#242a3a]/90 via-[#33394a]/70 to-[#2f3445]/90 border border-[#89ceff]/30 shadow-2xl backdrop-blur-md flex items-center justify-center ${
                      wireframe ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <div className="absolute inset-2 rounded-2xl bg-[#080e1d]/80 border border-[#3e4850]/40 flex items-center justify-center overflow-hidden">
                      <div className="absolute -top-24 -left-24 w-80 h-32 bg-white/5 rotate-45 pointer-events-none blur-sm"></div>
                      <div className="text-center text-[10px] font-bold text-[#bec8d2] uppercase tracking-widest pointer-events-none font-['Inter']">
                        Gorilla Glass 2.5D // AR Coated
                      </div>
                    </div>
                    {viewMode === 'exploded' && (
                      <div className="absolute -right-36 top-6 bg-[#242a3a] border border-[#89ceff]/50 text-[#dde2f8] px-2.5 py-1 rounded text-[10px] font-bold shadow-lg whitespace-nowrap font-['Inter']">
                        L1: Sapphire Bezel Rim
                      </div>
                    )}
                  </div>
                </div>

                {/* LAYER 2: Sensors, Display & Trigger Pin */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    transform:
                      viewMode === 'exploded'
                        ? 'translateY(-70px) translateZ(40px)'
                        : 'translateY(0px) translateZ(0px)',
                  }}
                >
                  <div
                    className={`relative w-64 h-64 rounded-2xl bg-[#242a3a]/80 border border-[#0ea5e9]/40 shadow-xl flex flex-col items-center justify-between p-4 ${
                      wireframe ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    {/* Top Sensors */}
                    <div className="w-full flex items-center justify-around pt-1">
                      {/* Hotspot 1: Ultrasonic */}
                      <button
                        onClick={() => handleInspect('ultrasonic')}
                        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#080e1d] border border-[#89ceff] text-[#89ceff] shadow-[0_0_12px_rgba(14,165,233,0.4)] hover:scale-110 transition-transform"
                        type="button"
                        title="Waterproof Ultrasonic Sonar"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#080e1d] flex items-center justify-center text-white">
                          <span className="material-symbols-outlined text-[18px]">
                            hearing
                          </span>
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#89ceff] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#89ceff]"></span>
                        </span>
                      </button>

                      {/* Hotspot 2: PIR Motion Sensor */}
                      <button
                        onClick={() => handleInspect('pir')}
                        className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-[#080e1d] border border-[#4edea3] text-[#4edea3] shadow-[0_0_10px_rgba(78,222,163,0.4)] hover:scale-110 transition-transform"
                        type="button"
                        title="PIR Motion Sensor"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#242a3a] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-[#4edea3]">
                            motion_photos_on
                          </span>
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4edea3]"></span>
                        </span>
                      </button>

                      {/* Ultrasonic Receiver Pair */}
                      <div className="w-12 h-12 rounded-full bg-[#080e1d] border border-[#3e4850] flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00eefc] to-[#080e1d] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-[#0d1322]">
                            surround_sound
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hotspot 3: Micro OLED Display 1.3" HUD */}
                    <button
                      onClick={() => handleInspect('oled')}
                      className="w-48 h-24 rounded-lg bg-[#080e1d] border border-[#00eefc]/50 p-2 shadow-inner flex flex-col justify-between hover:scale-[1.02] transition-transform text-left cursor-pointer"
                      type="button"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#00eefc] font-mono">
                          RANGE: 1.84m
                        </span>
                        <span className="text-[10px] text-[#4edea3] font-mono">
                          WILDLIFE DET
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="font-['Inter'] text-xl font-bold tracking-tight text-[#89ceff]">
                          184
                          <span className="text-[10px] font-normal text-[#bec8d2] ml-0.5 font-mono">
                            CM
                          </span>
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-3 bg-[#4edea3] rounded-xs"></span>
                          <span className="w-1.5 h-4 bg-[#4edea3] rounded-xs"></span>
                          <span className="w-1.5 h-2 bg-[#bec8d2]/40 rounded-xs"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[#bec8d2] text-[9px] font-mono">
                        <span>HDG 312° NW</span>
                        <span>PWR 94%</span>
                      </div>
                    </button>

                    {/* Right Side Thumb Trigger Button Hotspot */}
                    <button
                      onClick={() => handleInspect('trigger')}
                      className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-14 rounded-r-xl bg-gradient-to-r from-[#ffb4ab] to-[#93000a] text-white flex flex-col items-center justify-center shadow-lg hover:translate-x-1 transition-transform border border-[#ffdad6]/40 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">touch_app</span>
                      <span className="text-[8px] -rotate-90 mt-1 uppercase font-bold font-['Inter']">
                        SOS
                      </span>
                    </button>

                    {viewMode === 'exploded' && (
                      <div className="absolute -right-36 top-10 bg-[#242a3a] border border-[#0ea5e9]/50 text-[#dde2f8] px-2.5 py-1 rounded text-[10px] font-bold shadow-lg whitespace-nowrap font-['Inter']">
                        L2: Sensor Optics & OLED HUD
                      </div>
                    )}
                  </div>
                </div>

                {/* LAYER 3: Main Logic Motherboard */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    transform:
                      viewMode === 'exploded'
                        ? 'translateY(0px) translateZ(0px)'
                        : 'translateY(0px) translateZ(0px)',
                  }}
                >
                  <div
                    className={`relative w-60 h-60 rounded-xl bg-[#0b241b] border border-[#4edea3]/40 shadow-xl p-3 flex flex-col justify-between ${
                      wireframe ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    {/* PCB Traces */}
                    <div className="absolute inset-0 opacity-25 pointer-events-none">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M 20 40 H 80 V 120 H 160"
                          fill="none"
                          stroke="#4edea3"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M 200 40 V 90 H 120 V 180"
                          fill="none"
                          stroke="#4edea3"
                          strokeWidth="1.5"
                        />
                        <circle cx="80" cy="120" fill="#4edea3" r="3" />
                        <circle cx="120" cy="90" fill="#4edea3" r="3" />
                      </svg>
                    </div>

                    {/* MCU Button */}
                    <div className="flex items-center justify-between z-10">
                      <button
                        onClick={() => handleInspect('controller')}
                        className="p-2 rounded-lg bg-[#080e1d] border border-[#89ceff]/50 text-[#89ceff] shadow-md hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          memory
                        </span>
                        <div className="text-left leading-tight">
                          <span className="font-bold text-xs text-[#dde2f8] block">
                            ESP32 MCU
                          </span>
                          <span className="text-[10px] text-[#bec8d2]">
                            240MHz / 50Hz Loop
                          </span>
                        </div>
                      </button>

                      {/* Piezo Buzzer Hotspot */}
                      <button
                        onClick={() => handleInspect('piezo')}
                        className="w-9 h-9 rounded-full bg-[#2f3445] border border-[#00eefc] text-[#00eefc] flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
                        type="button"
                        title="Piezo Buzzer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          volume_up
                        </span>
                      </button>
                    </div>

                    {/* Bottom Haptic */}
                    <div className="flex items-center justify-between z-10">
                      <button
                        onClick={() => handleInspect('haptic')}
                        className="px-2 py-1.5 rounded bg-[#151b2b] border border-[#4edea3]/40 text-[#4edea3] flex items-center gap-1.5 hover:scale-105 transition-transform text-xs cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          vibration
                        </span>
                        <span className="text-[10px] font-semibold">SILENT HAPTIC</span>
                      </button>
                      <span className="text-[10px] font-mono text-[#6ffbbe]">
                        REV 1.9 PCB
                      </span>
                    </div>

                    {viewMode === 'exploded' && (
                      <div className="absolute -right-36 top-14 bg-[#242a3a] border border-[#4edea3]/50 text-[#dde2f8] px-2.5 py-1 rounded text-[10px] font-bold shadow-lg whitespace-nowrap font-['Inter']">
                        L3: Core PCB Logic Motherboard
                      </div>
                    )}
                  </div>
                </div>

                {/* LAYER 4: Cartridge Dock & Micro Servo */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    transform:
                      viewMode === 'exploded'
                        ? 'translateY(70px) translateZ(-40px)'
                        : 'translateY(0px) translateZ(0px)',
                  }}
                >
                  <div
                    className={`relative w-64 h-64 rounded-2xl bg-[#191f2f] border border-[#3e4850]/50 shadow-xl p-4 flex flex-col justify-between ${
                      wireframe ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Servo Actuator */}
                      <button
                        onClick={() => handleInspect('servo')}
                        className="p-2 rounded-lg bg-[#242a3a] border border-[#89ceff]/40 text-[#89ceff] flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          precision_manufacturing
                        </span>
                        <div className="text-left">
                          <span className="font-bold text-xs text-[#dde2f8] block">
                            SERVO ACTUATOR
                          </span>
                          <span className="text-[10px] text-[#bec8d2]">
                            MG90S Metal-Gear 9g
                          </span>
                        </div>
                      </button>

                      {/* LiPo Cell */}
                      <button
                        onClick={() => handleInspect('battery')}
                        className="p-2 rounded-lg bg-[#242a3a] border border-[#4edea3]/40 text-[#4edea3] flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          battery_saver
                        </span>
                        <div className="text-left">
                          <span className="font-bold text-xs text-[#dde2f8] block">
                            LIPO CELL
                          </span>
                          <span className="text-[10px] text-[#bec8d2]">
                            3.7V 650mAh
                          </span>
                        </div>
                      </button>
                    </div>

                    <div className="w-full bg-[#080e1d]/80 border border-[#3e4850]/40 rounded-lg p-2 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-semibold text-[#bec8d2]">
                        NON-HARMFUL CARTRIDGE BAY
                      </span>
                      <span className="text-[10px] font-mono text-[#89ceff]">
                        MAGNETIC DETENT
                      </span>
                    </div>

                    {viewMode === 'exploded' && (
                      <div className="absolute -right-36 top-20 bg-[#242a3a] border border-[#89ceff]/50 text-[#dde2f8] px-2.5 py-1 rounded text-[10px] font-bold shadow-lg whitespace-nowrap font-['Inter']">
                        L4: Actuation Bay & Servo
                      </div>
                    )}
                  </div>
                </div>

                {/* LAYER 5: Anodized Aerospace Baseplate & Wrist Straps */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    transform:
                      viewMode === 'exploded'
                        ? 'translateY(140px) translateZ(-80px)'
                        : 'translateY(0px) translateZ(0px)',
                  }}
                >
                  {/* Silicone Straps */}
                  <div className="absolute -top-16 w-36 h-20 bg-gradient-to-b from-[#2f3445] to-[#242a3a] rounded-t-2xl shadow-lg flex items-start justify-center pt-2 border-t border-[#3e4850]/50">
                    <div className="w-12 h-1 bg-[#88929b]/40 rounded-full"></div>
                  </div>
                  <div className="absolute -bottom-16 w-36 h-20 bg-gradient-to-t from-[#2f3445] to-[#242a3a] rounded-b-2xl shadow-lg flex items-end justify-center pb-2 border-b border-[#3e4850]/50">
                    <div className="w-12 h-1 bg-[#88929b]/40 rounded-full"></div>
                  </div>

                  {/* Chassis Base Plate */}
                  <div
                    className={`relative w-72 h-72 rounded-3xl bg-[#242a3a] border border-[#3e4850]/70 shadow-2xl flex items-center justify-center ${
                      wireframe ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <div className="w-56 h-56 rounded-2xl bg-[#151b2b] border border-[#3e4850]/40 flex flex-col items-center justify-center gap-1 p-4 text-center">
                      <span className="material-symbols-outlined text-[32px] text-[#bec8d2]/40">
                        front_hand
                      </span>
                      <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
                        Reinforced Aluminum 6061 // Hypoallergenic Silicone
                      </span>
                      <span className="text-[10px] font-mono text-[#89ceff]">
                        SERIAL: R-X-2025-01
                      </span>
                    </div>

                    {viewMode === 'exploded' && (
                      <div className="absolute -right-36 top-24 bg-[#242a3a] border border-[#3e4850] text-[#dde2f8] px-2.5 py-1 rounded text-[10px] font-bold shadow-lg whitespace-nowrap font-['Inter']">
                        L5: Chassis Base & Strap Rig
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CAD Viewport Controller Dock */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between gap-2 bg-[#151b2b]/90 border border-[#3e4850]/50 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => rotateModel(-45)}
                  className="w-8 h-8 rounded bg-[#191f2f] hover:bg-[#242a3a] text-[#dde2f8] flex items-center justify-center border border-[#3e4850]/40 transition-colors"
                  title="Rotate CCW (-45°)"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    rotate_left
                  </span>
                </button>
                <button
                  onClick={() => rotateModel(45)}
                  className="w-8 h-8 rounded bg-[#191f2f] hover:bg-[#242a3a] text-[#dde2f8] flex items-center justify-center border border-[#3e4850]/40 transition-colors"
                  title="Rotate CW (+45°)"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    rotate_right
                  </span>
                </button>
                <div className="w-px h-5 bg-[#2f3445] mx-1"></div>
                <button
                  onClick={() => setPerspective('isometric')}
                  className="px-2.5 py-1 rounded bg-[#191f2f] hover:bg-[#242a3a] text-[10px] font-semibold text-[#dde2f8] border border-[#3e4850]/40 font-['Inter']"
                  type="button"
                >
                  ISO 3D
                </button>
                <button
                  onClick={() => setPerspective('top')}
                  className="px-2.5 py-1 rounded bg-[#191f2f] hover:bg-[#242a3a] text-[10px] font-semibold text-[#dde2f8] border border-[#3e4850]/40 font-['Inter']"
                  type="button"
                >
                  Top View
                </button>
                <button
                  onClick={() => setPerspective('side')}
                  className="px-2.5 py-1 rounded bg-[#191f2f] hover:bg-[#242a3a] text-[10px] font-semibold text-[#dde2f8] border border-[#3e4850]/40 font-['Inter']"
                  type="button"
                >
                  Side Profile
                </button>
                <button
                  onClick={() => setPerspective('wrist')}
                  className="px-2.5 py-1 rounded bg-[#191f2f] hover:bg-[#242a3a] text-[10px] font-semibold text-[#dde2f8] border border-[#3e4850]/40 font-['Inter']"
                  type="button"
                >
                  Wrist Fit
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#bec8d2] hidden sm:inline font-mono">
                  CLICK HOTSPOTS TO INSPECT HARDWARE SPECS
                </span>
                <button
                  onClick={resetCamera}
                  className="flex items-center gap-1 text-[#89ceff] hover:text-[#00eefc] text-[10px] font-bold uppercase font-['Inter']"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    restart_alt
                  </span>
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Exploded View Layer Legend Navigator */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-3 rounded-lg flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#89ceff] font-['Inter']">
                L1: BEZEL
              </span>
              <span className="text-xs font-semibold text-[#dde2f8] truncate">
                Sapphire Shield
              </span>
              <span className="text-[10px] text-[#bec8d2]">AR-coated glass</span>
            </div>
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-3 rounded-lg flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#89ceff] font-['Inter']">
                L2: SENSOR HUD
              </span>
              <span className="text-xs font-semibold text-[#dde2f8] truncate">
                Ultrasonic & OLED
              </span>
              <span className="text-[10px] text-[#bec8d2]">Dual 40kHz + 1.3" HUD</span>
            </div>
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-3 rounded-lg flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#89ceff] font-['Inter']">
                L3: CORE PCB
              </span>
              <span className="text-xs font-semibold text-[#dde2f8] truncate">
                ESP32 & Haptic
              </span>
              <span className="text-[10px] text-[#bec8d2]">50Hz Polling MCU</span>
            </div>
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-3 rounded-lg flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#89ceff] font-['Inter']">
                L4: ACTUATION
              </span>
              <span className="text-xs font-semibold text-[#dde2f8] truncate">
                Servo Bay & LiPo
              </span>
              <span className="text-[10px] text-[#bec8d2]">Micro metal-gear</span>
            </div>
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-3 rounded-lg flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#89ceff] font-['Inter']">
                L5: CHASSIS
              </span>
              <span className="text-xs font-semibold text-[#dde2f8] truncate">
                Anodized 6061
              </span>
              <span className="text-[10px] text-[#bec8d2]">Dual safety clasp</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Hardware Hotspot Inspector Drawer (XL Col 4) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          {/* Dynamic Component Inspector */}
          <div className="bg-[#151b2b] border border-[#3e4850]/40 p-5 rounded-xl shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3e4850]/30">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#89ceff] text-[20px]">
                  biotech
                </span>
                <span className="text-[10px] font-bold text-[#bec8d2] tracking-wider uppercase font-['Inter']">
                  COMPONENT INSPECTOR
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                  inspectStatus === 'INSPECTING'
                    ? 'bg-[#89ceff]/20 text-[#89ceff] animate-pulse'
                    : 'bg-[#4edea3]/20 text-[#4edea3]'
                }`}
              >
                {inspectStatus}
              </span>
            </div>

            {/* Component Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#242a3a] border border-[#3e4850]/50 flex items-center justify-center shadow-inner flex-shrink-0">
                <span
                  className={`material-symbols-outlined text-[32px] ${currentHw.iconColor}`}
                >
                  {currentHw.icon}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-mono font-bold text-[#89ceff]">
                  {currentHw.id}
                </span>
                <h3 className="font-['Inter'] text-base font-bold text-[#dde2f8] truncate">
                  {currentHw.title}
                </h3>
                <span className="text-xs text-[#bec8d2] truncate">
                  {currentHw.subtitle}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[#dde2f8] leading-relaxed">
              {currentHw.desc}
            </p>

            {/* Specs Grid */}
            <div className="bg-[#191f2f] border border-[#3e4850]/40 rounded-lg p-3 flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center py-0.5 border-b border-[#242a3a]">
                <span className="text-[10px] font-bold text-[#bec8d2] uppercase">
                  OPERATING VOLTAGE
                </span>
                <span className="font-mono text-[#dde2f8]">{currentHw.v}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242a3a]">
                <span className="text-[10px] font-bold text-[#bec8d2] uppercase">
                  SAMPLING RATE
                </span>
                <span className="font-mono text-[#4edea3] font-semibold">
                  {currentHw.rate}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242a3a]">
                <span className="text-[10px] font-bold text-[#bec8d2] uppercase">
                  DETECTION RANGE
                </span>
                <span className="font-mono text-[#00eefc]">{currentHw.range}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[10px] font-bold text-[#bec8d2] uppercase">
                  INTERFACE PROTOCOL
                </span>
                <span className="font-mono text-[#dde2f8]">{currentHw.bus}</span>
              </div>
            </div>

            {/* Design Thinking Rationale Note */}
            <div className="bg-[#242a3a]/50 border border-[#89ceff]/20 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#89ceff] uppercase tracking-wider font-['Inter']">
                Design Thinking Rationale
              </span>
              <p className="text-xs text-[#bec8d2] leading-relaxed">
                {currentHw.rationale}
              </p>
            </div>

            {/* Quick Interactive Hotspot Switcher Buttons */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
                Select Subsystem Component
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'controller', label: 'ESP32 MCU' },
                  { key: 'ultrasonic', label: 'Ultrasonic' },
                  { key: 'pir', label: 'PIR Motion' },
                  { key: 'oled', label: 'OLED 1.3"' },
                  { key: 'piezo', label: 'Piezo Tone' },
                  { key: 'haptic', label: 'Haptic Alert' },
                  { key: 'servo', label: 'Servo Gear' },
                  { key: 'battery', label: 'LiPo 3.7V' },
                  { key: 'trigger', label: 'SOS Switch' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleInspect(item.key)}
                    className={`px-2 py-1.5 rounded text-[10px] font-semibold text-left truncate transition-colors ${
                      selectedHw === item.key
                        ? 'bg-[#0ea5e9] text-[#003751] font-bold shadow'
                        : 'bg-[#191f2f] hover:bg-[#242a3a] text-[#dde2f8] border border-[#3e4850]/40'
                    }`}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Ergonomics & Wearability Card */}
          <div className="bg-[#151b2b] border border-[#3e4850]/40 p-4 rounded-xl shadow-lg flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#00eefc]">
              <span className="material-symbols-outlined text-[20px]">front_hand</span>
              <span className="font-['Inter'] text-sm font-semibold text-[#dde2f8]">
                Wrist Wearability Metrics
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-[#191f2f] border border-[#3e4850]/30 p-2 rounded-lg">
                <span className="text-[9px] font-bold text-[#bec8d2] block uppercase font-['Inter']">
                  TOTAL WEIGHT
                </span>
                <span className="font-mono text-xl font-bold text-[#89ceff]">
                  142<span className="text-[10px] font-normal text-[#bec8d2] ml-1">G</span>
                </span>
              </div>
              <div className="bg-[#191f2f] border border-[#3e4850]/30 p-2 rounded-lg">
                <span className="text-[9px] font-bold text-[#bec8d2] block uppercase font-['Inter']">
                  CHASSIS PROFILE
                </span>
                <span className="font-mono text-xl font-bold text-[#4edea3]">
                  16.4<span className="text-[10px] font-normal text-[#bec8d2] ml-1">MM</span>
                </span>
              </div>
            </div>
            <span className="text-xs text-[#bec8d2] leading-relaxed">
              Contoured wrist-cuff with double safety clasp and sweat ventilation ducting engineered for 14-hour continuous patrol shifts.
            </span>
          </div>
        </div>
      </div>

      {/* Bill of Materials (BOM) Table: 1st Year B.Tech Academic Scale */}
      <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-lg flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-[#3e4850]/30">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-['Inter'] text-xl font-bold text-[#dde2f8]">
                Bill of Materials (BOM) Architecture
              </span>
              <span className="px-2 py-0.5 rounded bg-[#89ceff]/20 text-[#89ceff] text-[10px] font-bold font-mono">
                PROTOTYPE SCALE
              </span>
            </div>
            <span className="text-xs text-[#bec8d2]">
              Validated component bill suited for first-year engineering laboratory budget targets ($35.00 – $45.00 limit).
            </span>
          </div>
          <div className="flex items-center gap-3 bg-[#191f2f] border border-[#4edea3]/40 px-4 py-2 rounded-lg self-start md:self-auto">
            <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
              TOTAL BOM ACCUMULATION:
            </span>
            <span className="font-mono text-xl text-[#4edea3] font-bold">$41.80</span>
          </div>
        </div>

        {/* Responsive BOM Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#242a3a]/80 text-[#dde2f8] font-bold uppercase tracking-wider font-['Inter'] text-[10px]">
                <th className="py-3 px-4 rounded-l-lg">Item / Part</th>
                <th className="py-3 px-4">Subsystem Description</th>
                <th className="py-3 px-4">Functional Role</th>
                <th className="py-3 px-4">Key Specification</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Unit Est. ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242a3a]">
              <tr className="hover:bg-[#242a3a]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#89ceff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">memory</span>
                  ESP32-WROOM-32
                </td>
                <td className="py-3 px-4 text-[#dde2f8]">32-Bit Dual-Core Microcontroller</td>
                <td className="py-3 px-4 text-[#bec8d2]">
                  Sensor polling (50Hz), telemetry pipeline & triggers
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">
                  240MHz, 4MB Flash, BLE/Wi-Fi
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">1</td>
                <td className="py-3 px-4 font-mono text-right text-[#4edea3] font-bold">
                  $4.80
                </td>
              </tr>

              <tr className="hover:bg-[#242a3a]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#89ceff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">hearing</span>
                  JSN-SR04T Sensor
                </td>
                <td className="py-3 px-4 text-[#dde2f8]">Waterproof Ultrasonic Transceiver</td>
                <td className="py-3 px-4 text-[#bec8d2]">
                  Distance obstacle pinging & close wildlife warning
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">
                  40kHz acoustic pulse, 2cm-400cm
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">1</td>
                <td className="py-3 px-4 font-mono text-right text-[#4edea3] font-bold">
                  $3.70
                </td>
              </tr>

              <tr className="hover:bg-[#242a3a]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#89ceff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">motion_photos_on</span>
                  Mini PIR HC-SR505
                </td>
                <td className="py-3 px-4 text-[#dde2f8]">
                  Pyroelectric Infrared Motion Sensor
                </td>
                <td className="py-3 px-4 text-[#bec8d2]">
                  Detects warm body presence in obscured brush
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">
                  100° cone, up to 3m sensitivity
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">1</td>
                <td className="py-3 px-4 font-mono text-right text-[#4edea3] font-bold">
                  $1.20
                </td>
              </tr>

              <tr className="hover:bg-[#242a3a]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#89ceff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">screenshot_monitor</span>
                  SH1106 OLED HUD
                </td>
                <td className="py-3 px-4 text-[#dde2f8]">
                  1.3" Monochrome OLED Display Module
                </td>
                <td className="py-3 px-4 text-[#bec8d2]">
                  Tactical metrics, heading, ping and device status
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">
                  128x64 px, I2C bus, 0.04W
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">1</td>
                <td className="py-3 px-4 font-mono text-right text-[#4edea3] font-bold">
                  $2.90
                </td>
              </tr>

              <tr className="hover:bg-[#242a3a]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#89ceff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                  Piezo Tone Buzzer
                </td>
                <td className="py-3 px-4 text-[#dde2f8]">Active Acoustic Transducer</td>
                <td className="py-3 px-4 text-[#bec8d2]">
                  Acoustic deterrence and cautionary sonic sweep
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">
                  85dB @ 10cm, 2.7kHz resonant
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">1</td>
                <td className="py-3 px-4 font-mono text-right text-[#4edea3] font-bold">
                  $0.60
                </td>
              </tr>

              <tr className="hover:bg-[#242a3a]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#89ceff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">vibration</span>
                  Coin Haptic Motor
                </td>
                <td className="py-3 px-4 text-[#dde2f8]">ERM 1027 Vibration Micro Disc</td>
                <td className="py-3 px-4 text-[#bec8d2]">
                  Silent tactile pulse to wrist (fauna undisturbed)
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">
                  10mm dia, 12,000 RPM @ 3V
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">1</td>
                <td className="py-3 px-4 font-mono text-right text-[#4edea3] font-bold">
                  $0.90
                </td>
              </tr>

              <tr className="hover:bg-[#242a3a]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#89ceff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
                  MG90S Micro Servo
                </td>
                <td className="py-3 px-4 text-[#dde2f8]">
                  Metal-Gear Digital Miniature Servo
                </td>
                <td className="py-3 px-4 text-[#bec8d2]">
                  Releases non-harmful rescue cartridge bay latch
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">
                  2.0 kg-cm torque, 9g weight
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">1</td>
                <td className="py-3 px-4 font-mono text-right text-[#4edea3] font-bold">
                  $2.50
                </td>
              </tr>

              <tr className="hover:bg-[#242a3a]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#89ceff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">battery_charging_full</span>
                  LiPo 650mAh Battery
                </td>
                <td className="py-3 px-4 text-[#dde2f8]">
                  3.7V Polymer Rechargeable Cell + TP4056
                </td>
                <td className="py-3 px-4 text-[#bec8d2]">
                  Independent uninterrupted wrist system power
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">
                  Includes PCM circuit protection
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">1</td>
                <td className="py-3 px-4 font-mono text-right text-[#4edea3] font-bold">
                  $4.20
                </td>
              </tr>

              <tr className="hover:bg-[#242a3a]/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#89ceff] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">layers</span>
                  3D Chassis & Hardware
                </td>
                <td className="py-3 px-4 text-[#dde2f8]">
                  Custom Resin/PLA+ Enclosure & Wrist Strap
                </td>
                <td className="py-3 px-4 text-[#bec8d2]">
                  Rapid laboratory print, silicone strap, brass inserts
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">
                  High-impact resin + M2.5 screws
                </td>
                <td className="py-3 px-4 font-mono text-[#dde2f8]">1 set</td>
                <td className="py-3 px-4 font-mono text-right text-[#4edea3] font-bold">
                  $21.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

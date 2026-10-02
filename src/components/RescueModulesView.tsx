import React, { useState } from 'react';
import { CartridgeData } from '../types';

const cartridges: CartridgeData[] = [
  {
    id: 1,
    name: 'Rescue Assist',
    subtitle: 'Soft Braided Kevlar Loop Ready',
    description:
      'High-tensile bio-compatible soft braided nylon tether with spring-cushioned magnetic soft-jaw loop for non-harmful retrieval.',
    status: 'DOCKED',
    lineCore: '15m Ultralight Kevlar',
    maxTension: '65 kg Rating',
    retract: 'Brushless Electric Rewind',
    badgeText: 'NON-INVASIVE WILDLIFE HOOK',
    icon: 'all_inclusive',
    oledVal: '15.0 M',
    oledMetric: 'LINE CAPACITY',
    firmware: 'RX-CORE-TETH-V2.14',
    power: '2.4W NOMINAL',
    color: '#89ceff',
    spec: 'LATCHED: 100%',
  },
  {
    id: 2,
    name: 'Acoustic Alert',
    subtitle: 'Wildlife Dispersal Sweep Online',
    description:
      'Directional acoustic wave emitter calibrated with humane wildlife-dispersal audio curves and integrated high-pulse strobe.',
    status: 'STANDBY',
    lineCore: '18kHz - 24kHz Swept',
    maxTension: '850 Lumen Flash LED',
    retract: 'Safe Wildlife Dispersal',
    badgeText: 'AUDITORY SAFETY SHIELD',
    icon: 'volume_up',
    oledVal: '22.4 kHz',
    oledMetric: 'SWEEP FREQ',
    firmware: 'RX-SONIC-ALERT-V1.08',
    power: '6.2W BURST',
    color: '#00dbe9',
    spec: 'STROBE: READY',
  },
  {
    id: 3,
    name: 'Night Illumination',
    subtitle: '1200lm Flood + 940nm Stealth IR',
    description:
      'High-efficiency dual optic system: 1200-lumen wide flood plus 940nm stealth IR emitter preventing night-blindness in nocturnal species.',
    status: 'STANDBY',
    lineCore: '1200 lm (110° Arc)',
    maxTension: '940 nm Non-Visible',
    retract: 'Gorilla Glass Armor',
    badgeText: 'STEALTH CANOPY NAVIGATION',
    icon: 'highlight',
    oledVal: '1,200 LM',
    oledMetric: 'OPTIC FLUX',
    firmware: 'RX-OPTIC-NIGHT-V3.02',
    power: '14.5W PEAK',
    color: '#89ceff',
    spec: 'IR BEACON: ENGAGED',
  },
  {
    id: 4,
    name: 'Eco Sensor Pod',
    subtitle: 'CO / Fire & Thermal LWIR Active',
    description:
      'Micro gas spectrometer and high-resolution thermal array for sub-canopy wildfire early detection and toxic gas telemetry.',
    status: 'STANDBY',
    lineCore: 'CO, CO2, VOC, Aerosol',
    maxTension: '80x60 Lepton LWIR',
    retract: '< 450 ms Response',
    badgeText: 'FIRE DETECT READY',
    icon: 'air',
    oledVal: '0.02 PPM',
    oledMetric: 'CO DETECT',
    firmware: 'RX-CHEM-SENSE-V4.41',
    power: '1.1W PASSIVE',
    color: '#4edea3',
    spec: 'TEMP: 24.8°C NOMINAL',
  },
  {
    id: 5,
    name: 'Satellite Comms',
    subtitle: 'LEO Short Burst & LoRa Mesh 915MHz',
    description:
      'High-gain fold-out patch antenna for dual Iridium LEO constellations and LoRa 868/915 MHz ad-hoc mesh networking in ravines.',
    status: 'STANDBY',
    lineCore: 'LEO Two-Way Short Burst',
    maxTension: 'LoRa P2P 15km Range',
    retract: '98.4% Dense Leaf',
    badgeText: 'DEEP CANOPY UPLINK',
    icon: 'satellite_alt',
    oledVal: '99.4 %',
    oledMetric: 'LINK QUALITY',
    firmware: 'RX-SAT-BEACON-V2.90',
    power: '4.8W TX-LOCK',
    color: '#00eefc',
    spec: 'IRIDIUM: 5/5 BARS',
  },
  {
    id: 6,
    name: 'Demo & Lab Module',
    subtitle: 'Safe Educational Evaluation Module',
    description:
      'Inert educational payload equipped with dual guide lasers, dummy spool friction simulators, and real-time lab diagnostic hooks.',
    status: 'STANDBY',
    lineCore: 'Safe B.Tech Lab Evaluation',
    maxTension: '<1mW Class 2 Eye-Safe',
    retract: 'Inert Dummy Tether Core',
    badgeText: 'FIRST-YEAR CAPSTONE DEMO',
    icon: 'school',
    oledVal: 'INERT',
    oledMetric: 'TRAINING DUMMY',
    firmware: 'RX-EDU-SIM-V0.95',
    power: '0.5W DIAG',
    color: '#bec8d2',
    spec: 'CLASS 2 RETICLE ON',
  },
];

export const RescueModulesView: React.FC = () => {
  const [activeCartridgeId, setActiveCartridgeId] = useState<number | null>(1);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployStepText, setDeployStepText] = useState<string>('LATCHED: 100%');
  const [currentCapacity, setCurrentCapacity] = useState<string>('15.0 M');
  const [isPinUnlatched, setIsPinUnlatched] = useState<boolean>(false);

  const activeCart =
    cartridges.find((c) => c.id === activeCartridgeId) || null;

  const handleSelectCartridge = (id: number) => {
    setIsPinUnlatched(true);
    setTimeout(() => {
      setActiveCartridgeId(id);
      setIsPinUnlatched(false);
      const cart = cartridges.find((c) => c.id === id);
      if (cart) {
        setDeployStepText(cart.spec);
        setCurrentCapacity(cart.oledVal);
      }
    }, 300);
  };

  const handleCycleDeploy = () => {
    if (!activeCart || isDeploying) return;
    setIsDeploying(true);

    // 4-step deployment cycle simulation
    setDeployStepText('DEPLOYING TETHER (8.4m)');
    setCurrentCapacity('8.4 M');

    setTimeout(() => {
      setDeployStepText('MAGNETIC GRIP ENGAGED');
      setCurrentCapacity('15.0 M');
    }, 800);

    setTimeout(() => {
      setDeployStepText('SMOOTH ELECTRIC REEL REWIND (0.35m/s)');
      setCurrentCapacity('4.2 M');
    }, 1600);

    setTimeout(() => {
      setDeployStepText('CYCLE COMPLETE // LATCHED 100%');
      setCurrentCapacity('15.0 M');
      setIsDeploying(false);
    }, 2400);
  };

  const handleEject = () => {
    setIsPinUnlatched(true);
    setActiveCartridgeId(null);
    setDeployStepText('BAY EMPTY (EJECTED)');
    setCurrentCapacity('---');
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* SAFETY BANNER PROTOCOL ENFORCEMENT */}
      <div className="relative overflow-hidden rounded-xl bg-[#00b17b]/15 border border-[#4edea3]/30 p-4 mb-6 shadow-lg">
        <div className="absolute -right-16 -top-16 w-52 h-52 bg-[#4edea3]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#00b17b] flex items-center justify-center text-[#003824] shadow-md flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">
                verified_user
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-semibold uppercase font-['Inter']">
                  Ethical Hardware Directive
                </span>
                <span className="text-xs font-mono text-[#6ffbbe]">
                  STD-ETHIC-701.REV4
                </span>
              </div>
              <p className="font-['Inter'] text-sm font-bold text-[#dde2f8] mt-0.5">
                SAFE HARMLESS TECHNOLOGY DEMONSTRATOR
              </p>
              <p className="text-xs text-[#bec8d2] max-w-3xl leading-relaxed">
                Zero darts, zero chemical sedatives, zero sharp ballistics. Built on 100% humane, non-invasive bio-robotic assist engineering designed strictly for field protection and environmental conservation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#242a3a] border border-[#4edea3]/40 px-4 py-1.5 rounded-lg text-[#4edea3] self-stretch md:self-auto justify-center flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider font-['Inter']">
              BIO-CONSERVATION COMPLIANT
            </span>
          </div>
        </div>
      </div>

      {/* MAIN TELEMETRY WORKBENCH: BENTO GRID DOCKING BENCH */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        {/* LEFT: BAY CARTRIDGE ACTIVE DOCKING COCKPIT (5 COLS) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="rounded-xl bg-[#151b2b] border border-[#3e4850]/40 p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Ambient Aura */}
            <div
              className={`absolute inset-0 bg-gradient-to-br via-transparent to-transparent pointer-events-none transition-all duration-700 ${
                activeCart ? 'from-[#0ea5e9]/15' : 'from-transparent'
              }`}
            ></div>

            <div className="relative z-10 flex items-center justify-between pb-2 border-b border-[#3e4850]/30">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#89ceff]">
                  view_in_ar
                </span>
                <span className="text-[10px] font-bold text-[#bec8d2] tracking-widest uppercase font-['Inter']">
                  TACTICAL DOCKING STATION // BAY 01
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wide ${
                  activeCart
                    ? 'bg-[#0ea5e9]/20 text-[#89ceff] border border-[#0ea5e9]/40'
                    : 'bg-[#2f3445] text-[#bec8d2]'
                }`}
              >
                {activeCart ? 'CARTRIDGE ARMED' : 'BAY EMPTY'}
              </span>
            </div>

            {/* 3D Cross-Section Visual */}
            <div className="relative z-10 my-4 bg-[#080e1d]/90 border border-[#3e4850]/40 rounded-lg p-4 flex flex-col items-center justify-center overflow-hidden">
              <div className="w-full flex items-center justify-between text-xs pb-1 mb-2 border-b border-[#242a3a]">
                <span className="font-mono text-xs font-bold text-[#89ceff]">
                  {activeCart ? `SEC: C-0${activeCart.id}` : 'SEC: VACANT'}
                </span>
                <span className="text-[10px] font-semibold text-[#bec8d2] uppercase font-['Inter']">
                  MAGNETIC CLAMP LATCH
                </span>
              </div>

              <div className="w-full h-52 relative flex items-center justify-center">
                <svg
                  className="w-full h-full text-[#89ceff] transition-all duration-500"
                  fill="none"
                  viewBox="0 0 400 240"
                >
                  {/* Wrist Module Chassis */}
                  <rect
                    fill="#151b2b"
                    height="160"
                    rx="16"
                    stroke="#3e4850"
                    strokeWidth="2"
                    width="300"
                    x="50"
                    y="40"
                  />
                  <path
                    d="M50 70H350M50 170H350"
                    stroke="#242a3a"
                    strokeDasharray="4 4"
                  />

                  {/* Cartridge Insertion Chamber */}
                  <rect
                    fill="#080e1d"
                    height="130"
                    rx="8"
                    stroke={activeCart ? '#0ea5e9' : '#3e4850'}
                    strokeWidth="2"
                    width="160"
                    x="120"
                    y="55"
                  />

                  {/* Locking Pins Animated */}
                  <rect
                    className="transition-transform duration-500"
                    fill={activeCart ? '#4edea3' : '#3e4850'}
                    height="20"
                    rx="2"
                    style={{
                      transform: isPinUnlatched ? 'translateX(-12px)' : 'translateX(0px)',
                    }}
                    width="15"
                    x="105"
                    y="110"
                  />
                  <rect
                    className="transition-transform duration-500"
                    fill={activeCart ? '#4edea3' : '#3e4850'}
                    height="20"
                    rx="2"
                    style={{
                      transform: isPinUnlatched ? 'translateX(12px)' : 'translateX(0px)',
                    }}
                    width="15"
                    x="280"
                    y="110"
                  />

                  {/* Internal Spool Schematics */}
                  {activeCart && (
                    <>
                      <circle
                        className="animate-[spin_10s_linear_infinite]"
                        cx="200"
                        cy="120"
                        r="45"
                        stroke="#89ceff"
                        strokeDasharray="6 3"
                        strokeWidth="2"
                      />
                      <circle
                        cx="200"
                        cy="120"
                        fill="#191f2f"
                        r="28"
                        stroke="#00dbe9"
                        strokeWidth="1.5"
                      />
                      <circle
                        className="animate-pulse"
                        cx="200"
                        cy="120"
                        fill={activeCart.color}
                        r="8"
                      />
                      <path
                        d="M280 120H330M330 115L345 120L330 125Z"
                        stroke="#4edea3"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                    </>
                  )}

                  <text
                    className="font-mono text-[10px]"
                    fill="#88929b"
                    x="70"
                    y="215"
                  >
                    TENSION-SENSE: 0.0 KG
                  </text>
                  <text
                    className="font-mono text-[10px]"
                    fill={activeCart ? '#4edea3' : '#ffb4ab'}
                    x="250"
                    y="215"
                  >
                    {deployStepText}
                  </text>
                </svg>
              </div>

              {/* Realtime Audio & Firmware Feedback Display */}
              <div className="w-full bg-[#151b2b] border border-[#3e4850]/40 rounded-lg p-2.5 flex items-center justify-between text-xs mt-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#4edea3]">
                    memory
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[#bec8d2] uppercase font-['Inter']">
                      FIRMWARE LINK
                    </span>
                    <span className="font-mono text-xs text-[#dde2f8]">
                      {activeCart ? activeCart.firmware : 'NO LINK'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-right font-mono">
                  <span className="material-symbols-outlined text-[16px] text-[#00eefc]">
                    power
                  </span>
                  <span className="text-xs text-[#00eefc]">
                    {activeCart ? activeCart.power : '0.0W IDLE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Wrist OLED Mirror */}
            <div className="relative z-10 bg-[#242a3a]/60 border border-[#3e4850]/40 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-[#89ceff] uppercase font-['Inter']">
                  Wrist OLED Telemetry Display
                </span>
                <span className="text-[10px] font-mono text-[#4edea3]">
                  {activeCart ? 'SYNC READY' : 'NO CARTRIDGE'}
                </span>
              </div>
              <div className="bg-[#080e1d] border border-[#3e4850]/50 rounded-lg p-2.5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-['Inter'] text-xs font-bold text-[#89ceff]">
                    {activeCart
                      ? `CRTG 0${activeCart.id} // ${activeCart.name.toUpperCase()}`
                      : 'BAY VACANT'}
                  </span>
                  <span className="text-[10px] text-[#bec8d2]">
                    {activeCart ? activeCart.subtitle : 'Insert cartridge to arm'}
                  </span>
                </div>
                <div className="flex flex-col items-end font-mono">
                  <span className="text-lg font-bold text-[#4edea3]">
                    {currentCapacity}
                  </span>
                  <span className="text-[9px] text-[#bec8d2]">
                    {activeCart ? activeCart.oledMetric : 'STATUS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Controls */}
            <div className="relative z-10 flex items-center gap-3 pt-4">
              <button
                onClick={handleCycleDeploy}
                disabled={!activeCart || isDeploying}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#0ea5e9] text-[#003751] font-['Inter'] text-sm font-semibold hover:bg-[#89ceff] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isDeploying ? 'sync' : 'play_arrow'}
                </span>
                <span>
                  {isDeploying ? 'SIMULATING CYCLE...' : 'CYCLE TEST DEPLOY'}
                </span>
              </button>

              <button
                onClick={handleEject}
                disabled={!activeCart}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#242a3a] text-[#dde2f8] hover:bg-[#2f3445] border border-[#3e4850]/40 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">eject</span>
                <span>EJECT</span>
              </button>
            </div>
          </div>

          {/* Quick Safety Metrics Panel */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-3 rounded-lg flex flex-col">
              <span className="text-[9px] font-bold text-[#bec8d2] uppercase font-['Inter']">
                MAX IMPACT
              </span>
              <span className="font-mono text-lg text-[#89ceff] font-bold mt-0.5">
                0.0 N
              </span>
              <span className="text-[9px] text-[#4edea3] font-semibold">
                100% NON-BALLISTIC
              </span>
            </div>
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-3 rounded-lg flex flex-col">
              <span className="text-[9px] font-bold text-[#bec8d2] uppercase font-['Inter']">
                RELOAD DURATION
              </span>
              <span className="font-mono text-lg text-[#00eefc] font-bold mt-0.5">
                1.8 SEC
              </span>
              <span className="text-[9px] text-[#bec8d2]">TOOLLESS SNAP</span>
            </div>
            <div className="bg-[#151b2b] border border-[#3e4850]/40 p-3 rounded-lg flex flex-col">
              <span className="text-[9px] font-bold text-[#bec8d2] uppercase font-['Inter']">
                FAIL-SAFE
              </span>
              <span className="font-mono text-lg text-[#4edea3] font-bold mt-0.5">
                ACTIVE
              </span>
              <span className="text-[9px] text-[#4edea3]">AUTO-RELEASE LOCK</span>
            </div>
          </div>
        </div>

        {/* RIGHT: CARTRIDGE SYSTEM CATALOG (7 COLS) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#89ceff] uppercase tracking-widest font-['Inter']">
                Modular Ecosystem
              </span>
              <h2 className="font-['Inter'] text-xl font-bold text-[#dde2f8]">
                6-Cartridge Rapid Interchange Matrix
              </h2>
            </div>
            <span className="text-xs text-[#bec8d2] font-mono">
              CLICK CARTRIDGE TO ENGAGE BAY 01
            </span>
          </div>

          {/* Interactive 6-Cartridge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cartridges.map((cart) => {
              const isSelected = activeCartridgeId === cart.id;
              return (
                <div
                  key={cart.id}
                  onClick={() => handleSelectCartridge(cart.id)}
                  className={`group cursor-pointer bg-[#151b2b] hover:bg-[#191f2f] p-4 rounded-xl transition-all duration-300 shadow-md relative overflow-hidden border ${
                    isSelected
                      ? 'border-[#0ea5e9] ring-2 ring-[#0ea5e9]/50'
                      : 'border-[#3e4850]/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#242a3a] border border-[#3e4850]/50 text-[#89ceff] flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-[22px]">
                          {cart.icon}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#89ceff] tracking-wider uppercase font-['Inter']">
                          CARTRIDGE 0{cart.id}
                        </span>
                        <span className="font-['Inter'] text-sm font-semibold text-[#dde2f8]">
                          {cart.name}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                        isSelected
                          ? 'bg-[#0ea5e9]/20 text-[#89ceff]'
                          : 'bg-[#242a3a] text-[#bec8d2]'
                      }`}
                    >
                      {isSelected ? 'DOCKED' : 'STANDBY'}
                    </span>
                  </div>

                  <p className="text-xs text-[#bec8d2] mb-3 leading-relaxed">
                    {cart.description}
                  </p>

                  <div className="bg-[#080e1d]/80 border border-[#3e4850]/30 rounded-lg p-2.5 mb-2 space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#bec8d2]">Line / Freq:</span>
                      <span className="text-[#dde2f8]">{cart.lineCore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#bec8d2]">Rating / Flux:</span>
                      <span className="text-[#4edea3]">{cart.maxTension}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#bec8d2]">Logic:</span>
                      <span className="text-[#00eefc]">{cart.retract}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-[#4edea3] flex items-center gap-1 font-['Inter']">
                      <span className="material-symbols-outlined text-[14px]">
                        verified
                      </span>
                      {cart.badgeText}
                    </span>
                    <span className="text-xs font-bold text-[#89ceff] group-hover:translate-x-1 transition-transform">
                      {isSelected ? 'ACTIVE ✓' : 'SELECT →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* LOWER SECTION: SOFT TETHER MECHANICAL BREAKDOWN */}
      <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#3e4850]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[18px]">
                lock_reset
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#4edea3] uppercase font-['Inter']">
                ENGINEERING BREAKDOWN
              </span>
            </div>
            <h3 className="font-['Inter'] text-lg font-bold text-[#dde2f8] mt-1">
              Soft Tether & Non-Invasive Rescue Mechanics
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-[#242a3a] border border-[#3e4850]/40 text-[#bec8d2] text-[10px] font-bold uppercase font-['Inter']">
              TENSION LIMITER: 650N CUT-OFF
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#00b17b]/20 border border-[#00b17b]/40 text-[#4edea3] text-[10px] font-bold uppercase font-['Inter']">
              BIO-CONTACT SAFE
            </span>
          </div>
        </div>

        {/* 4 Phases Flowchart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#191f2f] border border-[#3e4850]/40 p-4 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[#89ceff]">PHASE 01</span>
              <span className="material-symbols-outlined text-[#89ceff] text-[20px]">
                adjust
              </span>
            </div>
            <div>
              <h4 className="font-['Inter'] text-xs font-bold text-[#dde2f8] mb-1">
                Magnetic Auto-Guide
              </h4>
              <p className="text-xs text-[#bec8d2] leading-relaxed">
                Neodymium soft-cushioned ring projects forward via spring-assist guidance; zero explosive propellants or pneumatic spikes.
              </p>
            </div>
            <div className="pt-3">
              <div className="h-1 bg-[#242a3a] rounded-full overflow-hidden">
                <div className="h-full bg-[#89ceff] w-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-[#191f2f] border border-[#3e4850]/40 p-4 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[#00eefc]">PHASE 02</span>
              <span className="material-symbols-outlined text-[#00eefc] text-[20px]">
                gesture
              </span>
            </div>
            <div>
              <h4 className="font-['Inter'] text-xs font-bold text-[#dde2f8] mb-1">
                Soft-Jaw Latch
              </h4>
              <p className="text-xs text-[#bec8d2] leading-relaxed">
                Silicone-encased passive jaws clasp gently onto animal limbs or dropped radio chassis without compressive injury.
              </p>
            </div>
            <div className="pt-3">
              <div className="h-1 bg-[#242a3a] rounded-full overflow-hidden">
                <div className="h-full bg-[#00eefc] w-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-[#191f2f] border border-[#3e4850]/40 p-4 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[#4edea3]">PHASE 03</span>
              <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                speed
              </span>
            </div>
            <div>
              <h4 className="font-['Inter'] text-xs font-bold text-[#dde2f8] mb-1">
                Tension Feedback
              </h4>
              <p className="text-xs text-[#bec8d2] leading-relaxed">
                Internal strain gauge samples load at 500Hz; if resistance exceeds bio-safe thresholds, motor instantly yields slack.
              </p>
            </div>
            <div className="pt-3">
              <div className="h-1 bg-[#242a3a] rounded-full overflow-hidden">
                <div className="h-full bg-[#4edea3] w-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-[#191f2f] border border-[#3e4850]/40 p-4 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[#6ffbbe]">PHASE 04</span>
              <span className="material-symbols-outlined text-[#6ffbbe] text-[20px]">
                published_with_changes
              </span>
            </div>
            <div>
              <h4 className="font-['Inter'] text-xs font-bold text-[#dde2f8] mb-1">
                Smooth Electric Rewind
              </h4>
              <p className="text-xs text-[#bec8d2] leading-relaxed">
                Micro-geared brushless motor reels line back at an exact 0.35 m/s controlled speed, safely bringing target into ranger perimeter.
              </p>
            </div>
            <div className="pt-3">
              <div className="h-1 bg-[#242a3a] rounded-full overflow-hidden">
                <div className="h-full bg-[#6ffbbe] w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

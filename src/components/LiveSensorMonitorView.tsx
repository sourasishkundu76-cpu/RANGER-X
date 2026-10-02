import React, { useState, useEffect, useRef } from 'react';

export const LiveSensorMonitorView: React.FC = () => {
  const [distance, setDistance] = useState<number>(124);
  const [selectedNode, setSelectedNode] = useState<'hcsr04' | 'pir' | 'mpu' | 'dht'>('hcsr04');
  const [rollingPoints, setRollingPoints] = useState<number[]>([
    90, 85, 75, 80, 60, 55, 95, 90, 80, 50, 55, 60, 58,
  ]);
  const [waveOffset, setWaveOffset] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  // Time of flight calculation: 2 * distance / 34.3 cm/ms
  const timeOfFlight = ((distance * 2) / 34.3).toFixed(2);

  // States based on distance
  const isAlert = distance < 40;
  const isCaution = distance >= 40 && distance <= 80;
  const isNormal = distance > 80;

  // Animate dynamic waveform
  useEffect(() => {
    let tick = 0;
    const animateWave = () => {
      tick += 0.12;
      setWaveOffset(tick);
      animRef.current = requestAnimationFrame(animateWave);
    };
    animRef.current = requestAnimationFrame(animateWave);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Update rolling telemetry line periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRollingPoints((prev) => {
        // Map distance (10 - 250) to chart height range (120 - 20)
        const mappedY = Math.max(
          20,
          Math.min(130, 130 - (distance / 250) * 100 + (Math.random() * 8 - 4))
        );
        const next = [...prev.slice(1), Math.round(mappedY)];
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [distance]);

  // Generate SVG path for the wave
  const generateWavePath = () => {
    const width = 500;
    const height = 120;
    const midY = height / 2;
    const freq = isAlert ? 0.18 : isCaution ? 0.08 : 0.04;
    const amp = isAlert ? 45 : isCaution ? 30 : 18;

    const points: string[] = [];
    for (let x = 0; x <= width; x += 10) {
      const y = midY + Math.sin(x * freq + waveOffset) * amp;
      points.push(`${x},${y.toFixed(1)}`);
    }
    return `M ${points.join(' L ')}`;
  };

  const wavePathData = generateWavePath();

  // Topology node descriptions
  const topologyDetails = {
    hcsr04: {
      title: 'HC-SR04 / JSN-SR04T Ultrasonic Sonar Node',
      desc: 'Sends 8-cycle acoustic sonic burst at 40 kHz, listens for reflection return edge to determine obstacle standoff distance in real-time.',
      status: 'CALIBRATED',
    },
    pir: {
      title: 'PIR Pyroelectric Passive Infrared Dome (HC-SR505)',
      desc: 'Dual-element pyroelectric sensor behind 110° Fresnel lens detects thermal variance caused by warm biological motion across perimeter.',
      status: 'ARMED',
    },
    mpu: {
      title: 'MPU6050 6-Axis Motion Tracking I2C Node',
      desc: 'Triple-axis MEMS accelerometer paired with gyroscope to detect operative fall events, arm deflection posture, and tremor spikes.',
      status: 'NOMINAL',
    },
    dht: {
      title: 'DHT22 Digital Temperature & Humidity Sensor',
      desc: 'Capacitive humidity sensing element paired with negative temperature coefficient thermistor for environmental baseline tracking.',
      status: 'ACCURATE',
    },
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-10">
      {/* Top Banner & Quick Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-xl p-5 rounded-xl shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#2f3445] text-[#89ceff] text-[10px] font-semibold uppercase font-['Inter']">
              Telemetry Engine v3.4
            </span>
            <span className="px-2 py-0.5 rounded bg-[#00b17b]/20 text-[#4edea3] text-[10px] font-semibold uppercase flex items-center gap-1 font-['Inter']">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              DEMONSTRATION DATA / REAL-TIME SIMULATION ENGINE
            </span>
            <span className="text-xs font-mono text-[#bec8d2]">
              NODE: RX-FIELD-092A
            </span>
          </div>
          <div className="flex items-baseline gap-4 mt-1">
            <h1 className="font-['Inter'] text-2xl font-bold text-[#dde2f8] tracking-tight">
              Live Sensor & Telemetry Matrix
            </h1>
            <span className="text-[11px] font-mono text-[#00dbe9] uppercase hidden md:inline font-semibold">
              Synchronized 100Hz Bus
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 bg-[#080e1d]/80 border border-[#3e4850]/40 p-1.5 rounded-lg shadow-inner">
          <span className="text-[10px] font-bold text-[#bec8d2] px-2 uppercase font-['Inter']">
            Quick Presets:
          </span>
          <button
            onClick={() => setDistance(124)}
            className={`px-3 py-1.5 rounded-md font-['Inter'] text-xs font-semibold tracking-wider transition-all ${
              distance === 124
                ? 'bg-[#0ea5e9] text-[#003751] shadow-md'
                : 'bg-[#2f3445] text-[#dde2f8] hover:text-[#89ceff]'
            }`}
            type="button"
          >
            NORMAL (124cm)
          </button>
          <button
            onClick={() => setDistance(65)}
            className={`px-3 py-1.5 rounded-md font-['Inter'] text-xs font-semibold tracking-wider transition-all ${
              distance === 65
                ? 'bg-[#00eefc] text-[#00363a] shadow-md'
                : 'bg-[#2f3445] text-[#dde2f8] hover:text-[#00eefc]'
            }`}
            type="button"
          >
            CAUTION (65cm)
          </button>
          <button
            onClick={() => setDistance(28)}
            className={`px-3 py-1.5 rounded-md font-['Inter'] text-xs font-semibold tracking-wider transition-all ${
              distance === 28
                ? 'bg-[#ffb4ab] text-[#690005] shadow-md'
                : 'bg-[#2f3445] text-[#dde2f8] hover:text-[#ffb4ab]'
            }`}
            type="button"
          >
            ALERT (&lt;30cm)
          </button>
        </div>
      </div>

      {/* DYNAMIC REACTIVE PROXIMITY & HUD MATRIX */}
      <div
        className={`relative rounded-2xl bg-[#151b2b] border p-5 shadow-2xl overflow-hidden transition-all duration-300 ${
          isAlert
            ? 'border-[#ffb4ab]/50'
            : isCaution
            ? 'border-[#00eefc]/40'
            : 'border-[#3e4850]/40'
        }`}
      >
        {/* Dynamic Ambient Background Glow */}
        <div
          className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${
            isAlert
              ? 'bg-[#ef4444]/25'
              : isCaution
              ? 'bg-[#00eefc]/15'
              : 'bg-[#89ceff]/10'
          }`}
        ></div>

        {/* Hazard Pulse Bar */}
        <div
          className={`absolute top-0 left-0 right-0 transition-all duration-300 ${
            isAlert
              ? 'h-2 bg-[#ef4444] animate-pulse'
              : isCaution
              ? 'h-1.5 bg-[#00eefc] animate-pulse'
              : 'h-1 bg-[#89ceff]'
          }`}
        ></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
          {/* Proximity Readout & Interactive Slider (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#191f2f]/90 border border-[#3e4850]/40 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isAlert
                      ? 'text-[#ffb4ab]'
                      : isCaution
                      ? 'text-[#00eefc]'
                      : 'text-[#89ceff]'
                  }`}
                >
                  radar
                </span>
                <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider font-['Inter']">
                  HC-SR04 Transceiver
                </span>
              </div>
              <div
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  isAlert
                    ? 'text-[#ffb4ab] bg-[#93000a]/40 animate-pulse'
                    : isCaution
                    ? 'text-[#00eefc] bg-[#00686f]/30'
                    : 'text-[#4edea3] bg-[#003b26]/40'
                }`}
              >
                {isAlert
                  ? 'CRITICAL ALERT'
                  : isCaution
                  ? 'PROXIMITY WARNING'
                  : 'NORMAL LINK'}
              </div>
            </div>

            <div className="my-4 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-widest mb-1 font-['Inter']">
                PROXIMITY RADAR READOUT
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`font-['Inter'] text-5xl font-bold tracking-tighter ${
                    isAlert
                      ? 'text-[#ffb4ab]'
                      : isCaution
                      ? 'text-[#00eefc]'
                      : 'text-[#89ceff]'
                  }`}
                >
                  {distance}
                </span>
                <span className="text-lg font-medium text-[#bec8d2]">cm</span>
              </div>
              <p
                className={`text-xs mt-1 font-medium ${
                  isAlert
                    ? 'text-[#ffb4ab] font-bold'
                    : isCaution
                    ? 'text-[#00eefc]'
                    : 'text-[#d3fbff]'
                }`}
              >
                {isAlert
                  ? 'COLLISION IMMINENT — IMMEDIATE EVASION'
                  : isCaution
                  ? 'Standoff Closing — Prepare Deflection Vector'
                  : 'Perimeter Clear — Nominal Operational Buffer'}
              </p>
            </div>

            {/* Slider Control */}
            <div className="space-y-2 bg-[#080e1d]/60 border border-[#3e4850]/40 p-3 rounded-lg">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[10px] font-bold text-[#bec8d2] uppercase font-['Inter']">
                  Interactive Proximity Slider
                </span>
                <span className="font-mono text-xs font-semibold text-[#89ceff]">
                  {distance} cm
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#2f3445] rounded-lg appearance-none cursor-pointer accent-[#0ea5e9]"
              />
              <div className="flex justify-between text-[9px] text-[#bec8d2] font-mono">
                <span className="text-[#ffb4ab]">CRITICAL (10cm)</span>
                <span className="text-[#00eefc]">WARNING (65cm)</span>
                <span className="text-[#4edea3]">SAFE (250cm)</span>
              </div>
            </div>
          </div>

          {/* Dynamic Ultrasonic Waveform (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#191f2f]/90 border border-[#3e4850]/40 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#00eefc]">
                  show_chart
                </span>
                <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider font-['Inter']">
                  Dynamic Ultrasonic Waveform
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#bec8d2]">
                40 kHz Burst Echo
              </span>
            </div>

            <div className="w-full h-44 relative flex items-center justify-center my-2 bg-[#080e1d]/90 border border-[#3e4850]/40 rounded-lg overflow-hidden p-2">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#89ceff_1px,transparent_1px),linear-gradient(to_bottom,#89ceff_1px,transparent_1px)] bg-[size:16px_16px]"></div>
              <svg
                className={`w-full h-full transition-colors duration-300 ${
                  isAlert
                    ? 'text-[#ffb4ab]'
                    : isCaution
                    ? 'text-[#00eefc]'
                    : 'text-[#89ceff]'
                }`}
                preserveAspectRatio="none"
                viewBox="0 0 500 120"
              >
                <path
                  d={wavePathData}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <path
                  d={`${wavePathData} L 500,120 L 0,120 Z`}
                  fill="currentColor"
                  fillOpacity="0.08"
                />
              </svg>
              <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#bec8d2] bg-[#151b2b]/90 border border-[#3e4850]/50 px-2 py-0.5 rounded">
                {isAlert
                  ? 'BUZZER: CONTINUOUS 4.8 kHz ALARM'
                  : isCaution
                  ? 'BUZZER: PULSE 2.4 kHz [INTERMITTENT]'
                  : 'BUZZER: SILENT (0 Hz)'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#151b2b]/70 border border-[#3e4850]/30 p-2 rounded">
                <span className="text-[9px] font-semibold text-[#bec8d2] block uppercase">
                  SPEED OF SOUND
                </span>
                <span className="font-mono text-xs text-[#dde2f8]">343.2 m/s</span>
              </div>
              <div className="bg-[#151b2b]/70 border border-[#3e4850]/30 p-2 rounded">
                <span className="text-[9px] font-semibold text-[#bec8d2] block uppercase">
                  ECHO TIME-FLIGHT
                </span>
                <span className="font-mono text-xs text-[#89ceff] font-bold">
                  {timeOfFlight} ms
                </span>
              </div>
              <div className="bg-[#151b2b]/70 border border-[#3e4850]/30 p-2 rounded">
                <span className="text-[9px] font-semibold text-[#bec8d2] block uppercase">
                  CONFIDENCE
                </span>
                <span className="font-mono text-xs text-[#4edea3]">99.4%</span>
              </div>
            </div>
          </div>

          {/* HUD Wrist OLED Reticle (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-[#191f2f]/90 border border-[#3e4850]/40 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider font-['Inter']">
                HUD Wrist OLED Reticle
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#89ceff]">
                watch
              </span>
            </div>

            <div
              className={`h-44 rounded-xl flex flex-col items-center justify-center p-3 text-center transition-all duration-300 relative overflow-hidden shadow-inner border ${
                isAlert
                  ? 'bg-[#93000a]/20 border-[#ffb4ab]'
                  : isCaution
                  ? 'bg-[#151b2b] border-[#00eefc]/50'
                  : 'bg-[#080e1d] border-[#3e4850]/50'
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full border flex items-center justify-center relative transition-all duration-300 ${
                  isAlert
                    ? 'border-[#ffb4ab] animate-ping'
                    : isCaution
                    ? 'border-[#00eefc] animate-spin'
                    : 'border-[#89ceff]/40'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center ${
                    isAlert
                      ? 'bg-[#ffb4ab] text-[#690005]'
                      : isCaution
                      ? 'bg-[#00eefc]/20 text-[#00eefc]'
                      : 'bg-[#89ceff]/20 text-[#89ceff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[28px]">
                    {isAlert ? 'dangerous' : isCaution ? 'warning' : 'shield'}
                  </span>
                </div>
                <div className="absolute -top-1 w-2 h-2 bg-[#89ceff] rounded-full"></div>
                <div className="absolute -bottom-1 w-2 h-2 bg-[#89ceff] rounded-full"></div>
              </div>

              <span
                className={`text-xs font-bold tracking-wider mt-2 font-mono ${
                  isAlert
                    ? 'text-[#ffb4ab]'
                    : isCaution
                    ? 'text-[#00eefc]'
                    : 'text-[#89ceff]'
                }`}
              >
                {isAlert
                  ? 'RETICLE HAZARD LOCK'
                  : isCaution
                  ? 'OBSTACLE BUFFER LOW'
                  : 'SECTOR CLEAR'}
              </span>
              <span className="text-[10px] text-[#bec8d2] uppercase font-['Inter'] mt-0.5">
                {isAlert
                  ? 'Haptic Engine: RAPID STROBE'
                  : isCaution
                  ? 'Haptic Engine: 20Hz TAP'
                  : 'Haptic Engine: IDLE'}
              </span>
            </div>

            <div className="bg-[#080e1d]/60 border border-[#3e4850]/30 p-2.5 rounded-lg flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                <span className="text-[10px] font-semibold text-[#dde2f8]">
                  PIR DOME SENSOR
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-semibold uppercase ${
                  isAlert
                    ? 'text-[#ffb4ab]'
                    : isCaution
                    ? 'text-[#00eefc] animate-pulse'
                    : 'text-[#4edea3]'
                }`}
              >
                {isAlert
                  ? 'TARGET BREACH'
                  : isCaution
                  ? 'OBJECT IN MOTION'
                  : 'ARMED / IDLE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 ENVIRONMENTAL VITALS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Ambient & Air */}
        <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#89ceff] text-[20px]">
                thermostat
              </span>
              <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider font-['Inter']">
                Ambient & Air
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-[#4edea3]">DHT22</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-2xl font-bold text-[#dde2f8] font-mono">24.3</span>
              <span className="text-xs text-[#bec8d2] ml-1">°C</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#bec8d2] uppercase block">
                Humidity
              </span>
              <span className="text-xs font-mono font-semibold text-[#89ceff]">
                68% RH
              </span>
            </div>
          </div>
          <div className="w-full bg-[#2f3445] rounded-full h-1 mt-2 overflow-hidden">
            <div className="bg-[#89ceff] h-full w-[48%]"></div>
          </div>
        </div>

        {/* Card 2: Atmosphere & Air */}
        <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00eefc] text-[20px]">
                compress
              </span>
              <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider font-['Inter']">
                Atmosphere & Air
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#4edea3] bg-[#003b26]/30 px-1.5 py-0.5 rounded">
              AQI 22
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-2xl font-bold text-[#dde2f8] font-mono">1014</span>
              <span className="text-xs text-[#bec8d2] ml-1">hPa</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#bec8d2] uppercase block">Purity</span>
              <span className="text-xs font-mono font-semibold text-[#4edea3]">
                Pristine
              </span>
            </div>
          </div>
          <div className="w-full bg-[#2f3445] rounded-full h-1 mt-2 overflow-hidden">
            <div className="bg-[#4edea3] h-full w-[82%]"></div>
          </div>
        </div>

        {/* Card 3: MCU Thermal */}
        <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                device_thermostat
              </span>
              <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider font-['Inter']">
                MCU Thermal
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#4edea3] uppercase">
              Normal (&lt;45°C)
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-2xl font-bold text-[#dde2f8] font-mono">31.4</span>
              <span className="text-xs text-[#bec8d2] ml-1">°C</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#bec8d2] uppercase block">
                Junction
              </span>
              <span className="text-xs font-mono font-semibold text-[#4edea3]">
                PASSIVE OK
              </span>
            </div>
          </div>
          <div className="w-full bg-[#2f3445] rounded-full h-1 mt-2 overflow-hidden">
            <div className="bg-[#4edea3] h-full w-[35%]"></div>
          </div>
        </div>

        {/* Card 4: Li-Po Cell Vitals */}
        <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#89ceff] text-[20px]">
                battery_charging_full
              </span>
              <span className="text-[10px] font-bold text-[#bec8d2] uppercase tracking-wider font-['Inter']">
                Li-Po Cell Vitals
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#89ceff]">
              3.98 V
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-2xl font-bold text-[#dde2f8] font-mono">93</span>
              <span className="text-xs text-[#bec8d2] ml-1">%</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#bec8d2] uppercase block">
                Discharge
              </span>
              <span className="text-xs font-mono font-semibold text-[#00eefc]">
                48 mA
              </span>
            </div>
          </div>
          <div className="w-full bg-[#2f3445] rounded-full h-1 mt-2 overflow-hidden">
            <div className="bg-[#89ceff] h-full w-[93%]"></div>
          </div>
        </div>
      </div>

      {/* TOPOLOGY & 60S ROLLING STRIP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Topology Schematic (7 cols) */}
        <div className="lg:col-span-7 bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="font-['Inter'] text-base font-bold text-[#dde2f8]">
                Integrated Hardware Sensor Topology
              </h2>
              <span className="text-[10px] text-[#bec8d2] uppercase font-['Inter']">
                Wearable Forearm Array Architecture
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-[#2f3445] text-[#00eefc] text-[10px] font-semibold uppercase font-['Inter']">
              Schematic Mode
            </span>
          </div>

          <div className="relative w-full h-80 bg-[#080e1d]/90 border border-[#3e4850]/40 rounded-xl my-3 p-4 overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 640 280">
              <defs>
                <radialGradient cx="15%" cy="50%" id="ultrasonicBeam" r="75%">
                  <stop offset="0%" stopColor="#89ceff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#89ceff" stopOpacity="0" />
                </radialGradient>
                <radialGradient cx="50%" cy="85%" id="pirCone" r="65%">
                  <stop offset="0%" stopColor="#4edea3" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4edea3" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ultrasonic Beam Projection */}
              <path
                className="transition-opacity duration-300"
                d="M 120 140 L 440 60 L 440 220 Z"
                fill={isAlert ? '#ef4444' : isCaution ? '#00dbe9' : 'url(#ultrasonicBeam)'}
                opacity={isAlert ? 0.35 : 0.8}
              />

              {/* PIR Cone */}
              <path d="M 320 220 L 220 50 L 420 50 Z" fill="url(#pirCone)" opacity="0.4" />

              {/* Forearm Chassis Box */}
              <rect
                fill="#191f2f"
                height="110"
                rx="8"
                stroke="#3e4850"
                strokeWidth="1.5"
                width="200"
                x="220"
                y="90"
              />
              <text
                fill="#88929b"
                fontFamily="Inter"
                fontSize="10"
                fontWeight="600"
                letterSpacing="1"
                textAnchor="middle"
                x="320"
                y="112"
              >
                ARM POSTURE BRACELET
              </text>

              {/* HC-SR04 Node */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedNode('hcsr04')}
              >
                <rect
                  fill="#0ea5e9"
                  height="40"
                  rx="4"
                  stroke={selectedNode === 'hcsr04' ? '#ffffff' : 'none'}
                  strokeWidth="2"
                  width="55"
                  x="90"
                  y="120"
                />
                <circle cx="103" cy="140" fill="#080e1d" r="8" />
                <circle cx="132" cy="140" fill="#080e1d" r="8" />
                <text
                  fill="#89ceff"
                  fontFamily="Inter"
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                  x="117"
                  y="112"
                >
                  HC-SR04
                </text>
              </g>

              {/* PIR Node */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedNode('pir')}
              >
                <circle
                  cx="320"
                  cy="165"
                  fill="#00b17b"
                  r="14"
                  stroke={selectedNode === 'pir' ? '#ffffff' : 'none'}
                  strokeWidth="2"
                />
                <path d="M 314 165 Q 320 156 326 165 Q 320 174 314 165" fill="#080e1d" />
                <text
                  fill="#4edea3"
                  fontFamily="Inter"
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                  x="320"
                  y="195"
                >
                  PIR PYROSENSOR 110°
                </text>
              </g>

              {/* MPU6050 Node */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedNode('mpu')}
              >
                <rect
                  fill="#242a3a"
                  height="30"
                  rx="4"
                  stroke={selectedNode === 'mpu' ? '#ffffff' : '#89ceff'}
                  strokeWidth={selectedNode === 'mpu' ? 2 : 1}
                  width="45"
                  x="240"
                  y="130"
                />
                <text
                  fill="#dde2f8"
                  fontFamily="Inter"
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                  x="262"
                  y="148"
                >
                  MPU6050
                </text>
                <text
                  fill="#88929b"
                  fontFamily="Geist"
                  fontSize="8"
                  textAnchor="middle"
                  x="262"
                  y="175"
                >
                  6-AXIS GYRO
                </text>
              </g>

              {/* DHT22 Node */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedNode('dht')}
              >
                <rect
                  fill="#242a3a"
                  height="30"
                  rx="4"
                  stroke={selectedNode === 'dht' ? '#ffffff' : '#4edea3'}
                  strokeWidth={selectedNode === 'dht' ? 2 : 1}
                  width="45"
                  x="355"
                  y="130"
                />
                <text
                  fill="#dde2f8"
                  fontFamily="Inter"
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                  x="377"
                  y="148"
                >
                  DHT22
                </text>
                <text
                  fill="#88929b"
                  fontFamily="Geist"
                  fontSize="8"
                  textAnchor="middle"
                  x="377"
                  y="175"
                >
                  TEMP/HUM
                </text>
              </g>

              <line stroke="#89ceff" strokeDasharray="3 3" x1="145" x2="220" y1="140" y2="140" />
              <line stroke="#3e4850" x1="285" x2="306" y1="145" y2="165" />
              <line stroke="#3e4850" x1="334" x2="355" y1="165" y2="145" />

              <text fill="#89ceff" fontFamily="Inter" fontSize="10" fontWeight="600" x="490" y="90">
                BEAM ANGLE: 15°
              </text>
              <text fill="#88929b" fontFamily="Geist" fontSize="9" x="490" y="105">
                Effective Range: 2cm - 400cm
              </text>
              <text fill="#4edea3" fontFamily="Inter" fontSize="10" fontWeight="600" x="490" y="180">
                PIR APERTURE: 110°
              </text>
              <text fill="#88929b" fontFamily="Geist" fontSize="9" x="490" y="195">
                Passive IR Motion Lock
              </text>
            </svg>
          </div>

          {/* Node Detail Card */}
          <div className="bg-[#191f2f] border border-[#3e4850]/40 p-3.5 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#0ea5e9]/20 text-[#89ceff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">developer_board</span>
              </div>
              <div>
                <span className="font-['Inter'] text-sm font-semibold text-[#dde2f8]">
                  {topologyDetails[selectedNode].title}
                </span>
                <p className="text-xs text-[#bec8d2]">
                  {topologyDetails[selectedNode].desc}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-[#4edea3] flex-shrink-0">
              {topologyDetails[selectedNode].status}
            </span>
          </div>
        </div>

        {/* 60-Second Telemetry Rolling Strip (5 cols) */}
        <div className="lg:col-span-5 bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="font-['Inter'] text-base font-bold text-[#dde2f8]">
                60-Second Telemetry Rolling Strip
              </h2>
              <span className="text-[10px] text-[#bec8d2] uppercase font-['Inter']">
                Proximity & Motion Log
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#89ceff] animate-ping"></span>
              <span className="text-xs font-mono text-[#89ceff]">LIVE</span>
            </div>
          </div>

          <div className="my-3 bg-[#080e1d]/90 border border-[#3e4850]/40 rounded-xl p-4 flex flex-col justify-between h-80">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-[#2f3445]">
              <span className="text-[10px] font-semibold text-[#bec8d2]">
                DISTANCE (CM) VS TIME (SEC)
              </span>
              <span className="text-xs font-mono text-[#00eefc]">
                T-MINUS 60s TO NOW
              </span>
            </div>

            <div className="relative w-full flex-1 flex items-end pt-4 pb-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full border-b border-[#89ceff]"></div>
                <div className="w-full border-b border-[#89ceff]"></div>
                <div className="w-full border-b border-[#89ceff]"></div>
              </div>

              {/* Polyline chart */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150">
                <polyline
                  fill="none"
                  points={rollingPoints
                    .map((val, idx) => `${idx * 25},${val}`)
                    .join(' ')}
                  stroke="#89ceff"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <circle
                  className="animate-pulse"
                  cx={300}
                  cy={rollingPoints[rollingPoints.length - 1]}
                  fill="#00b17b"
                  r="5"
                />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-[#bec8d2] pt-2 border-t border-[#2f3445]">
              <span>-60s</span>
              <span>-45s</span>
              <span>-30s</span>
              <span>-15s</span>
              <span className="text-[#4edea3] font-bold">0s (REALTIME)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#191f2f] border border-[#3e4850]/40 p-2.5 rounded-lg flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#bec8d2]">FALL DETECT (MPU)</span>
                <span className="text-xs font-mono font-bold text-[#4edea3]">
                  UPRIGHT (0.98G)
                </span>
              </div>
              <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                accessibility_new
              </span>
            </div>
            <div className="bg-[#191f2f] border border-[#3e4850]/40 p-2.5 rounded-lg flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#bec8d2]">PIR TRIGGER COUNT</span>
                <span className="text-xs font-mono font-bold text-[#dde2f8]">
                  3 DETECTIONS / 10m
                </span>
              </div>
              <span className="material-symbols-outlined text-[#89ceff] text-[20px]">
                motion_sensor_active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

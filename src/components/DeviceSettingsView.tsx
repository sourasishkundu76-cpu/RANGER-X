import React, { useState } from 'react';

export const DeviceSettingsView: React.FC = () => {
  const [cautionThreshold, setCautionThreshold] = useState<number>(80);
  const [alertThreshold, setAlertThreshold] = useState<number>(40);
  const [buzzerLimit, setBuzzerLimit] = useState<number>(85);
  const [pirSensitivity, setPirSensitivity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [oledTimeout, setOledTimeout] = useState<string>('NEVER');
  const [hapticIntensity, setHapticIntensity] = useState<number>(80);
  const [loraFreq, setLoraFreq] = useState<string>('868.100');
  const [powerProfile, setPowerProfile] = useState<'PERFORMANCE' | 'ECO' | 'SURVIVAL'>('ECO');
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 2500);
  };

  const handleReset = () => {
    setCautionThreshold(80);
    setAlertThreshold(40);
    setBuzzerLimit(85);
    setPirSensitivity('HIGH');
    setOledTimeout('NEVER');
    setHapticIntensity(80);
    setLoraFreq('868.100');
    setPowerProfile('ECO');
    handleSave();
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-xl p-5 rounded-xl shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#2f3445] text-[#89ceff] text-[10px] font-semibold uppercase font-['Inter']">
              Non-Volatile EEPROM Config
            </span>
            <span className="px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-semibold font-mono">
              FIRMWARE REV 2.4.1
            </span>
          </div>
          <div className="flex items-baseline gap-4 mt-1">
            <h1 className="font-['Inter'] text-2xl font-bold text-[#dde2f8] tracking-tight">
              Hardware Calibration & Device Settings
            </h1>
            <span className="text-xs font-mono text-[#00eefc]">
              ON-DEVICE PARAMETER TUNING
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg bg-[#242a3a] hover:bg-[#2f3445] text-[#bec8d2] hover:text-[#dde2f8] border border-[#3e4850]/40 text-xs font-semibold font-['Inter'] transition-colors"
            type="button"
          >
            Reset to Factory Defaults
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0ea5e9] hover:bg-[#89ceff] text-[#003751] text-xs font-bold font-['Inter'] transition-all shadow-md cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Flash to EEPROM</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="bg-[#00b17b]/20 border border-[#4edea3] text-[#4edea3] px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-mono shadow-lg animate-pulse">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Parameters successfully written to ESP32 Flash memory sector 0x3F0000.</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Proximity & Sonic Transducer Calibration */}
        <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#3e4850]/30">
              <span className="material-symbols-outlined text-[#89ceff] text-[20px]">
                radar
              </span>
              <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                Ultrasonic Sonar Standoff Calibration
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Caution Threshold */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bec8d2]">Caution Buffer Standoff:</span>
                  <span className="font-mono text-xs font-bold text-[#00eefc]">
                    {cautionThreshold} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={cautionThreshold}
                  onChange={(e) => setCautionThreshold(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-[#242a3a] rounded-lg appearance-none cursor-pointer accent-[#00eefc]"
                />
                <span className="text-[10px] text-[#bec8d2]">
                  Triggers intermittent cautionary 2.4kHz pulse & mild wrist haptic cue.
                </span>
              </div>

              {/* Alert Threshold */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bec8d2]">Critical Alert Breach Threshold:</span>
                  <span className="font-mono text-xs font-bold text-[#ffb4ab]">
                    {alertThreshold} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-[#242a3a] rounded-lg appearance-none cursor-pointer accent-[#ef4444]"
                />
                <span className="text-[10px] text-[#bec8d2]">
                  Triggers continuous deterrent sweep & emergency HUD lock.
                </span>
              </div>

              {/* Piezo DB Limit */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bec8d2]">Piezo Acoustic Deterrent Cap:</span>
                  <span className="font-mono text-xs font-bold text-[#89ceff]">
                    {buzzerLimit} dB @ 10cm
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="85"
                  value={buzzerLimit}
                  onChange={(e) => setBuzzerLimit(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-[#242a3a] rounded-lg appearance-none cursor-pointer accent-[#0ea5e9]"
                />
                <span className="text-[10px] text-[#bec8d2]">
                  Enforces wildlife auditory protection limits (max 85dB ceiling).
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#3e4850]/30 text-[10px] text-[#bec8d2] font-mono mt-4">
            Sensor: JSN-SR04T Waterproof Sealed Transceiver (40 kHz)
          </div>
        </div>

        {/* Haptics & Power Optimization */}
        <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#3e4850]/30">
              <span className="material-symbols-outlined text-[#4edea3] text-[20px]">
                vibration
              </span>
              <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                Haptics, PIR & Power Profile
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Haptic Intensity */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#bec8d2]">Silent Haptic Motor Amplitude:</span>
                  <span className="font-mono text-xs font-bold text-[#4edea3]">
                    {hapticIntensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={hapticIntensity}
                  onChange={(e) => setHapticIntensity(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-[#242a3a] rounded-lg appearance-none cursor-pointer accent-[#4edea3]"
                />
                <span className="text-[10px] text-[#bec8d2]">
                  Controls ERM coin motor duty-cycle pulse strength on the operator's wrist.
                </span>
              </div>

              {/* PIR Sensitivity */}
              <div>
                <span className="text-[#bec8d2] block mb-1">
                  PIR Thermal Pyroelectric Sensitivity:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setPirSensitivity(lvl)}
                      className={`py-1.5 rounded text-xs font-mono font-bold transition-all ${
                        pirSensitivity === lvl
                          ? 'bg-[#0ea5e9] text-[#003751]'
                          : 'bg-[#191f2f] text-[#bec8d2] hover:bg-[#242a3a]'
                      }`}
                      type="button"
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Power Profile */}
              <div>
                <span className="text-[#bec8d2] block mb-1">
                  Power Consumption Profile:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'PERFORMANCE', label: '100Hz Full' },
                    { key: 'ECO', label: 'Balanced (14h)' },
                    { key: 'SURVIVAL', label: 'Low Pulse' },
                  ].map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPowerProfile(p.key as any)}
                      className={`py-1.5 rounded text-xs font-mono font-bold transition-all ${
                        powerProfile === p.key
                          ? 'bg-[#4edea3] text-[#003824]'
                          : 'bg-[#191f2f] text-[#bec8d2] hover:bg-[#242a3a]'
                      }`}
                      type="button"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#3e4850]/30 text-[10px] text-[#bec8d2] font-mono mt-4">
            Battery: 3.7V 1200mAh LiPo Cell with TP4056 charge management
          </div>
        </div>
      </div>
    </div>
  );
};

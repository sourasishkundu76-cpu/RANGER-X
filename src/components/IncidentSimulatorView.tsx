import React, { useState } from 'react';

interface Scenario {
  id: string;
  title: string;
  location: string;
  target: string;
  distance: string;
  severity: 'CAUTION' | 'ALERT' | 'NORMAL';
  description: string;
  recommendedCartridge: string;
  options: {
    label: string;
    description: string;
    ethical: boolean;
    outcome: string;
  }[];
}

const scenarios: Scenario[] = [
  {
    id: 'elephant',
    title: 'Approaching Asian Elephant Herd Along Corridor',
    location: 'Bandipur Sector 04 • Moyar Gorge Trail',
    target: 'Elephas maximus (3 Adults, 1 Calf)',
    distance: '38 meters (Closing at 1.2 m/s)',
    severity: 'CAUTION',
    description:
      'A breeding herd is crossing standard wildland officer transit trail towards local farm boundary. Ultrasonic cone detects heavy moving mass.',
    recommendedCartridge: 'Cartridge 02: Acoustic Alert (Directional 20kHz Dispersal)',
    options: [
      {
        label: 'A. Deploy Directional Acoustic Alert (Cartridge 02)',
        description: 'Emit non-injurious 18-22kHz sweep sound to gently redirect herd away from boundary without startle panic.',
        ethical: true,
        outcome: 'SUCCESS: Herd calmly redirected along natural wildlife corridor. Zero animal distress, zero officer injury.',
      },
      {
        label: 'B. Deploy High-Tension Tether (Cartridge 01)',
        description: 'Attempt physical restraint assist.',
        ethical: false,
        outcome: 'PROHIBITED BY ETHICS DIRECTIVE: Megafauna mass exceeds 650N limiter. Soft tether must never be used on large mammals.',
      },
      {
        label: 'C. Engage Silent Reconnaissance & LoRa Relay',
        description: 'Maintain 50m standoff, alert Team Bravo via 868MHz mesh, monitor herd with stealth 940nm IR.',
        ethical: true,
        outcome: 'SUCCESS: Patrol team notified. Safe monitoring buffer maintained without disturbing the herd.',
      },
    ],
  },
  {
    id: 'deer',
    title: 'Injured Chital Fawn Trapped in Narrow Ravine',
    location: 'Bandipur Sector 04 • North Creek Gully',
    target: 'Axis axis (Juvenile, ~14kg)',
    distance: '11.4 meters (Immobile)',
    severity: 'NORMAL',
    description:
      'Ultrasonic echolocation confirms small animal immobilized at bottom of 3-meter steep rocky embankment unable to climb out.',
    recommendedCartridge: 'Cartridge 01: Rescue Assist (Soft Braided Tether)',
    options: [
      {
        label: 'A. Deploy Soft Tether Retrieval (Cartridge 01)',
        description: 'Spring-cushioned magnetic jaw grasps around fawn chest harness; brushless electric motor gently hoists at 0.35 m/s.',
        ethical: true,
        outcome: 'SUCCESS: Fawn hoisted up embankment in 18 seconds without trauma or compressive injury. Stored for veterinary check.',
      },
      {
        label: 'B. Trigger Piezo Acoustic Sweep',
        description: 'Blast warning sound down the ravine.',
        ethical: false,
        outcome: 'INEFFECTIVE & UNETHICAL: Acoustic shock causes panic in injured animal, risking further fracture.',
      },
    ],
  },
  {
    id: 'predator',
    title: 'Nocturnal Solitary Leopard Stalking Patrol Path',
    location: 'Bandipur Sector 04 • Teak Ridge Alpha',
    target: 'Panthera pardus (~55kg)',
    distance: '6.2 meters (Crouched)',
    severity: 'ALERT',
    description:
      'PIR sensor detects rapid body heat shift through thick bamboo brush. Officer silent haptic engine vibrates with rapid 20Hz alert.',
    recommendedCartridge: 'Cartridge 02 + 03: Tiered Non-Lethal Escalation',
    options: [
      {
        label: 'A. Tiered Non-Lethal Escalation Protocol',
        description: 'Step 1: Ultrasonic pulse (fauna alerted). Step 2: 850lm blinding strobe flash. Step 3: Automated LoRa flood alert.',
        ethical: true,
        outcome: 'SUCCESS: Predator immediately disengages and retreats into canopy. Officer location pinned on basecamp radar.',
      },
      {
        label: 'B. Sudden Panic Retreat (Sprint)',
        description: 'Turn back and run away from predator.',
        ethical: false,
        outcome: 'TACTICAL ERROR: Triggers predator predatory chase reflex. Must maintain front-facing standoff with non-lethal deterrent.',
      },
    ],
  },
  {
    id: 'wildfire',
    title: 'Smoldering Brush Spark / Under-Canopy Thermal Anomaly',
    location: 'Bandipur Sector 04 • Dry Grassland B',
    target: 'Early Stage Combustion Zone (1.5m²)',
    distance: '24 meters',
    severity: 'ALERT',
    description:
      'Atmospheric CO sensor spikes to 14 PPM. Thermal array detects localized 78°C surface heating in dry pre-monsoon leaf litter.',
    recommendedCartridge: 'Cartridge 04: Eco Sensor Pod + Sat-Com Beacon',
    options: [
      {
        label: 'A. Deploy Eco Sensor Pod & GPS Ping',
        description: 'Sample ambient VOC & CO concentration, transmit exact coordinates via LoRa mesh to dispatch forest firefighting squad.',
        ethical: true,
        outcome: 'SUCCESS: Early fire spark contained within 12 minutes before tree-canopy ignition. Zero habitat loss.',
      },
      {
        label: 'B. Ignore Minor Thermal Reading',
        description: 'Assume benign solar heated stone.',
        ethical: false,
        outcome: 'CRITICAL FAILURE: Brushfire spreads across 15 hectares. Wildfire early intervention protocol violated.',
      },
    ],
  },
];

export const IncidentSimulatorView: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('elephant');
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [simOutcome, setSimOutcome] = useState<string | null>(null);
  const [ethicalScore, setEthicalScore] = useState<number>(100);

  const scenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const handleSelectOption = (index: number) => {
    setSelectedOptionIdx(index);
    const opt = scenario.options[index];
    setSimOutcome(opt.outcome);
    if (!opt.ethical) {
      setEthicalScore((prev) => Math.max(40, prev - 20));
    }
  };

  const handleResetScenario = (id: string) => {
    setSelectedScenarioId(id);
    setSelectedOptionIdx(null);
    setSimOutcome(null);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-xl p-5 rounded-xl shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#2f3445] text-[#89ceff] text-[10px] font-semibold uppercase font-['Inter']">
              Scenario Decision Trainer
            </span>
            <span className="px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-semibold font-mono">
              100% NON-LETHAL ETHICS ENGINE
            </span>
          </div>
          <div className="flex items-baseline gap-4 mt-1">
            <h1 className="font-['Inter'] text-2xl font-bold text-[#dde2f8] tracking-tight">
              Wildland Incident Simulator
            </h1>
            <span className="text-xs font-mono text-[#00eefc]">
              REAL-TIME FIELD DECISION AUDIT
            </span>
          </div>
        </div>

        {/* Ethical Score Pill */}
        <div className="flex items-center gap-3 bg-[#191f2f] border border-[#4edea3]/40 px-4 py-2 rounded-xl">
          <span className="material-symbols-outlined text-[#4edea3] text-[22px]">
            verified
          </span>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-[#bec8d2] uppercase font-['Inter']">
              Ethical Compliance Score
            </span>
            <span className="font-mono text-xl font-bold text-[#4edea3]">
              {ethicalScore} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => handleResetScenario(sc.id)}
            className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
              selectedScenarioId === sc.id
                ? 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-[#89ceff] shadow-md ring-1 ring-[#0ea5e9]/40'
                : 'bg-[#151b2b] border-[#3e4850]/40 text-[#bec8d2] hover:bg-[#191f2f]'
            }`}
            type="button"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold font-mono uppercase">
                {sc.id.toUpperCase()}
              </span>
              <span
                className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  sc.severity === 'ALERT'
                    ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                    : sc.severity === 'CAUTION'
                    ? 'bg-[#00eefc]/20 text-[#00eefc]'
                    : 'bg-[#4edea3]/20 text-[#4edea3]'
                }`}
              >
                {sc.severity}
              </span>
            </div>
            <div className="font-['Inter'] text-xs font-bold text-[#dde2f8] mt-1 line-clamp-2">
              {sc.title}
            </div>
            <div className="text-[10px] text-[#bec8d2] mt-2 font-mono truncate">
              {sc.location}
            </div>
          </button>
        ))}
      </div>

      {/* Active Scenario Detail & Decision Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Overview (6 cols) */}
        <div className="lg:col-span-6 bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#3e4850]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#89ceff] text-[20px]">
                  radar
                </span>
                <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                  Incident Situation Briefing
                </span>
              </div>
              <span className="text-xs font-mono text-[#4edea3]">LIVE SIMULATOR</span>
            </div>

            <div className="my-3 space-y-3">
              <h3 className="font-['Inter'] text-base font-bold text-[#89ceff]">
                {scenario.title}
              </h3>
              <p className="text-xs text-[#dde2f8] leading-relaxed">
                {scenario.description}
              </p>

              <div className="bg-[#080e1d] border border-[#3e4850]/40 rounded-lg p-3 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#bec8d2]">Location:</span>
                  <span className="text-[#dde2f8]">{scenario.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#bec8d2]">Target / Specimen:</span>
                  <span className="text-[#00eefc] font-bold">{scenario.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#bec8d2]">Ultrasonic Standoff:</span>
                  <span className="text-[#4edea3] font-bold">{scenario.distance}</span>
                </div>
              </div>

              <div className="bg-[#242a3a]/60 border border-[#0ea5e9]/30 rounded-lg p-3 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#89ceff] text-[20px] flex-shrink-0">
                  recommend
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#89ceff] uppercase font-['Inter'] block">
                    Recommended RANGER-X Response
                  </span>
                  <p className="text-xs text-[#dde2f8] mt-0.5">
                    {scenario.recommendedCartridge}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#3e4850]/30 flex items-center justify-between text-xs text-[#bec8d2]">
            <span>Directive: 100% Non-Violent Wildlife Defense</span>
            <span className="text-[#4edea3] font-semibold">Zero Lethality Guaranteed</span>
          </div>
        </div>

        {/* Action Decision Tree & Live Feedback (6 cols) */}
        <div className="lg:col-span-6 bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#3e4850]/30">
              <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                Select Tactical Action
              </span>
              <span className="text-[10px] text-[#bec8d2] font-mono">
                CHOOSE INTERVENTION
              </span>
            </div>

            <div className="my-3 flex flex-col gap-3">
              {scenario.options.map((opt, idx) => {
                const isChosen = selectedOptionIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isChosen
                        ? opt.ethical
                          ? 'bg-[#00b17b]/20 border-[#4edea3] text-[#dde2f8] shadow-md ring-1 ring-[#4edea3]'
                          : 'bg-[#93000a]/20 border-[#ffb4ab] text-[#dde2f8] shadow-md ring-1 ring-[#ffb4ab]'
                        : 'bg-[#191f2f] border-[#3e4850]/40 text-[#bec8d2] hover:bg-[#242a3a]'
                    }`}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-['Inter'] text-xs font-bold text-[#89ceff]">
                        {opt.label}
                      </span>
                      {isChosen && (
                        <span
                          className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                            opt.ethical
                              ? 'bg-[#4edea3]/20 text-[#4edea3]'
                              : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                          }`}
                        >
                          {opt.ethical ? 'ETHICAL SPEC' : 'VIOLATION'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#bec8d2] mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Simulation Feedback Card */}
            {simOutcome && (
              <div
                className={`p-4 rounded-xl border mt-4 transition-all duration-300 ${
                  scenario.options[selectedOptionIdx!].ethical
                    ? 'bg-[#00b17b]/15 border-[#4edea3]/50 text-[#dde2f8]'
                    : 'bg-[#93000a]/20 border-[#ffb4ab]/50 text-[#ffdad6]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[20px]">
                    {scenario.options[selectedOptionIdx!].ethical
                      ? 'verified'
                      : 'error'}
                  </span>
                  <span className="font-['Inter'] text-xs font-bold uppercase tracking-wider">
                    {scenario.options[selectedOptionIdx!].ethical
                      ? 'Simulation Outcome: Mission Successful'
                      : 'Simulation Warning: Protocol Breach'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-mono mt-1">
                  {simOutcome}
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#3e4850]/30 flex items-center justify-between text-xs">
            <button
              onClick={() => handleResetScenario(scenario.id)}
              className="text-[#89ceff] hover:underline text-xs font-semibold"
              type="button"
            >
              Restart This Scenario
            </button>
            <span className="text-[10px] text-[#bec8d2] font-mono">
              B.Tech Capstone Field Demonstration Trial
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

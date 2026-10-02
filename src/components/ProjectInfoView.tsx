import React from 'react';

export const ProjectInfoView: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Empathize',
      tagline: 'Field Interviews with Forest Guards & Wildlife Teams',
      description:
        'Conducted contextual research into wildland officer shifts across Indian tiger reserves (Bandipur, Nilgiris). Discovered frequent accidental injuries to animals from metal tranquilizer darts, animal panic during chemical sedation, and high risk of surprise night encounters during foot patrols.',
      metrics: '42 Interviews Conducted • 14-Hour Shift Ergonomic Study',
      icon: 'sentiment_satisfied',
    },
    {
      num: '02',
      title: 'Define',
      tagline: 'Human-Wildlife Conflict & Non-Lethal Problem Statement',
      description:
        '“How might we engineer an ergonomic wearable device for wildland officers that provides instantaneous, non-lethal fauna deterrence and harmless retrieval without causing physical injury or psychological trauma to endangered wildlife?”',
      metrics: 'Zero-Lethality Mandate • Under-$45 Laboratory Budget Target',
      icon: 'edit_note',
    },
    {
      num: '03',
      title: 'Ideate',
      tagline: 'Spider-Man Web-Shooter Bio-Robotic Wearable Concept',
      description:
        'Inspired by Peter Parker’s web-shooters, our engineering team ideated a gauntlet-mounted chassis featuring rapid-interchange cartridges: soft biodegradable Kevlar tethers, directional high-frequency acoustic waves (safe wildlife dispersal), and non-intrusive stealth sensors.',
      metrics: '6 Modular Cartridges • Spring-Cushioned Magnetic Jaws',
      icon: 'lightbulb',
    },
    {
      num: '04',
      title: 'Prototype',
      tagline: 'Accessible Dual-Core MCU & Sensor Integration',
      description:
        'Engineered working prototypes using ESP32-S3 and ATmega328P microcontrollers. Integrated sealed waterproof JSN-SR04T ultrasonic sonar, PIR motion detection, SH1106 1.3" OLED wrist HUD, and MG90S metal-gear servo latch. Total BOM: $41.80.',
      metrics: '142g Weight • 5-Layer Stack • 50Hz Real-Time Polling',
      icon: 'build',
    },
    {
      num: '05',
      title: 'Test',
      tagline: 'Sector 04 Simulated Deployment & Stress Trials',
      description:
        'Validated acoustic sweep curves against auditory safety limits (capped at 85dB at 10cm). Tested tension cut-off at 650N to ensure zero limb constriction on trapped animals, and verified LoRa 868MHz mesh penetration through thick forest canopy.',
      metrics: '100% Non-Harmful Score • 15km LoRa Standoff Verified',
      icon: 'fact_check',
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-xl p-5 rounded-xl shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-semibold uppercase font-['Inter']">
              First-Year B.Tech Capstone Project
            </span>
            <span className="px-2 py-0.5 rounded bg-[#2f3445] text-[#89ceff] text-[10px] font-semibold font-mono">
              STANFORD D.SCHOOL 5-STAGE FRAMEWORK
            </span>
          </div>
          <div className="flex items-baseline gap-4 mt-1">
            <h1 className="font-['Inter'] text-2xl font-bold text-[#dde2f8] tracking-tight">
              Design Thinking & Engineering Architecture
            </h1>
            <span className="text-xs font-mono text-[#00eefc]">
              ZERO-HARM WILDLIFE RESCUE DEMONSTRATOR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#00b17b]/15 border border-[#4edea3]/30 px-3.5 py-1.5 rounded-lg text-[#4edea3] text-xs font-bold font-mono">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>ACADEMIC EVALUATION READY</span>
        </div>
      </div>

      {/* Ethical Mission Card */}
      <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-[#3e4850]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0ea5e9]/20 text-[#89ceff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">psychology</span>
            </div>
            <div>
              <h2 className="font-['Inter'] text-base font-bold text-[#dde2f8]">
                The Core Engineering Philosophy: Why Zero-Harm Matters
              </h2>
              <span className="text-xs text-[#bec8d2]">
                Bridging superhero bio-mechanics with humane conservation science
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#4edea3] bg-[#003b26]/40 px-2 py-0.5 rounded border border-[#4edea3]/30">
              STD-ETHIC-701.REV4
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs text-[#bec8d2] leading-relaxed">
          <div className="bg-[#191f2f] border border-[#3e4850]/30 p-3.5 rounded-lg">
            <span className="text-[10px] font-bold text-[#89ceff] uppercase block mb-1 font-['Inter']">
              01. The Problem with Tranquilizers
            </span>
            Conventional wildland management uses chemical tranquilizer darts. Dosage estimation under dark or rushed field conditions often results in respiratory depression, hyperthermia, or fatal falls for stressed animals.
          </div>
          <div className="bg-[#191f2f] border border-[#3e4850]/30 p-3.5 rounded-lg">
            <span className="text-[10px] font-bold text-[#00eefc] uppercase block mb-1 font-['Inter']">
              02. The Spider-Man Inspiration
            </span>
            Peter Parker’s web-shooters offer the ideal ergonomic metaphor: non-lethal, tether-based, rapid deployment directly from the wrist, allowing an operator to respond intuitively without fumbling for holstered tools.
          </div>
          <div className="bg-[#191f2f] border border-[#3e4850]/30 p-3.5 rounded-lg">
            <span className="text-[10px] font-bold text-[#4edea3] uppercase block mb-1 font-['Inter']">
              03. First-Year Lab Reality
            </span>
            Rather than relying on fictional polymers, our team engineered realistic analogs: high-tensile biodegradable Kevlar lines, magnetic soft-jaw loops, directionally focused acoustic waves, and off-the-shelf microcontrollers under $45.
          </div>
        </div>
      </div>

      {/* 5-Stage Stanford Design Thinking Roadmap */}
      <div className="space-y-4">
        <h2 className="font-['Inter'] text-lg font-bold text-[#dde2f8] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#89ceff]">timeline</span>
          <span>5-Stage Design Thinking Execution Roadmap</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#89ceff]/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#242a3a] border border-[#3e4850]/50 flex items-center justify-center text-[#89ceff] flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">
                    {st.icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#4edea3]">
                      STAGE {st.num}
                    </span>
                    <span className="font-['Inter'] text-sm font-bold text-[#dde2f8]">
                      {st.title}
                    </span>
                    <span className="text-xs text-[#bec8d2] hidden sm:inline">
                      — {st.tagline}
                    </span>
                  </div>
                  <p className="text-xs text-[#bec8d2] mt-1 leading-relaxed max-w-3xl">
                    {st.description}
                  </p>
                </div>
              </div>

              <div className="bg-[#191f2f] border border-[#3e4850]/40 px-3.5 py-2 rounded-lg text-right flex-shrink-0 self-start md:self-auto">
                <span className="text-[10px] font-mono text-[#89ceff] font-bold block">
                  {st.metrics}
                </span>
                <span className="text-[9px] text-[#bec8d2] uppercase font-['Inter']">
                  Validated Milestone
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Credits & Project Team */}
      <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#89ceff] uppercase font-['Inter'] block">
            Academic Project Accreditation
          </span>
          <h3 className="font-['Inter'] text-sm font-bold text-[#dde2f8] mt-0.5">
            B.Tech First-Year Engineering Design Thinking Practicum
          </h3>
          <p className="text-xs text-[#bec8d2] mt-0.5">
            Department of Robotics & Automation Engineering • Hardware Prototype Demonstration Model
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-[#191f2f] border border-[#3e4850]/40 px-3 py-1.5 rounded-lg text-[#dde2f8]">
            <span className="text-[#bec8d2]">CAD Version: </span>
            <span className="text-[#89ceff] font-bold">V2.4</span>
          </div>
          <div className="bg-[#191f2f] border border-[#3e4850]/40 px-3 py-1.5 rounded-lg text-[#dde2f8]">
            <span className="text-[#bec8d2]">Open Source: </span>
            <span className="text-[#4edea3] font-bold">CERN OHL-v2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

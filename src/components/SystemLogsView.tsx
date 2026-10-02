import React, { useState, useEffect } from 'react';
import { LogEntry } from '../types';

const initialLogs: LogEntry[] = [
  {
    id: 'LOG-1081',
    timestamp: '14:42:01.004',
    node: 'ESP32_CORE_0',
    severity: 'SUCCESS',
    message: 'System boot sequence completed. Dual-core RTOS scheduler synchronized at 100Hz.',
  },
  {
    id: 'LOG-1082',
    timestamp: '14:42:02.140',
    node: 'JSN_SR04T',
    severity: 'INFO',
    message: 'Ultrasonic transceiver auto-calibration baseline measured 124.6 cm clear standoff.',
  },
  {
    id: 'LOG-1083',
    timestamp: '14:42:03.220',
    node: 'LORA_MESH',
    severity: 'INFO',
    message: 'Beacon broadcast SF=7 BW=125kHz 868.100MHz. Mesh Node 04A acknowledged RSSI=-44dBm.',
  },
  {
    id: 'LOG-1084',
    timestamp: '14:42:04.550',
    node: 'POWER_MGMT',
    severity: 'INFO',
    message: 'LiPo cell 3.98V (93% capacity). Quiescent discharge rate measured at nominal 48mA.',
  },
  {
    id: 'LOG-1085',
    timestamp: '14:42:05.810',
    node: 'CARTRIDGE_DOCK',
    severity: 'SUCCESS',
    message: 'Bay 01: Cartridge 01 (Soft Tether Rescue Assist) magnetic lock verified 100%.',
  },
  {
    id: 'LOG-1086',
    timestamp: '14:42:06.902',
    node: 'MPU6050',
    severity: 'INFO',
    message: 'Accelerometer axis posture stable: X=0.02G, Y=0.01G, Z=0.98G (Upright).',
  },
  {
    id: 'LOG-1087',
    timestamp: '14:42:07.410',
    node: 'PIR_PYRO',
    severity: 'INFO',
    message: 'PIR pyroelectric dome idle: Ambient IR baseline steady. Zero human/predator thermal differential.',
  },
  {
    id: 'LOG-1088',
    timestamp: '14:42:08.820',
    node: 'RADAR_VECTOR',
    severity: 'SUCCESS',
    message: 'Spatial azimuth 048° target 01 acquired at 4.22m. Classified as organic non-threat herbivore.',
  },
];

export const SystemLogsView: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [search, setSearch] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [subsystemFilter, setSubsystemFilter] = useState<string>('ALL');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);

  // Live log simulation when streaming
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toISOString().substring(11, 23);
      const idNum = Math.floor(1090 + Math.random() * 5000);
      const randDist = (120 + Math.random() * 8).toFixed(1);

      const samples: Partial<LogEntry>[] = [
        {
          node: 'JSN_SR04T',
          severity: 'INFO',
          message: `Ultrasonic ping echo returned in ${((parseFloat(randDist) * 2) / 34.3).toFixed(2)}ms. Standoff: ${randDist}cm.`,
        },
        {
          node: 'LORA_MESH',
          severity: 'SUCCESS',
          message: `Periodic keep-alive sync packet ACK received from Base Station 04A (SNR +9.2 dB).`,
        },
        {
          node: 'POWER_MGMT',
          severity: 'INFO',
          message: `LiPo fuel gauge update: Cell temperature nominal 29.4°C, voltage 3.97V.`,
        },
        {
          node: 'ESP32_CORE_0',
          severity: 'INFO',
          message: `Watchdog heartbeat clean. 0 buffer overruns in ring memory. Free heap 184 KB.`,
        },
      ];

      const chosen = samples[Math.floor(Math.random() * samples.length)];
      const newEntry: LogEntry = {
        id: `LOG-${idNum}`,
        timestamp: timeStr,
        node: chosen.node || 'ESP32_CORE_0',
        severity: chosen.severity as any || 'INFO',
        message: chosen.message || 'System operational.',
      };

      setLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const filteredLogs = logs.filter((l) => {
    if (severityFilter !== 'ALL' && l.severity !== severityFilter) return false;
    if (subsystemFilter !== 'ALL' && l.node !== subsystemFilter) return false;
    if (
      search &&
      !l.message.toLowerCase().includes(search.toLowerCase()) &&
      !l.id.toLowerCase().includes(search.toLowerCase()) &&
      !l.node.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ranger_x_telemetry_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = 'ID,Timestamp,Node,Severity,Message\n';
    const rows = logs
      .map((l) => `"${l.id}","${l.timestamp}","${l.node}","${l.severity}","${l.message.replace(/"/g, '""')}"`)
      .join('\n');
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ranger_x_telemetry_logs_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#151b2b]/80 border border-[#3e4850]/40 backdrop-blur-xl p-5 rounded-xl shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#2f3445] text-[#89ceff] text-[10px] font-semibold uppercase font-['Inter']">
              Chronological Audit Trail
            </span>
            <span className="px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-semibold font-mono">
              FIFO BUFFER (50 ENTRIES)
            </span>
          </div>
          <div className="flex items-baseline gap-4 mt-1">
            <h1 className="font-['Inter'] text-2xl font-bold text-[#dde2f8] tracking-tight">
              Hardware Telemetry & Packet Logs
            </h1>
            <span className="text-xs font-mono text-[#00eefc]">
              SUB-BUS SENSOR LOGGING MATRIX
            </span>
          </div>
        </div>

        {/* Live Stream Toggle & Exports */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              isLiveStreaming
                ? 'bg-[#00b17b]/20 border border-[#4edea3] text-[#4edea3]'
                : 'bg-[#2f3445] border border-[#3e4850] text-[#bec8d2]'
            }`}
            type="button"
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-[#4edea3] animate-ping' : 'bg-[#bec8d2]'}`}></span>
            <span>{isLiveStreaming ? 'STREAMING LIVE' : 'STREAM PAUSED'}</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#242a3a] hover:bg-[#2f3445] text-[#dde2f8] border border-[#3e4850]/40 text-xs font-['Inter'] font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportJSON}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#242a3a] hover:bg-[#2f3445] text-[#dde2f8] border border-[#3e4850]/40 text-xs font-['Inter'] font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon & Search Bar */}
      <div className="bg-[#151b2b] border border-[#3e4850]/40 p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#bec8d2] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packets by keyword or ID..."
            className="w-full bg-[#080e1d] border border-[#3e4850]/50 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#dde2f8] placeholder-[#bec8d2]/60 focus:outline-none focus:border-[#0ea5e9]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Severity selector */}
          <div className="flex items-center gap-1 bg-[#191f2f] border border-[#3e4850]/40 p-1 rounded-lg text-xs font-mono">
            {['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ALERT'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  severityFilter === sev
                    ? 'bg-[#0ea5e9] text-[#003751]'
                    : 'text-[#bec8d2] hover:text-[#dde2f8]'
                }`}
                type="button"
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Subsystem filter */}
          <select
            value={subsystemFilter}
            onChange={(e) => setSubsystemFilter(e.target.value)}
            className="bg-[#080e1d] border border-[#3e4850]/50 text-xs text-[#dde2f8] font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="ALL">All Subsystems</option>
            <option value="ESP32_CORE_0">ESP32_CORE_0</option>
            <option value="JSN_SR04T">JSN_SR04T</option>
            <option value="LORA_MESH">LORA_MESH</option>
            <option value="POWER_MGMT">POWER_MGMT</option>
            <option value="CARTRIDGE_DOCK">CARTRIDGE_DOCK</option>
            <option value="MPU6050">MPU6050</option>
            <option value="PIR_PYRO">PIR_PYRO</option>
            <option value="RADAR_VECTOR">RADAR_VECTOR</option>
          </select>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="bg-[#151b2b] border border-[#3e4850]/40 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#242a3a] border-b border-[#3e4850]/40 text-[#bec8d2] text-[10px] uppercase font-['Inter']">
                <th className="py-2.5 px-4 w-28">Packet ID</th>
                <th className="py-2.5 px-4 w-32">Timestamp</th>
                <th className="py-2.5 px-4 w-36">Subsystem Node</th>
                <th className="py-2.5 px-4 w-24">Severity</th>
                <th className="py-2.5 px-4">Telemetry Message Content</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242a3a]/60">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-[#191f2f]/60 transition-colors">
                  <td className="py-2.5 px-4 text-[#89ceff] font-bold">{l.id}</td>
                  <td className="py-2.5 px-4 text-[#bec8d2]">{l.timestamp}</td>
                  <td className="py-2.5 px-4 text-[#dde2f8] font-semibold">{l.node}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        l.severity === 'SUCCESS'
                          ? 'bg-[#00b17b]/20 text-[#4edea3]'
                          : l.severity === 'ALERT'
                          ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                          : l.severity === 'WARNING'
                          ? 'bg-[#00686f]/30 text-[#00eefc]'
                          : 'bg-[#242a3a] text-[#89ceff]'
                      }`}
                    >
                      {l.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[#dde2f8]">{l.message}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#bec8d2]">
                    No telemetry packets match your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

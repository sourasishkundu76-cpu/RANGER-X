export type NavigationPath =
  | 'command-center'
  | 'live-sensor-monitor'
  | 'ranger-x-device'
  | 'rescue-modules'
  | 'emergency-response'
  | 'incident-simulator'
  | 'system-logs'
  | 'device-settings'
  | 'project-info-and-design-thinking';

export interface TelemetryNode {
  id: string;
  label: string;
  value: string;
  unit?: string;
  subtext: string;
  status: 'normal' | 'caution' | 'alert' | 'active';
  progressPercent?: number;
  icon?: string;
}

export interface HardwareSpec {
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

export interface CartridgeData {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  status: 'DOCKED' | 'STANDBY';
  lineCore?: string;
  maxTension?: string;
  retract?: string;
  badgeText: string;
  icon: string;
  oledVal: string;
  oledMetric: string;
  firmware: string;
  power: string;
  color: string;
  spec: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  node: string;
  message: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
}

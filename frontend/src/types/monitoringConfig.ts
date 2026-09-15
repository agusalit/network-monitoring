export type MonitoringMethod =
  | 'SIMULATION'
  | 'ICMP'
  | 'SNMP'
  | 'API';

export interface MonitoringConfigDevice {
  id: string;
  name: string;
  model: string | null;
  status: string;
  vendor: string | null;
  hostname: string | null;
  ip_address: string | null;
  device_type: string | null;
  location: MonitoringConfigLocation | null;
}

export interface MonitoringConfig {
  id: string;
  device_id: string;
  method: MonitoringMethod;
  enabled: boolean;
  interval_seconds: number;
  timeout_seconds: number;
  retries: number;
  configuration: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  device: MonitoringConfigDevice | null;
}

export interface MonitoringConfigUpdate {
  method?: MonitoringMethod;
  enabled?: boolean;
  interval_seconds?: number;
  timeout_seconds?: number;
  retries?: number;
  configuration?: Record<string, unknown>;
}

export interface MonitoringConfigProperty {
  id: string;
  name: string;
}

export interface MonitoringConfigArea {
  id: string;
  name: string;
  property: MonitoringConfigProperty | null;
}

export interface MonitoringConfigLocation {
  id: string;
  name: string;
  area: MonitoringConfigArea | null;
}
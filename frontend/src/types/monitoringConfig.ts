export interface MonitoringConfigDevice {
  id: string;
  name: string;
  model: string | null;
  status: string;
  vendor: string | null;
  hostname: string | null;
  ip_address: string | null;
  device_type: string | null;
}

export interface MonitoringConfig {
  id: string;
  device_id: string;
  method: string;
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
  enabled?: boolean;
  interval_seconds?: number;
  timeout_seconds?: number;
  retries?: number;
  configuration?: Record<string, unknown>;
}
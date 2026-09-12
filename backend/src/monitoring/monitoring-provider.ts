import { MonitoringResult } from '../types/monitoring.js';

export interface MonitoringTarget {
  id: string;
  name: string;
  ipAddress: string | null;
}

export interface MonitoringCheckOptions {
  timeoutSeconds: number;
  retries: number;
  configuration: unknown;
}

export interface MonitoringProvider {
  check(
    target: MonitoringTarget,
    options: MonitoringCheckOptions
  ): Promise<MonitoringResult>;
}
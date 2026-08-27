import { MonitoringResult } from '../types/monitoring.js';

export interface MonitoringTarget {
  id: string;
  name: string;
  ipAddress: string | null;
}

export interface MonitoringProvider {
  check(target: MonitoringTarget): Promise<MonitoringResult>;
}
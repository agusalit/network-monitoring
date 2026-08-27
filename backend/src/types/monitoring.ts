export type MonitoringStatus =
  | 'ONLINE'
  | 'WARNING'
  | 'OFFLINE';

export interface MonitoringResult {
  status: MonitoringStatus;
  latencyMs: number | null;
  packetLossPercent: number;
  checkedAt: string;
  message?: string;
}
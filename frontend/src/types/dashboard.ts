export type DeviceStatus =
  | 'ONLINE'
  | 'WARNING'
  | 'OFFLINE';

export interface DashboardSummary {
  total: number;
  online: number;
  warning: number;
  offline: number;
}

export interface DashboardLocation {
  id: string;
  name: string;
  type: string;
  health: DeviceStatus | 'NO_DATA';
  devices: {
    total: number;
    online: number;
    warning: number;
    offline: number;
  };
}

export interface DashboardDevice {
  id: string;
  name: string;
  ipAddress: string;
  status: DeviceStatus;
  location: {
    id: string;
    name: string;
    type: string;
  } | null;
}

export interface DashboardIncident {
  id: string;
  deviceId: string;
  severity: string;
  title: string;
  description: string | null;
  status: string;
  startedAt: string;
  updatedAt: string;

  device: {
    id: string;
    name: string;
    ipAddress: string;
  } | null;

  location: {
    id: string;
    name: string;
    type: string;
  } | null;
}
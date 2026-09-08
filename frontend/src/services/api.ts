const API_BASE_URL = 'http://localhost:3000/api';

async function request<T>(
  endpoint: string
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  return response.json();
}

export async function getDashboardSummary() {
  return request<{
    status: string;
    data: {
      summary: import('../types/dashboard.js').DashboardSummary;
    };
  }>('/dashboard');
}

export async function getDashboardDevices() {
  return request<{
    status: string;
    data: import('../types/dashboard.js').DashboardDevice[];
  }>('/dashboard/devices');
}

export async function getDashboardIncidents() {
  return request<{
    status: string;
    data: import('../types/dashboard.js').DashboardIncident[];
  }>('/dashboard/incidents');
}

export async function getDashboardLocations() {
  return request<{
    status: string;
    data: import('../types/dashboard.js').DashboardLocation[];
  }>('/dashboard/locations');
}

export async function getDeviceById(id: string) {
  return request<{
    status: string;
    data: {
      id: string;
      name: string;
      hostname: string | null;
      device_type: string;
      vendor: string | null;
      model: string | null;
      ip_address: string;
      mac_address: string | null;
      status: 'ONLINE' | 'WARNING' | 'OFFLINE';
      description: string | null;
      enabled: boolean;
      last_seen_at: string | null;
      created_at: string;
      updated_at: string;

      location: {
        id: string;
        name: string;
        type: string;
        floor_number: number | null;

        area: {
          id: string;
          name: string;
          type: string;

          property: {
            id: string;
            name: string;
          } | null;
        } | null;
      } | null;

      monitoring_configs: {
        id: string;
        method: string;
        enabled: boolean;
        interval_seconds: number;
        timeout_seconds: number;
        retries: number;
        configuration: Record<string, unknown> | null;
      }[];

      incidents: {
        id: string;
        severity: string;
        title: string;
        description: string | null;
        status: string;
        started_at: string;
        resolved_at: string | null;
        created_at: string;
        updated_at: string;
      }[];
    };
  }>(`/devices/${id}`);
}

export async function getLocationById(id: string) {
  return request<{
    status: string;
    data: {
      location: {
        id: string;
        name: string;
        type: string;
        floor_number: number | null;

        area: {
          id: string;
          name: string;
          type: string;

          property: {
            id: string;
            name: string;
          } | null;
        } | null;
      };

      health: 'ONLINE' | 'WARNING' | 'OFFLINE' | 'NO_DATA';

      summary: {
        total: number;
        online: number;
        warning: number;
        offline: number;
      };

      devices: {
        id: string;
        name: string;
        hostname: string | null;
        device_type: string;
        vendor: string | null;
        model: string | null;
        ip_address: string;
        mac_address: string | null;
        status: 'ONLINE' | 'WARNING' | 'OFFLINE';
        description: string | null;
        enabled: boolean;
        last_seen_at: string | null;
        created_at: string;
        updated_at: string;
      }[];
    };
  }>(`/locations/${id}`);
}

export async function getMonitoringHistory(
  deviceId: string
) {
  return request<{
    status: string;
    data: {
      id: string;
      device_id: string;
      monitoring_config_id: string | null;
      checked_at: string;
      status: 'ONLINE' | 'WARNING' | 'OFFLINE';
      latency_ms: number | null;
      packet_loss_percent: number | null;
      cpu_usage_percent: number | null;
      memory_usage_percent: number | null;
      uptime_seconds: number | null;
      error_message: string | null;
      raw_data: Record<string, unknown> | null;
      created_at: string;
    }[];
  }>(
    `/monitoring/devices/${deviceId}/history`
  );
}
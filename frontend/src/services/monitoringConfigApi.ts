import type {
  MonitoringConfig,
  MonitoringConfigUpdate
} from '../types/monitoringConfig';

const API_BASE_URL = 'http://localhost:3000/api';

interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    options
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Request failed'
    );
  }

  return result;
}

export async function getMonitoringConfigs(): Promise<MonitoringConfig[]> {
  const result = await request<
    ApiResponse<MonitoringConfig[]>
  >('/monitoring/configs');

  return result.data;
}

export async function getMonitoringConfig(
  id: string
): Promise<MonitoringConfig> {
  const result = await request<
    ApiResponse<MonitoringConfig>
  >(`/monitoring/configs/${id}`);

  return result.data;
}

export async function updateMonitoringConfig(
  id: string,
  updates: MonitoringConfigUpdate
): Promise<MonitoringConfig> {
  const result = await request<
    ApiResponse<MonitoringConfig>
  >(`/monitoring/configs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  return result.data;
}
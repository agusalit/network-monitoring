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
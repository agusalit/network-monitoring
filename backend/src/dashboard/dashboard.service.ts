import {
  getDashboardSummary,
  getDashboardDevices,
  getActiveIncidents
} from '../repositories/dashboard.repository.js';

export async function getDashboardData() {
  const summary = await getDashboardSummary();

  return {
    summary
  };
}

export async function getDashboardDevicesData() {
  return await getDashboardDevices();
}

export async function getActiveIncidentsData(){
    return await getActiveIncidents();
}
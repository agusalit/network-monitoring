import { useEffect, useState } from 'react';

import {
  getDashboardSummary,
  getDashboardLocations,
  getDashboardIncidents,
  getDashboardDevices
} from '../services/api.js';

import type {
  DashboardSummary as Summary,
  DashboardLocation,
  DashboardIncident,
  DashboardDevice
} from '../types/dashboard.js';

import DashboardSummary from '../components/DashboardSummary.js';

import Sidebar from '../components/Sidebar.js';

import LocationHealth from '../components/LocationHealth.js';

import IncidentList from '../components/IncidentList.js';

import DeviceStatusTable from '../components/DeviceStatusTable.js';

function Dashboard() {
  const [loading, setLoading] = 
    useState(true);
  
  const [refreshing, setRefreshing] =
    useState(false);

  const [summary, setSummary] =
    useState<Summary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [locations, setLocations] =
    useState<DashboardLocation[]>([]);

  const [incidents, setIncidents] =
    useState<DashboardIncident[]>([]);

  const [devices, setDevices] =
    useState<DashboardDevice[]>([]);

  useEffect(() => {
    async function loadDashboard(
      isInitialLoad = false
    ) {
      try {
        if (isInitialLoad) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const [
          summaryResponse,
          locationsResponse,
          incidentsResponse,
          devicesResponse
        ] = await Promise.all([
          getDashboardSummary(),
          getDashboardLocations(),
          getDashboardIncidents(),
          getDashboardDevices()
        ]);

        setSummary(summaryResponse.data.summary);
        setLocations(locationsResponse.data);
        setIncidents(incidentsResponse.data);
        setDevices(devicesResponse.data);

        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to refresh dashboard data.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }

    loadDashboard(true);

    const interval = setInterval(() => {
      loadDashboard(false);
    }, 30_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        {error}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>Network Monitoring</h1>
            <p>
              Property network overview
            </p>
          </div>

          <div className="system-status">
            <span className="status-dot" />
            Monitoring Active
          </div>
        </header>

        <DashboardSummary
          summary={summary}
        />

        <LocationHealth
          locations={locations}
        />

        <IncidentList
          incidents={incidents}
        />

        <DeviceStatusTable
          devices={devices}
        />
      </main>
    </div>
  );
}

export default Dashboard;
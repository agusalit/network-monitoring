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
    Promise.all([
      getDashboardSummary(),
      getDashboardLocations(),
      getDashboardIncidents(),
      getDashboardDevices()
    ])
      .then(([
        summaryResponse,
        locationResponse,
        incidentResponse,
        devicesResponse
      ]) => {
        setSummary(summaryResponse.data.summary);

        setLocations(locationResponse.data);

        setIncidents(incidentResponse.data);

        setDevices(devicesResponse.data);
      })
      .catch(error => {
        console.error(error);

        setError(
          'Failed to load dashboard data.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
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
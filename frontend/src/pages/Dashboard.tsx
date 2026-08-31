import { useEffect, useState } from 'react';

import {
  getDashboardSummary
} from '../services/api.js';

import type {
  DashboardSummary
} from '../types/dashboard.js';

function Dashboard() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    getDashboardSummary()
      .then(response => {
        setSummary(response.data.summary);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to load dashboard data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>Network Monitoring</h1>

      {summary && (
        <div>
          <p>Total Devices: {summary.total}</p>
          <p>Online: {summary.online}</p>
          <p>Warning: {summary.warning}</p>
          <p>Offline: {summary.offline}</p>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
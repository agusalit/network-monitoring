import { useEffect, useState } from 'react';

import {
  getDashboardSummary
} from '../services/api.js';

import type {
  DashboardSummary as Summary
} from '../types/dashboard.js';

import DashboardSummary from '../components/DashboardSummary.js';

import Sidebar from '../components/Sidebar.js';

function Dashboard() {
  const [summary, setSummary] =
    useState<Summary | null>(null);

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
      </main>
    </div>
  );
}

export default Dashboard;
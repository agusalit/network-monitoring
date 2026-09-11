import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar.js';
import { getDashboardIncidents } from '../services/api.js';

import type {
  DashboardIncident
} from '../types/dashboard.js';

function Incidents() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState<
    DashboardIncident[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ACTIVE' | 'RESOLVED'
  >('ALL');

  useEffect(() => {
    async function loadIncidents() {
      try {
        setLoading(true);

        const response =
          await getDashboardIncidents();

        setIncidents(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load incidents.');
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    if (statusFilter === 'ALL') {
      return incidents;
    }

    return incidents.filter(
      incident =>
        incident.status === statusFilter
    );
  }, [incidents, statusFilter]);

  if (loading) {
    return (
      <div className="page-loading">
        Loading incidents...
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

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>Incidents</h1>
            <p>
              Network issues detected across the property
            </p>
          </div>
        </header>

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Incident History</h2>
              <p>
                Review active and resolved network incidents
              </p>
            </div>
          </div>

          <div className="incident-filters">
            <button
              className={
                statusFilter === 'ALL'
                  ? 'incident-filter active'
                  : 'incident-filter'
              }
              onClick={() =>
                setStatusFilter('ALL')
              }
            >
              All
            </button>

            <button
              className={
                statusFilter === 'ACTIVE'
                  ? 'incident-filter active'
                  : 'incident-filter'
              }
              onClick={() =>
                setStatusFilter('ACTIVE')
              }
            >
              Active
            </button>

            <button
              className={
                statusFilter === 'RESOLVED'
                  ? 'incident-filter active'
                  : 'incident-filter'
              }
              onClick={() =>
                setStatusFilter('RESOLVED')
              }
            >
              Resolved
            </button>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="incident-empty">
              <strong>No incidents found</strong>
              <p>
                There are no incidents matching the
                current filter.
              </p>
            </div>
          ) : (
            <div className="incident-list">
              {filteredIncidents.map(incident => (
                <div
                  key={incident.id}
                  className="incident-card incident-clickable"
                  onClick={() => {
                    if (incident.device) {
                      navigate(
                        `/devices/${incident.device.id}`
                      );
                    }
                  }}
                >
                  <div className="incident-header">
                    <div>
                      <strong>
                        {incident.title}
                      </strong>

                      <p>
                        {incident.description ?? '-'}
                      </p>
                    </div>

                    <div className="incident-badges">
                      <span
                        className={`incident-severity ${incident.severity.toLowerCase()}`}
                      >
                        {incident.severity}
                      </span>

                      <span
                        className={`incident-status ${incident.status.toLowerCase()}`}
                      >
                        {incident.status}
                      </span>
                    </div>
                  </div>

                  <div className="incident-meta">
                    <span>
                      Device:{' '}
                      {incident.device?.name ??
                        'Unknown'}
                    </span>

                    <span>
                      Location:{' '}
                      {incident.location?.name ??
                        'Unknown'}
                    </span>

                    <span>
                      Started:{' '}
                      {new Date(
                        incident.startedAt
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="device-result-count">
            Showing {filteredIncidents.length} of{' '}
            {incidents.length} incidents
          </div>
        </section>
      </main>
    </div>
  );
}

export default Incidents;
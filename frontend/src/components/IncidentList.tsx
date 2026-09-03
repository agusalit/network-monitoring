import {
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

import type {
  DashboardIncident
} from '../types/dashboard.js';

interface Props {
  incidents: DashboardIncident[];
}

function IncidentList({ incidents }: Props) {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>Active Incidents</h2>
          <p>
            Issues requiring attention
          </p>
        </div>
      </div>

      {incidents.length === 0 ? (
        <div className="no-incidents">
          <CheckCircle size={22} />

          <div>
            <strong>
              No active incidents
            </strong>

            <p>
              All monitored devices are
              operating normally.
            </p>
          </div>
        </div>
      ) : (
        <div className="incident-list">
          {incidents.map(incident => (
            <div
              key={incident.id}
              className="incident-card"
            >
              <div className="incident-icon">
                <AlertTriangle size={20} />
              </div>

              <div className="incident-content">
                <div className="incident-title-row">
                  <strong>
                    {incident.title}
                  </strong>

                  <span
                    className={`incident-severity ${incident.severity.toLowerCase()}`}
                  >
                    {incident.severity}
                  </span>
                </div>

                <p>
                  {incident.description}
                </p>

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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default IncidentList;
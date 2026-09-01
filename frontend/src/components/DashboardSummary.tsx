import type { DashboardSummary as Summary } from '../types/dashboard.js';

interface Props {
  summary: Summary;
}

function DashboardSummary({ summary }: Props) {
  return (
    <section className="summary-grid">
      <div className="summary-card">
        <span>Total Devices</span>
        <strong>{summary.total}</strong>
      </div>

      <div className="summary-card">
        <span>Online</span>
        <strong>{summary.online}</strong>
      </div>

      <div className="summary-card">
        <span>Warning</span>
        <strong>{summary.warning}</strong>
      </div>

      <div className="summary-card">
        <span>Offline</span>
        <strong>{summary.offline}</strong>
      </div>
    </section>
  );
}

export default DashboardSummary;
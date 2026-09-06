import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { 
  getDeviceById,
  getMonitoringHistory 
} from '../services/api.js';

function DeviceDetail() {
  const { id } = useParams<{ id: string }>();

  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    async function loadDevice() {
      if (!id) {
        setError('Invalid device ID.');
        setLoading(false);
        return;
      }

      try {
        const response = await getDeviceById(id);
        setDevice(response.data);

        const historyResponse = await getMonitoringHistory(id);
        setHistory(historyResponse.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load device.');
      } finally {
        setLoading(false);
      }
    }

    loadDevice();
  }, [id]);

  if (loading) {
    return (
      <main className="page-content">
        <p>Loading device...</p>
      </main>
    );
  }

  if (error || !device) {
    return (
      <main className="page-content">
        <p>{error ?? 'Device not found.'}</p>
      </main>
    );
  }

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1>{device.name}</h1>
          <p>Device details and monitoring information</p>
        </div>

        <span
          className={`device-status ${device.status.toLowerCase()}`}
        >
          <span className="status-dot" />
          {device.status}
        </span>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Device Information</h2>
            <p>Basic network device information</p>
          </div>
        </div>

        <div className="device-detail-grid">
          <div>
            <span>Hostname</span>
            <strong>{device.hostname ?? '-'}</strong>
          </div>

          <div>
            <span>Device Type</span>
            <strong>{device.device_type}</strong>
          </div>

          <div>
            <span>Vendor</span>
            <strong>{device.vendor ?? '-'}</strong>
          </div>

          <div>
            <span>Model</span>
            <strong>{device.model ?? '-'}</strong>
          </div>

          <div>
            <span>IP Address</span>
            <strong>{device.ip_address}</strong>
          </div>

          <div>
            <span>MAC Address</span>
            <strong>{device.mac_address ?? '-'}</strong>
          </div>

          <div>
            <span>Enabled</span>
            <strong>{device.enabled ? 'Yes' : 'No'}</strong>
          </div>

          <div>
            <span>Last Seen</span>
            <strong>
              {device.last_seen_at
                ? new Date(device.last_seen_at).toLocaleString()
                : '-'}
            </strong>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Location</h2>
            <p>Where this device is installed</p>
          </div>
        </div>

        <div className="device-location">
          <strong>
            {device.location?.name ?? 'Unknown'}
          </strong>

          <span>
            {device.location?.type ?? '-'}
          </span>

          {device.location?.area && (
            <span>
              Area: {device.location.area.name}
            </span>
          )}

          {device.location?.area?.property && (
            <span>
              Property: {device.location.area.property.name}
            </span>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Monitoring Configuration</h2>
            <p>How this device is monitored</p>
          </div>
        </div>

        {device.monitoring_configs.length === 0 ? (
          <p>No monitoring configuration.</p>
        ) : (
          device.monitoring_configs.map((config: any) => (
            <div
              key={config.id}
              className="monitoring-config"
            >
              <strong>{config.method}</strong>

              <span>
                {config.enabled ? 'Enabled' : 'Disabled'}
              </span>

              <span>
                Interval: {config.interval_seconds}s
              </span>

              <span>
                Timeout: {config.timeout_seconds}s
              </span>

              <span>
                Retries: {config.retries}
              </span>
            </div>
          ))
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Monitoring History</h2>
            <p>Recent monitoring results for this device</p>
          </div>
        </div>

        {history.length === 0 ? (
          <p>No monitoring history available.</p>
        ) : (
          <div className="device-table-wrapper">
            <table className="device-table">
              <thead>
                <tr>
                  <th>Checked At</th>
                  <th>Status</th>
                  <th>Latency</th>
                  <th>Packet Loss</th>
                  <th>CPU</th>
                  <th>Memory</th>
                </tr>
              </thead>

              <tbody>
                {history.map(record => (
                  <tr key={record.id}>
                    <td>
                      {new Date(
                        record.checked_at
                      ).toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`device-status ${record.status.toLowerCase()}`}
                      >
                        <span className="status-dot" />
                        {record.status}
                      </span>
                    </td>

                    <td>
                      {record.latency_ms !== null
                        ? `${record.latency_ms} ms`
                        : '-'}
                    </td>

                    <td>
                      {record.packet_loss_percent !== null
                        ? `${record.packet_loss_percent}%`
                        : '-'}
                    </td>

                    <td>
                      {record.cpu_usage_percent !== null
                        ? `${record.cpu_usage_percent}%`
                        : '-'}
                    </td>

                    <td>
                      {record.memory_usage_percent !== null
                        ? `${record.memory_usage_percent}%`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Incidents</h2>
            <p>Incident history for this device</p>
          </div>
        </div>

        {device.incidents.length === 0 ? (
          <p>No incidents recorded.</p>
        ) : (
          device.incidents.map((incident: any) => (
            <div
              key={incident.id}
              className="incident-card"
            >
              <div className="incident-content">
                <strong>{incident.title}</strong>

                <p>
                  {incident.description ?? '-'}
                </p>

                <div className="incident-meta">
                  <span>
                    Severity: {incident.severity}
                  </span>

                  <span>
                    Status: {incident.status}
                  </span>

                  <span>
                    Started:{' '}
                    {new Date(
                      incident.started_at
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default DeviceDetail;
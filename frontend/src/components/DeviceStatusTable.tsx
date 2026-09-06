import { useNavigate } from 'react-router-dom';

import type {
  DashboardDevice
} from '../types/dashboard.js';

interface Props {
  devices: DashboardDevice[];
}

function DeviceStatusTable({ devices }: Props) {
  const navigate = useNavigate();

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>Device Status</h2>
          <p>Current condition of monitored network devices</p>
        </div>
      </div>

      <div className="device-table-wrapper">
        <table className="device-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>IP Address</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {devices.map(device => (
              <tr
                key={device.id}
                className="device-row"
                onClick={() => navigate(`/devices/${device.id}`)}
              >
                <td>
                  <strong>{device.name}</strong>
                </td>

                <td>{device.ipAddress}</td>

                <td>
                  {device.location?.name ?? 'Unknown'}
                </td>

                <td>
                  <span
                    className={`device-status ${device.status.toLowerCase()}`}
                  >
                    <span className="status-dot" />
                    {device.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DeviceStatusTable;
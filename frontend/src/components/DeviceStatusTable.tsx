import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  DashboardDevice
} from '../types/dashboard.js';

interface Props {
  devices: DashboardDevice[];
}

function DeviceStatusTable({ devices }: Props) {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ONLINE' | 'WARNING' | 'OFFLINE'
  >('ALL');

  const filteredDevices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return devices.filter(device => {
      const matchesSearch =
        query === '' ||
        device.name.toLowerCase().includes(query) ||
        device.ipAddress.toLowerCase().includes(query) ||
        device.location?.name.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'ALL' ||
        device.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [devices, search, statusFilter]);

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>Device Status</h2>
          <p>
            Current condition of monitored network devices
          </p>
        </div>
      </div>

      <div className="device-filters">
        <input
          type="text"
          placeholder="Search device, IP address, or location..."
          value={search}
          onChange={event => setSearch(event.target.value)}
          className="device-search"
        />

        <select
          value={statusFilter}
          onChange={event =>
            setStatusFilter(
              event.target.value as
                | 'ALL'
                | 'ONLINE'
                | 'WARNING'
                | 'OFFLINE'
            )
          }
          className="device-status-filter"
        >
          <option value="ALL">All Status</option>
          <option value="ONLINE">Online</option>
          <option value="WARNING">Warning</option>
          <option value="OFFLINE">Offline</option>
        </select>
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
            {filteredDevices.length > 0 ? (
              filteredDevices.map(device => (
                <tr
                  key={device.id}
                  className="device-row"
                  onClick={() =>
                    navigate(`/devices/${device.id}`)
                  }
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
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="device-empty"
                >
                  No devices match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="device-result-count">
        Showing {filteredDevices.length} of {devices.length} devices
      </div>
    </section>
  );
}

export default DeviceStatusTable;
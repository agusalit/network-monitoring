import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar.js';
import { getDashboardDevices } from '../services/api.js';

import type {
  DashboardDevice
} from '../types/dashboard.js';

function Devices() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<DashboardDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ONLINE' | 'WARNING' | 'OFFLINE'
  >('ALL');

  useEffect(() => {
    async function loadDevices() {
      try {
        setLoading(true);

        const response = await getDashboardDevices();

        setDevices(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load devices.');
      } finally {
        setLoading(false);
      }
    }

    loadDevices();
  }, []);

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

  if (loading) {
    return (
      <div className="page-loading">
        Loading devices...
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
            <h1>Devices</h1>
            <p>
              Network devices monitored by the system
            </p>
          </div>
        </header>

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Device Inventory</h2>
              <p>
                View and manage monitored network devices
              </p>
            </div>
          </div>

          <div className="device-filters">
            <input
              type="text"
              placeholder="Search device, IP address, or location..."
              value={search}
              onChange={event =>
                setSearch(event.target.value)
              }
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
      </main>
    </div>
  );
}

export default Devices;
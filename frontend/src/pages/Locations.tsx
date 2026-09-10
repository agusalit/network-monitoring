import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getDashboardLocations
} from '../services/api.js';

import type {
  DashboardLocation
} from '../types/dashboard.js';

function getHealthClass(
  health: DashboardLocation['health']
) {
  switch (health) {
    case 'ONLINE':
      return 'online';

    case 'WARNING':
      return 'warning';

    case 'OFFLINE':
      return 'offline';

    default:
      return 'no-data';
  }
}

function Locations() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<
    DashboardLocation[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadLocations() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getDashboardLocations();

        setLocations(response.data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load locations.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  if (loading) {
    return (
      <main className="page-content">
        <p>Loading locations...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-content">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="page-content">

      <div className="page-header">
        <div>
          <h1>Locations</h1>

          <p>
            Network health across all locations
          </p>
        </div>

        <span className="location-count">
          {locations.length} locations
        </span>
      </div>

      <section className="dashboard-section">

        <div className="location-overview-grid">

          {locations.map(location => (
            <div
              key={location.id}
              className="location-overview-card"
              onClick={() =>
                navigate(
                  `/locations/${location.id}`
                )
              }
            >

              <div className="location-overview-header">

                <div>
                  <h2>{location.name}</h2>

                  <span>
                    {location.type}
                  </span>
                </div>

                <span
                  className={`health-badge ${getHealthClass(
                    location.health
                  )}`}
                >
                  {location.health}
                </span>

              </div>

              <div className="location-overview-devices">

                <div>
                  <span>Devices</span>
                  <strong>
                    {location.devices.total}
                  </strong>
                </div>

                <div>
                  <span>Online</span>
                  <strong>
                    {location.devices.online}
                  </strong>
                </div>

                <div>
                  <span>Warning</span>
                  <strong>
                    {location.devices.warning}
                  </strong>
                </div>

                <div>
                  <span>Offline</span>
                  <strong>
                    {location.devices.offline}
                  </strong>
                </div>

              </div>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}

export default Locations;
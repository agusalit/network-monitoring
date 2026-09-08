import { useNavigate } from 'react-router-dom';

import type {
  DashboardLocation
} from '../types/dashboard.js';

interface Props {
  locations: DashboardLocation[];
}

function LocationHealth({ locations }: Props) {
  const navigate = useNavigate();

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div>
          <h2>Location Health</h2>
          <p>Network condition by property area</p>
        </div>
      </div>

      <div className="location-grid">
        {locations.map(location => (
          <div
            key={location.id}
            className="location-card"
            onClick={() => navigate(`/locations/${location.id}`)}
          >
            <div className="location-card-header">
              <div>
                <h3>{location.name}</h3>
                <span>{location.type}</span>
              </div>

              <span
                className={`health-badge ${location.health.toLowerCase()}`}
              >
                {location.health}
              </span>
            </div>

            <div className="location-devices">
              <span>
                {location.devices.total} devices
              </span>

              <span>
                {location.devices.online} online
              </span>

              {location.devices.warning > 0 && (
                <span>
                  {location.devices.warning} warning
                </span>
              )}

              {location.devices.offline > 0 && (
                <span>
                  {location.devices.offline} offline
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LocationHealth;
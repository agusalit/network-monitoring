import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getLocationById
} from '../services/api';

type LocationDetailData = {
  location: {
    id: string;
    name: string;
    type: string;
    floor_number: number | null;

    area: {
      id: string;
      name: string;
      type: string;

      property: {
        id: string;
        name: string;
      } | null;
    } | null;
  };

  health: 'ONLINE' | 'WARNING' | 'OFFLINE' | 'NO_DATA';

  summary: {
    total: number;
    online: number;
    warning: number;
    offline: number;
  };

  devices: {
    id: string;
    name: string;
    hostname: string | null;
    device_type: string;
    vendor: string | null;
    model: string | null;
    ip_address: string;
    mac_address: string | null;
    status: 'ONLINE' | 'WARNING' | 'OFFLINE';
    description: string | null;
    enabled: boolean;
    last_seen_at: string | null;
    created_at: string;
    updated_at: string;
  }[];
};

function getStatusClass(status: string) {
  switch (status) {
    case 'ONLINE':
      return 'status-online';

    case 'WARNING':
      return 'status-warning';

    case 'OFFLINE':
      return 'status-offline';

    default:
      return 'status-neutral';
  }
}

export default function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] =
    useState<LocationDetailData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Location ID is missing');
      setLoading(false);
      return;
    }

    async function loadLocation() {
      try {
        setLoading(true);
        setError(null);

        const response = await getLocationById(id!);

        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load location'
        );
      } finally {
        setLoading(false);
      }
    }

    loadLocation();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p>Loading location...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <button
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h1>Location</h1>

        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <p>Location not found.</p>
      </div>
    );
  }

  const {
    location,
    health,
    summary,
    devices
  } = data;

  return (
    <div className="page">

      {/* Header */}
      <div className="page-header">

        <div>
          <button
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <h1>{location.name}</h1>

          <p>
            {location.type}
            {location.floor_number !== null
              ? ` · Floor ${location.floor_number}`
              : ''}
          </p>
        </div>

        <div
          className={`status-badge ${getStatusClass(
            health
          )}`}
        >
          {health}
        </div>

      </div>

      {/* Location Information */}
      <section className="detail-section">

        <h2>Location Information</h2>

        <div className="detail-grid">

          <div className="detail-item">
            <span>Property</span>
            <strong>
              {location.area?.property?.name ?? '—'}
            </strong>
          </div>

          <div className="detail-item">
            <span>Area</span>
            <strong>
              {location.area?.name ?? '—'}
            </strong>
          </div>

          <div className="detail-item">
            <span>Area Type</span>
            <strong>
              {location.area?.type ?? '—'}
            </strong>
          </div>

          <div className="detail-item">
            <span>Floor</span>
            <strong>
              {location.floor_number ?? '—'}
            </strong>
          </div>

        </div>

      </section>

      {/* Health Summary */}
      <section className="detail-section">

        <h2>Network Summary</h2>

        <div className="summary-grid">

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

        </div>

      </section>

      {/* Devices */}
      <section className="detail-section">

        <div className="section-header">
          <h2>Devices</h2>

          <span>
            {devices.length} device
            {devices.length !== 1 ? 's' : ''}
          </span>
        </div>

        {devices.length === 0 ? (
          <div className="empty-state">
            No devices assigned to this location.
          </div>
        ) : (
          <div className="device-list">

            {devices.map((device) => (

              <div
                key={device.id}
                className="device-row"
                onClick={() =>
                  navigate(`/devices/${device.id}`)
                }
              >

                <div className="device-main">

                  <strong>
                    {device.name}
                  </strong>

                  <span>
                    {device.ip_address}
                  </span>

                </div>

                <div className="device-meta">

                  <span>
                    {device.device_type}
                  </span>

                  <span
                    className={`status-badge ${getStatusClass(
                      device.status
                    )}`}
                  >
                    {device.status}
                  </span>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );
}
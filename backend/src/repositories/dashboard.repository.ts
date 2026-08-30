import { supabase } from '../config/supabase.js';

export async function getDashboardSummary() {
  const { data: devices, error } = await supabase
    .from('devices')
    .select('id, status');

  if (error) {
    throw new Error(error.message);
  }

  const total = devices?.length ?? 0;

  const online =
    devices?.filter(
      device => device.status === 'ONLINE'
    ).length ?? 0;

  const warning =
    devices?.filter(
      device => device.status === 'WARNING'
    ).length ?? 0;

  const offline =
    devices?.filter(
      device => device.status === 'OFFLINE'
    ).length ?? 0;

  return {
    total,
    online,
    warning,
    offline
  };
}

export async function getDashboardDevices() {
  const { data, error } = await supabase
    .from('devices')
    .select(`
      id,
      name,
      ip_address,
      status,
      location_id,
      locations (
        id,
        name,
        type
      )
    `)
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(device => {
    const location = Array.isArray(device.locations)
      ? device.locations[0]
      : device.locations;

    return {
      id: device.id,
      name: device.name,
      ipAddress: device.ip_address,
      status: device.status,
      location: location
        ? {
            id: location.id,
            name: location.name,
            type: location.type
          }
        : null
    };
  });
}

export async function getActiveIncidents() {
  const { data, error } = await supabase
    .from('incidents')
    .select(`
      id,
      device_id,
      severity,
      title,
      description,
      status,
      started_at,
      updated_at,
      devices (
        id,
        name,
        ip_address,
        location_id,
        locations (
          id,
          name,
          type
        )
      )
    `)
    .eq('status', 'ACTIVE')
    .order('started_at', {
      ascending: false
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(incident => {
    const device = Array.isArray(incident.devices)
      ? incident.devices[0]
      : incident.devices;

    const location = device
      ? Array.isArray(device.locations)
        ? device.locations[0]
        : device.locations
      : null;

    return {
      id: incident.id,
      deviceId: incident.device_id,
      severity: incident.severity,
      title: incident.title,
      description: incident.description,
      status: incident.status,
      startedAt: incident.started_at,
      updatedAt: incident.updated_at,

      device: device
        ? {
            id: device.id,
            name: device.name,
            ipAddress: device.ip_address
          }
        : null,

      location: location
        ? {
            id: location.id,
            name: location.name,
            type: location.type
          }
        : null
    };
  });
}

export async function getLocationHealth() {
  const { data: locations, error: locationError } =
    await supabase
      .from('locations')
      .select(`
        id,
        name,
        type
      `)
      .order('name');

  if (locationError) {
    throw new Error(locationError.message);
  }

  const { data: devices, error: deviceError } =
    await supabase
      .from('devices')
      .select(`
        id,
        name,
        status,
        location_id
      `);

  if (deviceError) {
    throw new Error(deviceError.message);
  }

  return (locations ?? []).map(location => {
    const locationDevices =
      (devices ?? []).filter(
        device =>
          device.location_id === location.id
      );

    const total = locationDevices.length;

    const online =
      locationDevices.filter(
        device => device.status === 'ONLINE'
      ).length;

    const warning =
      locationDevices.filter(
        device => device.status === 'WARNING'
      ).length;

    const offline =
      locationDevices.filter(
        device => device.status === 'OFFLINE'
      ).length;

    let health = 'NO_DATA';

    if (offline > 0) {
      health = 'OFFLINE';
    } else if (warning > 0) {
      health = 'WARNING';
    } else if (online > 0) {
      health = 'ONLINE';
    }

    return {
      id: location.id,
      name: location.name,
      type: location.type,

      health,

      devices: {
        total,
        online,
        warning,
        offline
      }
    };
  });
}
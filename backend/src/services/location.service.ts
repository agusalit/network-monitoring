import {
  findLocationById,
  findDevicesByLocationId
} from '../repositories/location.repository.js';

export async function getLocationDetail(
  locationId: string
) {
  const location = await findLocationById(locationId);

  if (!location) {
    throw new Error('Location not found');
  }

  const devices = await findDevicesByLocationId(locationId);

  const summary = {
    total: devices.length,
    online: devices.filter(
      (device) => device.status === 'ONLINE'
    ).length,
    warning: devices.filter(
      (device) => device.status === 'WARNING'
    ).length,
    offline: devices.filter(
      (device) => device.status === 'OFFLINE'
    ).length
  };

  let health:
    | 'ONLINE'
    | 'WARNING'
    | 'OFFLINE'
    | 'NO_DATA';

  if (summary.offline > 0) {
    health = 'OFFLINE';
  } else if (summary.warning > 0) {
    health = 'WARNING';
  } else if (summary.online > 0) {
    health = 'ONLINE';
  } else {
    health = 'NO_DATA';
  }

  return {
    location,
    health,
    summary,
    devices
  };
}
import { findAllDevices } from '../repositories/device.repository.js';

export async function getAllDevices() {
  const devices = await findAllDevices();

  return devices;
}

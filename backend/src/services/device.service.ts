import {
  findAllDevices,
  findDeviceById
} from '../repositories/device.repository.js';

export async function getAllDevices() {
  const devices = await findAllDevices();

  return devices;
}

export async function getDeviceById(id: string) {
  const device = await findDeviceById(id);

  return device;
}
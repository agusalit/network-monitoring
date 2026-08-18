import { Request, Response } from 'express';

import {
  getAllDevices,
  getDeviceById
} from '../services/device.service.js';

export async function getDevices(
  _req: Request,
  res: Response
) {
  try {
    const devices = await getAllDevices();

    res.json({
      status: 'ok',
      data: devices
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve devices'
    });
  }
}

export async function getDevice(
  req: Request,
  res: Response
) {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid device id'
      });

      return;
    }

    const device = await getDeviceById(id);

    if (!device) {
      res.status(404).json({
        status: 'error',
        message: 'Device not found'
      });

      return;
    }

    res.json({
      status: 'ok',
      data: device
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve device'
    });
  }
}
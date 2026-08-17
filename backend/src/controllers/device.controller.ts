import { Request, Response } from 'express';

import { getAllDevices } from '../services/device.service.js';

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

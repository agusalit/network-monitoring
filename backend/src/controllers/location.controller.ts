import { Request, Response } from 'express';

import {
  getLocationDetail
} from '../services/location.service.js';

export async function getLocationDetailController(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params as { id: string};

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Location ID is required'
      });
    }

    const data = await getLocationDetail(id);

    return res.json({
      status: 'success',
      data
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to get location detail';

    if (message.toLowerCase().includes('not found')) {
      return res.status(404).json({
        status: 'error',
        message
      });
    }

    return res.status(500).json({
      status: 'error',
      message
    });
  }
}
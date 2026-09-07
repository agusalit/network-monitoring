import { Request, Response } from 'express';

import {
  runMonitoringCycle
} from '../monitoring/monitoring.service.js';

import {
  getMonitoringHistoryByDeviceId
} from '../monitoring/monitoring.service.js';

import {
  setAP203SimulationWarning
} from '../monitoring/monitoring.service.js'

export async function runMonitoring(
  _req: Request,
  res: Response
) {
  try {
    const results = await runMonitoringCycle();

    res.json({
      status: 'ok',
      checked: results.length,
      data: results
    });
  } catch (error) {
    console.error('Monitoring cycle failed:', error);

    res.status(500).json({
      status: 'error',
      message: error instanceof Error
        ? error.message
        : String(error)
    });
  }
}

export async function getMonitoringHistory(
  req: Request,
  res: Response
) {
  try {
    const rawId = req.params.id;
    const deviceId = Array.isArray(rawId)
      ? rawId[0]
      : rawId;

    if (!deviceId) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid device id'
      });

      return;
    }

    const rawLimit = req.query.limit;

    let limit = 50;

    if (typeof rawLimit === 'string') {
      const parsedLimit = Number(rawLimit);

      if (
        Number.isInteger(parsedLimit) &&
        parsedLimit > 0 &&
        parsedLimit <= 100
      ) {
        limit = parsedLimit;
      }
    }

    const history =
      await getMonitoringHistoryByDeviceId(
        deviceId,
        limit
      );

    res.json({
      status: 'ok',
      data: history
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve monitoring history'
    });
  }
}

export async function setAP203Simulation(
  req: any,
  res: any,
){
  const enabled = req.body?.warning === true;

  setAP203SimulationWarning(enabled);

  res.json({
    status: 'ok',
    ap203Warning: enabled
  });
}
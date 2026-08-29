import { Request, Response } from 'express';

import {
  runMonitoringCycle
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
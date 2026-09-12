import { Request, Response } from 'express';

import {
  runMonitoringCycle
} from '../monitoring/monitoring.service.js';

import {
  getMonitoringHistoryByDeviceId
} from '../monitoring/monitoring.service.js';

import {
  setAP203SimulationWarning
} from '../monitoring/monitoring.service.js';

import {
  getAllMonitoringConfigs,
  getMonitoringConfigById,
  patchMonitoringConfig
} from '../monitoring/monitoring.service.js';

import type {
  MonitoringConfigUpdate
} from '../repositories/monitoring-config.repository.js';

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

export async function getMonitoringConfigs(
  _req: Request,
  res: Response
) {
  try {
    const configs = await getAllMonitoringConfigs();

    res.json({
      status: 'ok',
      data: configs
    });
  } catch (error) {
    console.error(
      'Failed to retrieve monitoring configs:',
      error
    );

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve monitoring configurations'
    });
  }
}

export async function getMonitoringConfig(
  req: Request,
  res: Response
) {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId)
      ? rawId[0]
      : rawId;

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid monitoring configuration id'
      });

      return;
    }

    const config = await getMonitoringConfigById(id);

    if (!config) {
      res.status(404).json({
        status: 'error',
        message: 'Monitoring configuration not found'
      });

      return;
    }

    res.json({
      status: 'ok',
      data: config
    });
  } catch (error) {
    console.error(
      'Failed to retrieve monitoring config:',
      error
    );

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve monitoring configuration'
    });
  }
}

export async function patchMonitoringConfigController(
  req: Request,
  res: Response
) {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId)
      ? rawId[0]
      : rawId;

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid monitoring configuration id'
      });

      return;
    }

    const body = req.body ?? {};

    const allowedFields = [
      'enabled',
      'interval_seconds',
      'timeout_seconds',
      'retries',
      'configuration'
    ] as const;

    const updates: MonitoringConfigUpdate = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'No valid configuration fields supplied'
      });

      return;
    }

    const config = await patchMonitoringConfig(
      id,
      updates
    );

    if (!config) {
      res.status(404).json({
        status: 'error',
        message: 'Monitoring configuration not found'
      });

      return;
    }

    res.json({
      status: 'ok',
      data: config
    });
  } catch (error) {
    console.error(
      'Failed to update monitoring config:',
      error
    );

    res.status(400).json({
      status: 'error',
      message: error instanceof Error
        ? error.message
        : 'Failed to update monitoring configuration'
    });
  }
}
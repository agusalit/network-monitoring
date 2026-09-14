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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateMonitoringConfigUpdate(body: unknown): {
  valid: boolean;
  updates?: Record<string, unknown>;
  error?: string;
} {
  if (!isPlainObject(body)) {
    return {
      valid: false,
      error: 'Request body must be a JSON object'
    };
  }

  const allowedFields = [
    'enabled',
    'interval_seconds',
    'timeout_seconds',
    'retries',
    'configuration'
  ];

  const unknownFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    return {
      valid: false,
      error: `Unknown field(s): ${unknownFields.join(', ')}`
    };
  }

  if (Object.keys(body).length === 0) {
    return {
      valid: false,
      error: 'At least one field must be provided'
    };
  }

  if ('enabled' in body && typeof body.enabled !== 'boolean') {
    return {
      valid: false,
      error: 'enabled must be a boolean'
    };
  }

  const positiveIntegerFields = [
    'interval_seconds',
    'timeout_seconds'
  ];

  for (const field of positiveIntegerFields) {
    if (field in body) {
      const value = body[field];

      if (
        typeof value !== 'number' ||
        !Number.isInteger(value) ||
        value <= 0
      ) {
        return {
          valid: false,
          error: `${field} must be a positive integer`
        };
      }
    }
  }

  if ('retries' in body) {
    const value = body.retries;

    if (
      typeof value !== 'number' ||
      !Number.isInteger(value) ||
      value < 0
    ) {
      return {
        valid: false,
        error: 'retries must be a non-negative integer'
      };
    }
  }

  if ('configuration' in body) {
    if (!isPlainObject(body.configuration)) {
      return {
        valid: false,
        error: 'configuration must be a JSON object'
      };
    }
  }

  return {
    valid: true,
    updates: body
  };
}

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
    console.error('Failed to retrieve monitoring configurations:', error);

    return res.status(500).json({
      status: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Failed to retrieve monitoring configurations'
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
    const validation = validateMonitoringConfigUpdate(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        status: 'error',
        message: validation.error
      });
    }

    const rawId = req.params.id;
    const id = Array.isArray(rawId)
      ? rawId[0]
      : rawId;

if (!id) {
  return res.status(400).json({
    status: 'error',
    message: 'Invalid monitoring configuration id'
  });
}

    const updatedConfig = await patchMonitoringConfig(
      id,
      validation.updates!
    );

    if (!updatedConfig) {
      return res.status(404).json({
        status: 'error',
        message: 'Monitoring configuration not found'
      });
    }

    return res.status(200).json({
      status: 'ok',
      data: updatedConfig
    });
  } catch (error) {
    console.error('Failed to update monitoring configuration:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Failed to update monitoring configuration'
    });
  }
}
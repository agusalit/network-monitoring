import {
  findEnabledMonitoringConfigs,
  updateDeviceStatus,
  createMonitoringRecord,
  MonitoringConfigWithDevice
} from '../repositories/monitoring.repository.js';

import {
  MonitoringTarget
} from './monitoring-provider.js';

import {
  SimulationProvider
} from './simulation.provider.js';

import {
  processMonitoringResult
} from '../incidents/incident.service.js'

const simulationProvider = new SimulationProvider();

export async function runMonitoringCycle(
  configs?: MonitoringConfigWithDevice[]
) {
  const monitoringConfigs = configs ?? await findEnabledMonitoringConfigs();
  
  const results = [];

  for (const config of monitoringConfigs) {
    if (!config.device) {
      continue;
    }

    const target: MonitoringTarget = {
      id: config.device.id,
      name: config.device.name,
      ipAddress: config.device.ip_address
    };

    let result;

    switch (config.method) {
      case 'SIMULATION':
        result = await simulationProvider.check(target);
        break;

      default:
        throw new Error(
          `Unsupported monitoring method: ${config.method}`
        );
    }

    await updateDeviceStatus(
      target.id,
      result.status,
      result.status === 'OFFLINE'
        ? null
        : result.checkedAt
    );

    console.log('Creating monitoring record:', {
      deviceId: target.id,
      configId: config.id,
      result
    });

    const record = await createMonitoringRecord(
      target.id,
      config.id,
      result
    );

    const incident = await processMonitoringResult({
      deviceId: target.id,
      deviceName: target.name,
      monitoringConfigId: config.id,
      status: result.status,
      checkedAt: result.checkedAt,
      message: result.message
    });

    results.push({
      deviceId: target.id,
      deviceName: target.name,
      result,
      recordId: record.id,
      incident
    });
  }

  return results;
}

export function setAP203SimulationWarning(
  enabled: boolean
){
  simulationProvider.setAP203Warning(enabled);
}
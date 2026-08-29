import {
  findActiveIncidentByDevice,
  createIncident,
  updateIncident,
  resolveIncident
} from '../repositories/incident.repository.js';

import {
  findPreviousMonitoringRecord
} from '../repositories/monitoring.repository.js';

interface MonitoringIncidentResult {
  deviceId: string;
  deviceName: string;
  monitoringConfigId: string;
  status: string;
  checkedAt: string;
  message?: string;
}

export async function processMonitoringResult(
  result: MonitoringIncidentResult
) {
  const activeIncident =
    await findActiveIncidentByDevice(result.deviceId);

  const isWarning =
    result.status === 'WARNING';

  const isOffline =
    result.status === 'OFFLINE';

  const isHealthy =
    result.status === 'ONLINE';

  const previousRecord =
    await findPreviousMonitoringRecord(
      result.monitoringConfigId
    );

  const previousWasWarning =
    previousRecord?.status === 'WARNING';

  const warningThresholdReached =
    isWarning && previousWasWarning;

  // Healthy device
  if (isHealthy) {
    if (activeIncident) {
      await resolveIncident(
        activeIncident.id,
        result.checkedAt
      );

      console.log(
        `[Incident] Resolved incident ${activeIncident.id} for ${result.deviceName}`
      );

      return {
        action: 'RESOLVED',
        incidentId: activeIncident.id
      };
    }

    return {
      action: 'NONE',
      incidentId: null
    };
  }

  // Warning requires two consecutive observations
  if (isWarning && !warningThresholdReached) {
    console.log(
      `[Incident] Warning observed for ${result.deviceName}, waiting for confirmation`
    );

    return {
      action: 'OBSERVED',
      incidentId: null
    };
  }

  // WARNING threshold reached or device is OFFLINE
  if (warningThresholdReached || isOffline) {
    if (activeIncident) {
      await updateIncident(
        activeIncident.id,
        {
          severity: result.status,
          title:
            result.message ??
            'Network issue detected',
          description:
            result.message ??
            `${result.deviceName} is experiencing a network issue.`
        }
      );

      console.log(
        `[Incident] Updated incident ${activeIncident.id} for ${result.deviceName}`
      );

      return {
        action: 'UPDATED',
        incidentId: activeIncident.id
      };
    }

    const incident = await createIncident({
      deviceId: result.deviceId,
      severity: result.status,
      title:
        result.message ??
        'Network issue detected',
      description:
        result.message ??
        `${result.deviceName} is experiencing a network issue.`,
      startedAt: result.checkedAt
    });

    console.log(
      `[Incident] Created incident ${incident.id} for ${result.deviceName}`
    );

    return {
      action: 'CREATED',
      incidentId: incident.id
    };
  }

  return {
    action: 'NONE',
    incidentId: null
  };
}
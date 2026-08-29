import {
  findActiveIncidentByDevice,
  createIncident,
  updateIncident,
  resolveIncident
} from '../repositories/incident.repository.js';

interface MonitoringIncidentResult {
  deviceId: string;
  deviceName: string;
  status: string;
  checkedAt: string;
  message?: string;
}

export async function processMonitoringResult(
  result: MonitoringIncidentResult
) {
  const activeIncident =
    await findActiveIncidentByDevice(result.deviceId);

  const isProblem =
    result.status === 'WARNING' ||
    result.status === 'OFFLINE';

  // Device is healthy
  if (!isProblem) {
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

  // Device has a problem and already has an active incident
  if (activeIncident) {
    await updateIncident(
      activeIncident.id,
      {
        severity: result.status,
        title: result.message ?? 'Network issue detected',
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

  // Device has a problem but no active incident exists
  const incident = await createIncident({
    deviceId: result.deviceId,
    severity: result.status,
    title: result.message ?? 'Network issue detected',
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
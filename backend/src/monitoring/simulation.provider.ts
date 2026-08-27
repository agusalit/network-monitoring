import {
  MonitoringProvider,
  MonitoringTarget
} from './monitoring-provider.js';

import {
  MonitoringResult
} from '../types/monitoring.js';

export class SimulationProvider implements MonitoringProvider {
  async check(
    target: MonitoringTarget
  ): Promise<MonitoringResult> {
    const checkedAt = new Date().toISOString();

    // AP-203 is our intentionally problematic device.
    if (target.name === 'AP-203') {
      return {
        status: 'WARNING',
        latencyMs: 180,
        packetLossPercent: 15,
        checkedAt,
        message: 'High packet loss detected'
      };
    }

    return {
      status: 'ONLINE',
      latencyMs: Math.floor(Math.random() * 20) + 5,
      packetLossPercent: 0,
      checkedAt
    };
  }
}
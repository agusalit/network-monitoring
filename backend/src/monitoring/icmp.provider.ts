import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import type {
  MonitoringProvider,
  MonitoringTarget,
  MonitoringCheckOptions
} from './monitoring-provider.js';

import type { MonitoringResult } from '../types/monitoring.js';

const execFileAsync = promisify(execFile);

export class IcmpProvider implements MonitoringProvider {
  async check(
    target: MonitoringTarget,
    options: MonitoringCheckOptions
  ): Promise<MonitoringResult> {
    const checkedAt = new Date().toISOString();

    if (!target.ipAddress) {
      return {
        status: 'OFFLINE',
        latencyMs: null,
        packetLossPercent: 100,
        checkedAt,
        provider: 'ICMP',
        message: 'Device has no IP address',
        rawData: {
          error: 'NO_IP_ADDRESS'
        }
      };
    }

    const count = Math.max(options.retries + 1, 1);
    const timeout = Math.max(options.timeoutSeconds, 1);

    try {
      const { stdout } = await execFileAsync(
        'ping',
        [
          '-c',
          String(count),
          '-W',
          String(timeout),
          target.ipAddress
        ],
        {
          timeout: (timeout * count + 2) * 1000
        }
      );

      const latencyMs = this.parseLatency(stdout);
      const packetLossPercent = this.parsePacketLoss(stdout);

      return {
        status:
          packetLossPercent === 0
            ? 'ONLINE'
            : packetLossPercent < 100
              ? 'WARNING'
              : 'OFFLINE',

        latencyMs,
        packetLossPercent,
        checkedAt,
        provider: 'ICMP',
        rawData: {
          command: 'ping',
          target: target.ipAddress
        }
      };
    } catch (error) {
      const stdout =
        typeof error === 'object' &&
        error !== null &&
        'stdout' in error &&
        typeof error.stdout === 'string'
          ? error.stdout
          : '';

      const packetLossPercent = stdout
        ? this.parsePacketLoss(stdout)
        : 100;

      const latencyMs = stdout
        ? this.parseLatency(stdout)
        : null;

      return {
        status: 'OFFLINE',
        latencyMs,
        packetLossPercent,
        checkedAt,
        provider: 'ICMP',
        message: 'ICMP ping failed',
        rawData: {
          command: 'ping',
          target: target.ipAddress
        }
      };
    }
  }

  private parseLatency(output: string): number | null {
    const match = output.match(
      /(?:rtt|round-trip).*?=\s*[\d.]+\/([\d.]+)\//
    );

    if (!match) {
      return null;
    }

    const latency = Number(match[1]);

    return Number.isFinite(latency)
      ? latency
      : null;
  }

  private parsePacketLoss(output: string): number {
    const match = output.match(
      /(\d+(?:\.\d+)?)%\s*packet loss/
    );

    if (!match) {
      return 100;
    }

    const packetLoss = Number(match[1]);

    return Number.isFinite(packetLoss)
      ? packetLoss
      : 100;
  }
}
import {
  findDueMonitoringConfigs
} from '../repositories/monitoring.repository.js';

import {
  runMonitoringCycle
} from './monitoring.service.js';

let schedulerTimer: NodeJS.Timeout | null = null;

const SCHEDULER_INTERVAL_MS = 5000;

export async function runScheduledMonitoring() {
  try {
    const configs = await findDueMonitoringConfigs();

    if (configs.length === 0) {
      console.log(
        `[Scheduler] No monitoring checks due`
      );

      return;
    }

    console.log(
      `[Scheduler] Running ${configs.length} monitoring checks`
    );

    const results = await runMonitoringCycle(configs);

    console.log(
      `[Scheduler] Completed ${results.length} monitoring checks`
    );
  } catch (error) {
    console.error(
      '[Scheduler] Monitoring failed:',
      error
    );
  }
}

export function startMonitoringScheduler() {
  if (schedulerTimer) {
    return;
  }

  console.log(
    '[Scheduler] Starting monitoring scheduler'
  );

  runScheduledMonitoring();

  schedulerTimer = setInterval(
    runScheduledMonitoring,
    SCHEDULER_INTERVAL_MS
  );
}

export function stopMonitoringScheduler() {
  if (!schedulerTimer) {
    return;
  }

  clearInterval(schedulerTimer);

  schedulerTimer = null;

  console.log(
    '[Scheduler] Monitoring scheduler stopped'
  );
}
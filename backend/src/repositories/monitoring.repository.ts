import { supabase } from '../config/supabase.js';

export interface MonitoringConfigWithDevice {
  id: string;
  device_id: string;
  method: string;
  enabled: boolean;
  interval_seconds: number;
  timeout_seconds: number;
  retries: number;
  configuration: unknown;
  device: {
    id: string;
    name: string;
    ip_address: string | null;
    status: string;
  } | null;
}

export async function findEnabledMonitoringConfigs(): Promise<
  MonitoringConfigWithDevice[]
> {
  const { data, error } = await supabase
    .from('monitoring_configs')
    .select(`
      id,
      device_id,
      method,
      enabled,
      interval_seconds,
      timeout_seconds,
      retries,
      configuration,
      device:devices (
        id,
        name,
        ip_address,
        status
      )
    `)
    .eq('enabled', true);

  if (error) {
    console.error(
      'findEnabledMonitoringConfigs error:',
      error
    );

    throw new Error(error.message);
  }

  console.log(
    'Enabled monitoring configs:',
    data?.length ?? 0
  );

  return (data ?? []).map((config: any) => {
    const deviceData = config.device;

    const device = Array.isArray(deviceData)
      ? (deviceData[0] ?? null)
      : deviceData;

    return {
      id: config.id,
      device_id: config.device_id,
      method: config.method,
      enabled: config.enabled,
      interval_seconds: config.interval_seconds,
      timeout_seconds: config.timeout_seconds,
      retries: config.retries,
      configuration: config.configuration,
      device
    };
  });
}

export async function findDueMonitoringConfigs() {
  const configs = await findEnabledMonitoringConfigs();

  const now = Date.now();

  const dueConfigs = [];

  for (const config of configs) {
    const { data: latestRecord, error } = await supabase
      .from('monitoring_records')
      .select('checked_at')
      .eq('monitoring_config_id', config.id)
      .order('checked_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    // Never checked before → immediately due
    if (!latestRecord) {
      dueConfigs.push(config);
      continue;
    }

    const lastChecked = new Date(latestRecord.checked_at).getTime();

    const elapsedSeconds =
      (now - lastChecked) / 1000;

    if (elapsedSeconds >= config.interval_seconds) {
      dueConfigs.push(config);
    }
  }

  return dueConfigs;
}

export async function updateDeviceStatus(
  deviceId: string,
  status: string,
  lastSeenAt: string | null
) {
  const { error } = await supabase
    .from('devices')
    .update({
      status,
      last_seen_at: lastSeenAt
    })
    .eq('id', deviceId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createMonitoringRecord(
  deviceId: string,
  monitoringConfigId: string,
  result: {
    status: string;
    latencyMs: number | null;
    packetLossPercent: number;
    checkedAt: string;
    message?: string;
  }
) {
  const { data, error } = await supabase
    .from('monitoring_records')
    .insert({
      device_id: deviceId,
      monitoring_config_id: monitoringConfigId,
      checked_at: result.checkedAt,
      status: result.status,
      latency_ms: result.latencyMs,
      packet_loss_percent: result.packetLossPercent,
      error_message: result.message ?? null,
      raw_data: {
        provider: 'SIMULATION',
        message: result.message ?? null
      }
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findPreviousMonitoringRecord(
  monitoringConfigId: string
) {
  const { data, error } = await supabase
    .from('monitoring_records')
    .select(`
      id,
      status,
      checked_at,
      latency_ms,
      packet_loss_percent,
      error_message
    `)
    .eq('monitoring_config_id', monitoringConfigId)
    .order('checked_at', { ascending: false })
    .limit(2);

  if (error) {
    throw new Error(error.message);
  }

  return data?.[1] ?? null;
}

export async function findMonitoringHistoryByDeviceId(
  deviceId: string
) {
  const { data, error } = await supabase
    .from('monitoring_records')
    .select(`
      id,
      device_id,
      monitoring_config_id,
      checked_at,
      status,
      latency_ms,
      packet_loss_percent,
      cpu_usage_percent,
      memory_usage_percent,
      uptime_seconds,
      error_message,
      raw_data,
      created_at
    `)
    .eq('device_id', deviceId)
    .order('checked_at', {
      ascending: false
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
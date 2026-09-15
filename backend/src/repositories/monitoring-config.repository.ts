import { supabase } from '../config/supabase.js';

export interface MonitoringConfigUpdate {
  method?: 'SIMULATION' | 'ICMP' | 'SNMP' | 'API';
  enabled?: boolean;
  interval_seconds?: number;
  timeout_seconds?: number;
  retries?: number;
  configuration?: Record<string, unknown>;
}

export async function findAllMonitoringConfigs() {
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
      created_at,
      updated_at,
      device:devices (
        id,
        name,
        hostname,
        ip_address,
        device_type,
        vendor,
        model,
        status,
        location:locations (
          id,
          name,
          area:areas (
            id,
            name,
            property:properties (
              id,
              name
            )
          )
        )
      )
    `)
    .order('created_at', {
      ascending: false
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findMonitoringConfigById(
  id: string
) {
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
      created_at,
      updated_at,
      device:devices (
        id,
        name,
        hostname,
        ip_address,
        device_type,
        vendor,
        model,
        status,
        location:locations (
          id,
          name,
          area:areas (
            id,
            name,
            property:properties (
              id,
              name
            )
          )
        )
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateMonitoringConfig(
  id: string,
  updates: MonitoringConfigUpdate
) {
  const { data, error } = await supabase
    .from('monitoring_configs')
    .update(updates)
    .eq('id', id)
    .select(`
      id,
      device_id,
      method,
      enabled,
      interval_seconds,
      timeout_seconds,
      retries,
      configuration,
      created_at,
      updated_at,
      device:devices (
        id,
        name,
        hostname,
        ip_address,
        device_type,
        vendor,
        model,
        status,
        location:locations (
          id,
          name,
          area:areas (
            id,
            name,
            property:properties (
              id,
              name
            )
          )
        )
      )
    `)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
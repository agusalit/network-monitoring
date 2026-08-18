import { supabase } from '../config/supabase.js';

export async function findAllDevices() {
  const { data, error } = await supabase
    .from('devices')
    .select(`
      id,
      name,
      hostname,
      device_type,
      vendor,
      model,
      ip_address,
      mac_address,
      status,
      description,
      enabled,
      last_seen_at,
      location:locations (
        id,
        name,
        type,
        floor_number,
        area:areas (
          id,
          name,
          type,
          property:properties (
            id,
            name
          )
        )
      )
    `)
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findDeviceById(id: string) {
  const { data, error } = await supabase
    .from('devices')
    .select(`
      id,
      name,
      hostname,
      device_type,
      vendor,
      model,
      ip_address,
      mac_address,
      status,
      description,
      enabled,
      last_seen_at,
      created_at,
      updated_at,
      location:locations (
        id,
        name,
        type,
        floor_number,
        area:areas (
          id,
          name,
          type,
          property:properties (
            id,
            name
          )
        )
      ),
      monitoring_configs (
        id,
        method,
        enabled,
        interval_seconds,
        timeout_seconds,
        retries,
        configuration
      ),
      incidents (
        id,
        severity,
        title,
        description,
        status,
        started_at,
        resolved_at,
        created_at,
        updated_at
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
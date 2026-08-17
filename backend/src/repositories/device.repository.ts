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

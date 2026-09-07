import { supabase } from '../config/supabase.js';

export async function findLocationById(
  locationId: string
) {
  const { data, error } = await supabase
    .from('locations')
    .select(`
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
    `)
    .eq('id', locationId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function findDevicesByLocationId(
  locationId: string
) {
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
      updated_at
    `)
    .eq('location_id', locationId)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
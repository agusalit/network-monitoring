import { supabase } from '../config/supabase.js';

export async function findAllRelationships() {
  const { data, error } = await supabase
    .from('device_relationships')
    .select(`
      id,
      relationship_type,
      source_device:devices!device_relationships_source_device_id_fkey (
        id,
        name,
        device_type,
        vendor,
        model,
        ip_address,
        status
      ),
      target_device:devices!device_relationships_target_device_id_fkey (
        id,
        name,
        device_type,
        vendor,
        model,
        ip_address,
        status
      )
    `)
    .order('id');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
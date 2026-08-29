import { supabase } from '../config/supabase.js';

export async function findActiveIncidentByDevice(
  deviceId: string
) {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('device_id', deviceId)
    .eq('status', 'ACTIVE')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createIncident({
  deviceId,
  severity,
  title,
  description,
  startedAt
}: {
  deviceId: string;
  severity: string;
  title: string;
  description: string | null;
  startedAt: string;
}) {
  const { data, error } = await supabase
    .from('incidents')
    .insert({
      device_id: deviceId,
      severity,
      title,
      description,
      status: 'ACTIVE',
      started_at: startedAt
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateIncident(
  incidentId: string,
  updates: {
    severity?: string;
    title?: string;
    description?: string | null;
  }
) {
  const { data, error } = await supabase
    .from('incidents')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', incidentId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function resolveIncident(
  incidentId: string,
  resolvedAt: string
) {
  const { data, error } = await supabase
    .from('incidents')
    .update({
      status: 'RESOLVED',
      resolved_at: resolvedAt,
      updated_at: resolvedAt
    })
    .eq('id', incidentId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
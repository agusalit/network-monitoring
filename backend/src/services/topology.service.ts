import { findAllRelationships } from '../repositories/topology.repository.js';

export async function getNetworkTopology() {
  const relationships = await findAllRelationships();

  return relationships;
}
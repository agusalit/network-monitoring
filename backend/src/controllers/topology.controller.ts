import { Request, Response } from 'express';

import { getNetworkTopology } from '../services/topology.service.js';

export async function getTopology(
  _req: Request,
  res: Response
) {
  try {
    const topology = await getNetworkTopology();

    res.json({
      status: 'ok',
      data: topology
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve network topology'
    });
  }
}
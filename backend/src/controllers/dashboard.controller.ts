import {
  Request,
  Response
} from 'express';

import {
  getDashboardData,
  getDashboardDevicesData,
  getActiveIncidentsData,
  getLocationHealthData
} from '../dashboard/dashboard.service.js';

export async function getDashboard(
  _req: Request,
  res: Response
) {
  try {
    const data = await getDashboardData();

    res.json({
      status: 'ok',
      data
    });
  } catch (error) {
    console.error(
      'Dashboard request failed:',
      error
    );

    res.status(500).json({
      status: 'error',
      message: 'Failed to load dashboard data'
    });
  }
}

export async function getDashboardDevices(
  _req: Request,
  res: Response
) {
  try {
    const devices =
      await getDashboardDevicesData();

    res.json({
      status: 'ok',
      data: devices
    });
  } catch (error) {
    console.error(
      'Dashboard devices request failed:',
      error
    );

    res.status(500).json({
      status: 'error',
      message: 'Failed to load dashboard devices'
    });
  }
}

export async function getActiveIncidents(
  _req: Request,
  res: Response
) {
  try {
    const incidents =
      await getActiveIncidentsData();

    res.json({
      status: 'ok',
      data: incidents
    });
  } catch (error) {
    console.error(
      'Dashboard incidents request failed:',
      error
    );

    res.status(500).json({
      status: 'error',
      message: 'Failed to load active incidents'
    });
  }
}

export async function getLocationHealth(
  _req: Request,
  res: Response
) {
  try {
    const locations =
      await getLocationHealthData();

    res.json({
      status: 'ok',
      data: locations
    });
  } catch (error) {
    console.error(
      'Dashboard location health request failed:',
      error
    );

    res.status(500).json({
      status: 'error',
      message: 'Failed to load location health'
    });
  }
}
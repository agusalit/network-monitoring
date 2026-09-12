import { Router } from 'express';

import {
  runMonitoring,
  getMonitoringHistory,
  setAP203Simulation,
  getMonitoringConfigs,
  getMonitoringConfig,
  patchMonitoringConfigController
} from '../controllers/monitoring.controller.js';

const router = Router();

router.post('/run', runMonitoring);

router.get('/devices/:id/history', getMonitoringHistory);

router.post('/simulation/ap203', setAP203Simulation);

router.get('/configs', getMonitoringConfigs);

router.get('/configs/:id', getMonitoringConfig);

router.patch('/configs/:id', patchMonitoringConfigController);

export default router;
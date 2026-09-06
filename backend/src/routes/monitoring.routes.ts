import { Router } from 'express';

import {
  runMonitoring
} from '../controllers/monitoring.controller.js';

import {
  getMonitoringHistory
} from '../controllers/monitoring.controller.js';

import {
  setAP203Simulation
} from '../controllers/monitoring.controller.js';

const router = Router();

router.post('/run', runMonitoring);

router.get('/devices/:id/history', getMonitoringHistory);

router.post('/simulation/ap203', setAP203Simulation);

export default router;
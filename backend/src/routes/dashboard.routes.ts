import { Router } from 'express';

import {
  getDashboard,
  getDashboardDevices,
  getActiveIncidents,
  getLocationHealth
} from '../controllers/dashboard.controller.js';

const router = Router();

router.get(
  '/',
  getDashboard
);

router.get(
    '/devices',
    getDashboardDevices
);

router.get(
    '/incidents',
    getActiveIncidents
);

router.get(
    '/locations',
    getLocationHealth
);

export default router;
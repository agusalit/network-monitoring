import { Router } from 'express';

import {
  getDashboard,
  getDashboardDevices,
  getActiveIncidents
} from '../controllers/dashboard.controller.js';

const router = Router();

router.get(
  '/',
  getDashboard
);

router.get(
    '/devices',
    getDashboardDevices
)

router.get(
    '/incidents',
    getActiveIncidents
)

export default router;
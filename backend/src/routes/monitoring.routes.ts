import { Router } from 'express';

import {
  runMonitoring
} from '../controllers/monitoring.controller.js';

const router = Router();

router.post('/run', runMonitoring);

export default router;
import { Router } from 'express';

import { getDevices } from '../controllers/device.controller.js';

const router = Router();

router.get('/', getDevices);

export default router;

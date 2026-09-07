import { Router } from 'express';

import {
  getLocationDetailController
} from '../controllers/location.controller.js';

const router = Router();

router.get(
  '/:id',
  getLocationDetailController
);

export default router;
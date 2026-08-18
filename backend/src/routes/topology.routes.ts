import { Router } from 'express';

import { getTopology } from '../controllers/topology.controller.js';

const router = Router();

router.get('/', getTopology);

export default router;
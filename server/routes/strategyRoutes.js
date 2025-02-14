import { Router } from 'express';
import { createStrategy, getAllStrategies } from '../controllers/Strategy.Controller.js';

const router = Router();

router.get('/strategy', getAllStrategies);

router.post('/strategy', createStrategy);

export default router;

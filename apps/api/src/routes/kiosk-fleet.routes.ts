import { Router } from 'express';
import { KioskFleetController } from '../controllers/kiosk-fleet.controller.js';

const router = Router();

router.get('/', KioskFleetController.getFleetStatus);
router.post('/telemetry', KioskFleetController.updateKioskStatus);

export default router;

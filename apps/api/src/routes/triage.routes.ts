import { Router } from 'express';
import { TriageController } from '../controllers/triage.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles('NURSE', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN'));

router.post('/vitals', TriageController.recordVitals);
router.get('/vitals/:tokenId', TriageController.getVitalsByToken);

export default router;

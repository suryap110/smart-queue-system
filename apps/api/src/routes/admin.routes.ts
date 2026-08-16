import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles('ADMIN', 'SUPER_ADMIN', 'HOD'));

router.get('/metrics', AdminController.getMetrics);
router.get('/audit-logs', AdminController.getAuditLogs);
router.post('/surge-mode', AdminController.toggleSurgeMode);
router.get('/staff', AdminController.getStaff);

export default router;

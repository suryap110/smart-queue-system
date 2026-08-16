import { Router } from 'express';
import { QueueController } from '../controllers/queue.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/department/:departmentId', QueueController.getDepartmentQueue);
router.post('/call-next', authenticateJWT, authorizeRoles('DOCTOR', 'NURSE', 'STAFF', 'ADMIN', 'SUPER_ADMIN'), QueueController.callNext);
router.post('/in-service', authenticateJWT, authorizeRoles('DOCTOR', 'NURSE', 'STAFF', 'ADMIN', 'SUPER_ADMIN'), QueueController.markInService);
router.post('/complete', authenticateJWT, authorizeRoles('DOCTOR', 'NURSE', 'STAFF', 'ADMIN', 'SUPER_ADMIN'), QueueController.complete);
router.post('/no-show', authenticateJWT, authorizeRoles('DOCTOR', 'NURSE', 'STAFF', 'ADMIN', 'SUPER_ADMIN'), QueueController.markNoShow);
router.post('/transfer', authenticateJWT, authorizeRoles('DOCTOR', 'NURSE', 'STAFF', 'ADMIN', 'SUPER_ADMIN'), QueueController.transfer);
router.post('/feedback', QueueController.submitFeedback);

export default router;

import { Router } from 'express';
import { KioskController } from '../controllers/kiosk.controller.js';

const router = Router();

router.get('/branches', KioskController.getBranches);
router.get('/departments/:branchId', KioskController.getDepartments);
router.post('/issue-token', KioskController.issueToken);
router.get('/track/:codeOrId', KioskController.trackToken);

export default router;

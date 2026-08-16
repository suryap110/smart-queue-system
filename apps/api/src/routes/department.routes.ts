import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', DepartmentController.listDepartments);

router.use(authenticateJWT);
router.use(authorizeRoles('ADMIN', 'SUPER_ADMIN', 'HOD'));

router.post('/', DepartmentController.createDepartment);
router.post('/counters', DepartmentController.createCounter);
router.patch('/counters/:counterId/availability', DepartmentController.toggleCounterAvailability);

export default router;

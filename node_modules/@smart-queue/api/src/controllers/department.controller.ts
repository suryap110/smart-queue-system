import { Request, Response } from 'express';
import { prisma } from '../services/prisma.js';
import { AuditService } from '../services/audit.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { z } from 'zod';

const createDepartmentSchema = z.object({
  branchId: z.string(),
  name: z.string().min(2),
  code: z.string().min(2),
  type: z.string().optional()
});

const createCounterSchema = z.object({
  departmentId: z.string(),
  number: z.number(),
  name: z.string().min(2),
  roomNumber: z.string().optional(),
  doctorName: z.string().optional()
});

export class DepartmentController {
  public static async listDepartments(req: Request, res: Response) {
    const departments = await prisma.department.findMany({
      include: {
        services: true,
        counters: true,
        branch: { select: { id: true, name: true } }
      }
    });

    return res.json({ success: true, data: departments });
  }

  public static async createDepartment(req: AuthenticatedRequest, res: Response) {
    const parsed = createDepartmentSchema.parse(req.body);

    const department = await prisma.department.create({
      data: {
        branchId: parsed.branchId,
        name: parsed.name,
        code: parsed.code.toUpperCase(),
        type: parsed.type || 'OPD_CONSULTATION'
      }
    });

    await AuditService.logAction(
      req.user!.id,
      'CREATE_DEPARTMENT',
      `Created clinical department ${department.name} (${department.code})`
    );

    return res.status(201).json({ success: true, data: department });
  }

  public static async createCounter(req: AuthenticatedRequest, res: Response) {
    const parsed = createCounterSchema.parse(req.body);

    const counter = await prisma.counter.create({
      data: {
        departmentId: parsed.departmentId,
        number: parsed.number,
        name: parsed.name,
        roomNumber: parsed.roomNumber,
        doctorName: parsed.doctorName,
        isAvailable: true
      }
    });

    await AuditService.logAction(
      req.user!.id,
      'CREATE_COUNTER',
      `Created OPD Counter/Room ${counter.name} in department ${parsed.departmentId}`
    );

    return res.status(201).json({ success: true, data: counter });
  }

  public static async toggleCounterAvailability(req: AuthenticatedRequest, res: Response) {
    const { counterId } = req.params;
    const { isAvailable } = req.body;

    const counter = await prisma.counter.update({
      where: { id: counterId },
      data: { isAvailable: Boolean(isAvailable) }
    });

    await AuditService.logAction(
      req.user!.id,
      'TOGGLE_COUNTER_STATUS',
      `Toggled counter ${counter.name} availability to ${isAvailable}`
    );

    return res.json({ success: true, data: counter });
  }
}

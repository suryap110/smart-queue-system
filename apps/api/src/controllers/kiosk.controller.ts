import { Request, Response } from 'express';
import { prisma } from '../services/prisma.js';
import { QueueService } from '../services/queue.service.js';
import { z } from 'zod';

const issueTokenSchema = z.object({
  patientName: z.string().min(2),
  patientPhone: z.string().min(8),
  abhaId: z.string().optional(),
  healthSchemeNo: z.string().optional(),
  serviceId: z.string(),
  departmentId: z.string(),
  branchId: z.string(),
  priorityType: z.string().optional(),
  triageLevel: z.string().optional()
});

export class KioskController {
  public static async getBranches(req: Request, res: Response) {
    const branches = await prisma.branch.findMany({
      include: { organization: true }
    });
    return res.json({ success: true, data: branches });
  }

  public static async getDepartments(req: Request, res: Response) {
    const { branchId } = req.params;
    const departments = await prisma.department.findMany({
      where: { branchId },
      include: { services: true }
    });
    return res.json({ success: true, data: departments });
  }

  public static async issueToken(req: Request, res: Response) {
    const parsed = issueTokenSchema.parse(req.body);
    const result = await QueueService.issueToken(parsed);
    return res.status(201).json({ success: true, data: result });
  }

  public static async trackToken(req: Request, res: Response) {
    const { codeOrId } = req.params;

    const token = await prisma.token.findFirst({
      where: {
        OR: [
          { id: codeOrId },
          { displayCode: codeOrId.toUpperCase() }
        ]
      },
      include: {
        service: true,
        department: true,
        counter: true,
        transfers: {
          include: { fromDepartment: true, toDepartment: true }
        }
      }
    });

    if (!token) {
      return res.status(404).json({ success: false, error: 'Token not found.' });
    }

    // Count people ahead in the same department/service with higher priority score or joined earlier
    const peopleAhead = await prisma.token.count({
      where: {
        departmentId: token.departmentId,
        status: { in: ['WAITING', 'TRIAGED'] },
        OR: [
          { priorityScore: { gt: token.priorityScore } },
          {
            AND: [
              { priorityScore: token.priorityScore },
              { joinedAt: { lt: token.joinedAt } }
            ]
          }
        ]
      }
    });

    return res.json({
      success: true,
      data: {
        token,
        peopleAhead: token.status === 'WAITING' || token.status === 'TRIAGED' ? peopleAhead : 0
      }
    });
  }
}

import { prisma } from './prisma.js';
import { logger } from '../utils/logger.js';

export class AuditService {
  public static async logAction(actorId: string, action: string, details: string): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          actorId,
          action,
          details
        }
      });
      logger.info(`[AUDIT LOG] Actor: ${actorId} | Action: ${action} | ${details}`);
    } catch (err: any) {
      logger.error(`Failed to record audit log: ${err.message}`);
    }
  }
}

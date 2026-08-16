import { prisma } from './prisma.js';
import { AIService } from './ai.service.js';
import { NotificationService } from './notification.service.js';
import { logger } from '../utils/logger.js';

export class QueueService {
  /**
   * Helper to calculate Priority Base Weight
   */
  private static getPriorityWeight(priorityType: string, triageLevel: string): number {
    if (triageLevel === 'RED_IMMEDIATE' || priorityType === 'EMERGENCY') return 100.0;
    if (priorityType === 'SENIOR_CITIZEN' || priorityType === 'DIFFERENTLY_ABLED') return 15.0;
    if (priorityType === 'PREGNANT') return 12.0;
    if (priorityType === 'PRE_BOOKED') return 8.0;
    return 1.0; // NORMAL
  }

  /**
   * Issue a new token at Kiosk or online
   */
  public static async issueToken(data: {
    patientName: string;
    patientPhone: string;
    abhaId?: string;
    healthSchemeNo?: string;
    serviceId: string;
    departmentId: string;
    branchId: string;
    priorityType?: string;
    triageLevel?: string;
  }) {
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { department: true }
    });

    if (!service) {
      throw new Error('Service not found');
    }

    // Get current token count for today to assign tokenNumber
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const countToday = await prisma.token.count({
      where: {
        serviceId: data.serviceId,
        createdAt: { gte: startOfDay }
      }
    });

    const nextNumber = countToday + 1;
    const padded = nextNumber.toString().padStart(3, '0');
    const displayCode = `${service.prefix}-${padded}`;

    const priorityType = data.priorityType || 'NORMAL';
    const triageLevel = data.triageLevel || 'GREEN_ROUTINE';
    const baseWeight = this.getPriorityWeight(priorityType, triageLevel);

    // Calculate queue state
    const waitingTokensCount = await prisma.token.count({
      where: {
        departmentId: data.departmentId,
        status: { in: ['WAITING', 'TRIAGED'] }
      }
    });

    const activeCountersCount = await prisma.counter.count({
      where: {
        departmentId: data.departmentId,
        isAvailable: true
      }
    });

    const now = new Date();
    const estWait = await AIService.predictWaitTime({
      queueLength: waitingTokensCount,
      activeCounters: activeCountersCount,
      avgServiceTime: service.avgServiceTimeMinutes,
      priorityType,
      hourOfDay: now.getHours(),
      dayOfWeek: now.getDay()
    });

    const token = await prisma.token.create({
      data: {
        tokenNumber: nextNumber,
        displayCode,
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        abhaId: data.abhaId,
        healthSchemeNo: data.healthSchemeNo,
        serviceId: data.serviceId,
        departmentId: data.departmentId,
        branchId: data.branchId,
        priorityType: priorityType as any,
        triageLevel: triageLevel as any,
        priorityScore: baseWeight,
        estimatedWaitMinutes: estWait,
        predictedWaitMinutes: estWait,
        status: 'WAITING'
      },
      include: {
        service: true,
        department: true
      }
    });

    logger.info(`Issued new token: ${token.displayCode} for ${data.patientName}`);
    return { token, waitingAhead: waitingTokensCount };
  }

  /**
   * Recalculate Fair Aging Priority Scores
   * priorityScore = baseWeight + (minutesWaiting * 0.5)
   */
  public static async updateFairAgingScores(departmentId: string) {
    const waitingTokens = await prisma.token.findMany({
      where: {
        departmentId,
        status: { in: ['WAITING', 'TRIAGED'] }
      }
    });

    const now = new Date().getTime();

    for (const t of waitingTokens) {
      const minutesWaiting = (now - new Date(t.joinedAt).getTime()) / (1000 * 60);
      const baseWeight = this.getPriorityWeight(t.priorityType, t.triageLevel);
      const updatedScore = baseWeight + (minutesWaiting * 0.5);

      await prisma.token.update({
        where: { id: t.id },
        data: { priorityScore: updatedScore }
      });
    }
  }

  /**
   * Call the next highest priority token for a counter
   */
  public static async callNextToken(counterId: string, staffUserId: string) {
    const counter = await prisma.counter.findUnique({
      where: { id: counterId },
      include: { department: true }
    });

    if (!counter) throw new Error('Counter not found');

    // Update priority scores to be accurate
    await this.updateFairAgingScores(counter.departmentId);

    // Find highest priority score token waiting in department
    const nextToken = await prisma.token.findFirst({
      where: {
        departmentId: counter.departmentId,
        status: { in: ['WAITING', 'TRIAGED'] }
      },
      orderBy: [
        { priorityScore: 'desc' },
        { joinedAt: 'asc' }
      ]
    });

    if (!nextToken) {
      return null;
    }

    const updatedToken = await prisma.token.update({
      where: { id: nextToken.id },
      data: {
        status: 'CALLED',
        counterId: counter.id,
        calledAt: new Date()
      },
      include: {
        service: true,
        department: true,
        counter: true
      }
    });

    // Notify patient
    NotificationService.sendTokenCalledAlert(
      updatedToken.id,
      updatedToken.patientPhone,
      updatedToken.displayCode,
      counter.name || `Counter ${counter.number}`
    );

    return updatedToken;
  }

  /**
   * Transfer a token to another department (e.g., OPD Doctor -> Diagnostics / Pharmacy)
   */
  public static async transferToken(data: {
    tokenId: string;
    toDepartmentId: string;
    staffUserId: string;
    reason?: string;
  }) {
    const token = await prisma.token.findUnique({ where: { id: data.tokenId } });
    if (!token) throw new Error('Token not found');

    const targetDept = await prisma.department.findUnique({
      where: { id: data.toDepartmentId },
      include: { services: true }
    });

    if (!targetDept || targetDept.services.length === 0) {
      throw new Error('Target department has no active service');
    }

    // Default to first service in target department
    const targetService = targetDept.services[0];

    // Log Transfer History
    await prisma.tokenTransferHistory.create({
      data: {
        tokenId: token.id,
        fromDepartmentId: token.departmentId,
        toDepartmentId: data.toDepartmentId,
        transferredByStaffId: data.staffUserId,
        reason: data.reason
      }
    });

    const updated = await prisma.token.update({
      where: { id: token.id },
      data: {
        departmentId: data.toDepartmentId,
        serviceId: targetService.id,
        status: 'TRANSFERRED',
        counterId: null,
        calledAt: null,
        inServiceAt: null
      },
      include: {
        service: true,
        department: true
      }
    });

    logger.info(`Transferred token ${token.displayCode} to department ${targetDept.name}`);
    return updated;
  }

  /**
   * Complete token service & log history for ML training
   */
  public static async completeToken(tokenId: string, counterId: string) {
    const token = await prisma.token.findUnique({
      where: { id: tokenId }
    });
    if (!token) throw new Error('Token not found');

    const now = new Date();
    const updated = await prisma.token.update({
      where: { id: tokenId },
      data: {
        status: 'COMPLETED',
        completedAt: now
      }
    });

    // Record in QueueHistory for AI Model training
    const joinedAt = new Date(token.joinedAt);
    const startServiceAt = token.inServiceAt ? new Date(token.inServiceAt) : now;
    const waitSeconds = Math.round((startServiceAt.getTime() - joinedAt.getTime()) / 1000);
    const serviceSeconds = Math.round((now.getTime() - startServiceAt.getTime()) / 1000);

    await prisma.queueHistory.create({
      data: {
        tokenId: token.id,
        serviceId: token.serviceId,
        departmentId: token.departmentId,
        branchId: token.branchId,
        counterId: counterId,
        priorityType: token.priorityType,
        joinedAt: joinedAt,
        startServiceAt: startServiceAt,
        endServiceAt: now,
        waitDurationSeconds: Math.max(0, waitSeconds),
        serviceDurationSeconds: Math.max(0, serviceSeconds),
        queueLengthAtArrival: 5,
        activeCountersCount: 2,
        hourOfDay: joinedAt.getHours(),
        dayOfWeek: joinedAt.getDay()
      }
    });

    return updated;
  }
}

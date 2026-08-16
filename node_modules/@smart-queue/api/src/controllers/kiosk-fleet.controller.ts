import { Request, Response } from 'express';
import { prisma } from '../services/prisma.js';

export class KioskFleetController {
  public static async getFleetStatus(req: Request, res: Response) {
    const kiosks = await prisma.kioskTerminal.findMany({
      include: { branch: { select: { id: true, name: true } } }
    });

    return res.json({ success: true, data: kiosks });
  }

  public static async updateKioskStatus(req: Request, res: Response) {
    const { terminalCode, paperRollPercent, status } = req.body;

    const kiosk = await prisma.kioskTerminal.upsert({
      where: { terminalCode },
      update: {
        paperRollPercent: Number(paperRollPercent),
        status: status || (paperRollPercent < 10 ? 'LOW_PAPER' : 'ONLINE'),
        lastHeartbeatAt: new Date()
      },
      create: {
        branchId: req.body.branchId || 'default-branch-id',
        terminalCode,
        location: req.body.location || 'Hospital Gate A Entrance',
        paperRollPercent: Number(paperRollPercent) || 100,
        status: status || 'ONLINE'
      }
    });

    return res.json({ success: true, data: kiosk });
  }
}

import { prisma } from './prisma.js';
import { logger } from '../utils/logger.js';

export class NotificationService {
  public static async sendTokenApproachingAlert(
    tokenId: string,
    phone: string,
    displayCode: string,
    counterName: string,
    peopleAhead: number
  ): Promise<void> {
    const title = `Token ${displayCode} Approaching!`;
    const message = `Dear Citizen, your token ${displayCode} is almost up (${peopleAhead} person(s) ahead). Please proceed towards ${counterName}.`;

    logger.info(`[SMS MOCK SENT] To: ${phone} | ${message}`);

    await prisma.notification.create({
      data: {
        tokenId,
        channel: 'SMS',
        recipient: phone,
        title,
        message,
        status: 'SENT',
        sentAt: new Date()
      }
    });
  }

  public static async sendTokenCalledAlert(
    tokenId: string,
    phone: string,
    displayCode: string,
    roomOrCounter: string
  ): Promise<void> {
    const title = `Token ${displayCode} Called!`;
    const message = `ATTENTION: Token ${displayCode} is now called to ${roomOrCounter}. Please report immediately.`;

    logger.info(`[SMS MOCK SENT] To: ${phone} | ${message}`);

    await prisma.notification.create({
      data: {
        tokenId,
        channel: 'SMS',
        recipient: phone,
        title,
        message,
        status: 'SENT',
        sentAt: new Date()
      }
    });
  }
}

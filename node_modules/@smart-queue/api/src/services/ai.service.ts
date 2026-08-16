import axios from 'axios';
import { logger } from '../utils/logger.js';

interface PredictParams {
  queueLength: number;
  activeCounters: number;
  avgServiceTime: number;
  priorityType: string;
  hourOfDay: number;
  dayOfWeek: number;
}

export class AIService {
  private static aiServerUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  public static async predictWaitTime(params: PredictParams): Promise<number> {
    try {
      const response = await axios.post(`${this.aiServerUrl}/predict`, params, {
        timeout: 1500
      });
      if (response.data && typeof response.data.predictedWaitMinutes === 'number') {
        return Math.max(1, Math.round(response.data.predictedWaitMinutes));
      }
    } catch (error: any) {
      logger.warn(`AI Microservice unavailable or timed out. Falling back to formula engine: ${error.message}`);
    }

    // Fallback formula: (peopleAhead * avgServiceTime) / max(1, activeCounters)
    const effectiveCounters = Math.max(1, params.activeCounters);
    let rawWait = (params.queueLength * params.avgServiceTime) / effectiveCounters;

    // Apply priority reduction multiplier
    if (params.priorityType === 'EMERGENCY') {
      rawWait = Math.min(2, rawWait * 0.1);
    } else if (params.priorityType === 'SENIOR_CITIZEN' || params.priorityType === 'DIFFERENTLY_ABLED') {
      rawWait = rawWait * 0.5;
    }

    return Math.max(1, Math.round(rawWait));
  }
}

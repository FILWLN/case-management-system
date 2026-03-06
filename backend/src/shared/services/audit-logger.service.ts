import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditLogger {
  private readonly logger = new Logger(AuditLogger.name);

  logAction(action: string, entity: string, entityId: number, userId?: number, details?: any) {
    this.logger.log({
      timestamp: new Date().toISOString(),
      action,
      entity,
      entityId,
      userId,
      details,
    });
  }

  logError(action: string, error: Error, entity?: string, entityId?: number) {
    this.logger.error({
      timestamp: new Date().toISOString(),
      action,
      entity,
      entityId,
      error: error.message,
      stack: error.stack,
    });
  }
}

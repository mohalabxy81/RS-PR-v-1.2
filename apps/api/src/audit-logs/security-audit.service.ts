import { Injectable, Logger } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';

export enum SecurityEvent {
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  API_KEY_CREATED = 'API_KEY_CREATED',
  API_KEY_ROTATED = 'API_KEY_ROTATED',
  API_KEY_REVOKED = 'API_KEY_REVOKED',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY'
}

@Injectable()
export class SecurityAuditService {
  private readonly logger = new Logger(SecurityAuditService.name);

  constructor(private readonly auditLogsService: AuditLogsService) {}

  async logSecurityEvent(
    tenantId: string,
    event: SecurityEvent,
    entityId: string,
    metadata: {
      ipAddress?: string;
      userAgent?: string;
      userId?: string;
      reason?: string;
      severity?: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    }
  ) {
    this.logger.log(`[Security Event] ${event} - Tenant: ${tenantId} - Entity: ${entityId}`);
    
    // Use fixed schema structure for security metadata
    const sanitizedMetadata = {
      ipAddress: metadata.ipAddress || 'unknown',
      userAgent: metadata.userAgent || 'unknown',
      severity: metadata.severity || 'INFO',
      reason: metadata.reason,
      timestamp: new Date().toISOString()
    };

    return this.auditLogsService.createLog({
      tenantId,
      userId: metadata.userId,
      action: event,
      entity: 'SECURITY',
      entityId,
      after: sanitizedMetadata, // Store as structured JSON to prevent arbitrary injection
    });
  }
}

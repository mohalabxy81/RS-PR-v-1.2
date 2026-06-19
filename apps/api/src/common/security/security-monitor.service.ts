import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { SecurityAuditService, SecurityEvent } from '../../audit-logs/security-audit.service';

@Injectable()
export class SecurityMonitorService {
  private readonly logger = new Logger(SecurityMonitorService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly auditLogs: SecurityAuditService,
  ) {}

  async recordFailedLogin(ipAddress: string) {
    const key = `sec:failed_login:ip:${ipAddress}`;
    let count: number = (await this.cacheManager.get<number>(key)) || 0;
    count += 1;
    await this.cacheManager.set(key, count, 900000); // 15 mins

    if (count === 10) { // Log exactly once at threshold to avoid spam
      this.logger.warn(`BRUTE FORCE DETECTED: 10+ failed logins from IP ${ipAddress}`);
      await this.auditLogs.logSecurityEvent('SYSTEM', SecurityEvent.SUSPICIOUS_ACTIVITY, ipAddress, {
        ipAddress,
        reason: 'Brute force login detected from IP',
        severity: 'CRITICAL'
      });
      // Further action could be auto-blocking the IP in a global WAF or Redis blocklist
    }
  }

  async recordInvalidToken(ipAddress: string) {
    const key = `sec:invalid_token:ip:${ipAddress}`;
    let count: number = (await this.cacheManager.get<number>(key)) || 0;
    count += 1;
    await this.cacheManager.set(key, count, 300000); // 5 mins

    if (count === 50) {
      this.logger.warn(`TOKEN SPIKE DETECTED: 50+ invalid tokens from IP ${ipAddress}`);
      await this.auditLogs.logSecurityEvent('SYSTEM', SecurityEvent.SUSPICIOUS_ACTIVITY, ipAddress, {
        ipAddress,
        reason: 'Invalid token spike detected from IP',
        severity: 'HIGH'
      });
    }
  }

  async recordInvalidApiKey(ipAddress: string) {
    const key = `sec:invalid_apikey:ip:${ipAddress}`;
    let count: number = (await this.cacheManager.get<number>(key)) || 0;
    count += 1;
    await this.cacheManager.set(key, count, 300000); // 5 mins

    if (count === 20) {
      this.logger.warn(`INVALID API KEY SPIKE: 20+ invalid key attempts from IP ${ipAddress}`);
      await this.auditLogs.logSecurityEvent('SYSTEM', SecurityEvent.SUSPICIOUS_ACTIVITY, ipAddress, {
        ipAddress,
        reason: 'Invalid API key attempt spike from IP',
        severity: 'HIGH'
      });
    }
  }
}

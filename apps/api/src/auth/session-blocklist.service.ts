import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

/**
 * SessionBlocklistService — Redis-backed access token revocation.
 *
 * Problem: JWT access tokens are stateless and cannot be invalidated before expiry.
 * Solution: On logout, store the sessionId in Redis with TTL matching the token's
 * remaining lifetime. The JwtStrategy validate() hook checks this blocklist on
 * every request.
 *
 * Security model:
 * - Each access token carries a `sessionId` claim (UUID v4).
 * - On logout, that sessionId is written to Redis with TTL = remaining token seconds.
 * - Redis auto-expires the entry — no cleanup required.
 * - O(1) lookup cost per request.
 */
@Injectable()
export class SessionBlocklistService {
  private readonly logger = new Logger(SessionBlocklistService.name);
  private readonly PREFIX = 'session_blocked:';

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  /**
   * Block a session until its access token naturally expires.
   * @param sessionId  The `sessionId` claim from the access token
   * @param ttlSeconds Remaining lifetime of the access token in seconds
   */
  async blockSession(sessionId: string, ttlSeconds: number): Promise<void> {
    if (!sessionId || ttlSeconds <= 0) return;
    const key = `${this.PREFIX}${sessionId}`;
    // TTL in milliseconds for cache-manager
    await this.cache.set(key, '1', ttlSeconds * 1000);
    this.logger.debug(`Session ${sessionId} added to blocklist (TTL ${ttlSeconds}s)`);
  }

  /**
   * Check whether a session has been revoked.
   * @returns true if the session is blocked (access should be denied)
   */
  async isBlocked(sessionId: string): Promise<boolean> {
    if (!sessionId) return false;
    const key = `${this.PREFIX}${sessionId}`;
    const value = await this.cache.get<string>(key);
    return value === '1';
  }

  /**
   * Block all sessions for a user (logout-all scenario).
   * Used when all sessions are revoked (password change, logout-all, account suspension).
   * Stores a user-level block with TTL = max access token lifetime (15 minutes default).
   *
   * NOTE: This stores a user-level block, not per-session. The JwtStrategy must also
   * check `isUserBlocked()` to enforce this.
   */
  async blockAllUserSessions(userId: string, maxTtlSeconds: number = 900): Promise<void> {
    const key = `${this.PREFIX}user:${userId}`;
    await this.cache.set(key, '1', maxTtlSeconds * 1000);
    this.logger.warn(`All sessions for user ${userId} blocked (TTL ${maxTtlSeconds}s)`);
  }

  /**
   * Check if all sessions for a user are blocked.
   */
  async isUserBlocked(userId: string): Promise<boolean> {
    const key = `${this.PREFIX}user:${userId}`;
    const value = await this.cache.get<string>(key);
    return value === '1';
  }
}

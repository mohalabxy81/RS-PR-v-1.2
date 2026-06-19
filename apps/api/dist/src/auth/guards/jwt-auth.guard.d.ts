import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SecurityMonitorService } from '../../common/security/security-monitor.service';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private reflector;
    private readonly securityMonitor;
    constructor(reflector: Reflector, securityMonitor: SecurityMonitorService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext): TUser;
}
export {};

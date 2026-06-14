import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: {
        sub: string;
        email: string;
        tenantId: string;
        roleId?: string;
        roleName?: string;
        iat: number;
        exp: number;
    }): Promise<CurrentUserPayload>;
}
export {};

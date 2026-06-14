export interface CurrentUserPayload {
    userId: string;
    email: string;
    tenantId: string;
    roleId?: string;
    roleName?: string;
}
export declare const CurrentUser: (...dataOrPipes: (keyof CurrentUserPayload | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;

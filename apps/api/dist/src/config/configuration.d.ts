export declare const appConfig: (() => {
    nodeEnv: string;
    port: number;
    allowedOrigins: string[];
    appUrl: string;
    apiUrl: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    port: number;
    allowedOrigins: string[];
    appUrl: string;
    apiUrl: string;
}>;
export declare const jwtConfig: (() => {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
}>;
export declare const databaseConfig: (() => {
    url: string | undefined;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    url: string | undefined;
}>;
export declare const redisConfig: (() => {
    host: string;
    port: number;
    password: string | undefined;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    port: number;
    password: string | undefined;
}>;
export declare const s3Config: (() => {
    endpoint: string | undefined;
    accessKeyId: string | undefined;
    secretAccessKey: string | undefined;
    bucketName: string;
    region: string;
    usePathStyle: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    endpoint: string | undefined;
    accessKeyId: string | undefined;
    secretAccessKey: string | undefined;
    bucketName: string;
    region: string;
    usePathStyle: boolean;
}>;
export declare const smtpConfig: (() => {
    host: string;
    port: number;
    secure: boolean;
    user: string | undefined;
    pass: string | undefined;
    from: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    port: number;
    secure: boolean;
    user: string | undefined;
    pass: string | undefined;
    from: string;
}>;
export declare const throttleConfig: (() => {
    ttl: number;
    limit: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    ttl: number;
    limit: number;
}>;
export declare const uploadConfig: (() => {
    maxFileSizeMb: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    maxFileSizeMb: number;
}>;

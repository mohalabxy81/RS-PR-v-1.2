"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadConfig = exports.throttleConfig = exports.smtpConfig = exports.s3Config = exports.redisConfig = exports.databaseConfig = exports.jwtConfig = exports.appConfig = void 0;
const config_1 = require("@nestjs/config");
exports.appConfig = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL || 'http://localhost:3001',
}));
exports.jwtConfig = (0, config_1.registerAs)('jwt', () => {
    const accessSecret = getSecret('JWT_SECRET', 'JWT access secret');
    const refreshSecret = getSecret('JWT_REFRESH_SECRET', 'JWT refresh secret');
    return {
        accessSecret,
        refreshSecret,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    };
});
exports.databaseConfig = (0, config_1.registerAs)('database', () => ({
    url: process.env.DATABASE_URL,
}));
exports.redisConfig = (0, config_1.registerAs)('redis', () => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
}));
exports.s3Config = (0, config_1.registerAs)('s3', () => ({
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET_NAME || 'reis-uploads',
    region: process.env.S3_REGION || 'us-east-1',
    usePathStyle: process.env.S3_USE_PATH_STYLE === 'true',
}));
exports.smtpConfig = (0, config_1.registerAs)('smtp', () => ({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'noreply@reis-platform.com',
}));
exports.throttleConfig = (0, config_1.registerAs)('throttle', () => ({
    ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '60', 10),
}));
exports.uploadConfig = (0, config_1.registerAs)('upload', () => ({
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
}));
function getSecret(envVar, label) {
    if (process.env[envVar]) {
        return process.env[envVar];
    }
    const crypto = require('crypto');
    const ephemeral = crypto.randomBytes(64).toString('hex');
    console.error(`\n⚠️  SECURITY WARNING: ${label} (${envVar}) is not set. ` +
        `Generating an ephemeral secret — THIS IS INSTANCE-ISOLATED AND NOT SUITABLE FOR PRODUCTION. ` +
        `Set ${envVar} in your .env file.\n`);
    return ephemeral;
}
//# sourceMappingURL=configuration.js.map
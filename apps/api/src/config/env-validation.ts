import { Logger } from '@nestjs/common';

export function validateEnvironmentVariables() {
  const logger = new Logger('EnvValidation');
  
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'ENCRYPTION_KEY',
    'REDIS_URL',
  ];

  const missing = requiredVars.filter((env) => !process.env[env]);
  if (missing.length > 0) {
    const msg = `CRITICAL: Missing required environment variables: ${missing.join(', ')}`;
    logger.error(msg);
    throw new Error(msg);
  }
}

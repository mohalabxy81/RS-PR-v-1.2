import { Logger } from '@nestjs/common';

export function validateEnvironmentVariables() {
  const logger = new Logger('EnvValidation');
  
  if (process.env.NODE_ENV === 'production') {
    const requiredProdVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'ENCRYPTION_KEY',
      'REDIS_URL',
    ];

    const missing = requiredProdVars.filter((env) => !process.env[env]);
    if (missing.length > 0) {
      const msg = `CRITICAL: Missing required production environment variables: ${missing.join(', ')}`;
      logger.error(msg);
      throw new Error(msg);
    }
  } else {
    logger.log('Running in development mode with relaxed environment validation.');
  }
}

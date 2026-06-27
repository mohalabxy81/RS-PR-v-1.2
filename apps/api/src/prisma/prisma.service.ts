import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getTenantId } from '../common/context/tenant-context';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public readonly extended: any;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });

    this.extended = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const globalModels = [
              'Tenant', 'User', 'Role', 'Permission', 'RolePermission',
              'AiProvider', 'AiModel', 'PlatformApp', 'PlatformAppVersion',
              'ApiProduct', 'ApiPlan', 'DeveloperAccount', 'DeveloperOrganization'
            ];
            
            if (globalModels.includes(model)) {
              return query(args);
            }

            const tenantId = getTenantId();
            const op = operation as string;
            const anyArgs = args as any;
            
            if (tenantId) {
              if (op === 'findUnique' || op === 'findFirst' || op === 'findMany' || op === 'count') {
                anyArgs.where = { ...anyArgs.where, tenantId };
              } else if (op === 'update' || op === 'updateMany' || op === 'delete' || op === 'deleteMany') {
                anyArgs.where = { ...anyArgs.where, tenantId };
              } else if (op === 'create') {
                anyArgs.data = { ...anyArgs.data, tenantId };
              } else if (op === 'createMany') {
                if (Array.isArray(anyArgs.data)) {
                  anyArgs.data = anyArgs.data.map((d: any) => ({ ...d, tenantId }));
                } else {
                  anyArgs.data = { ...anyArgs.data, tenantId };
                }
              }
            }

            return query(anyArgs);
          },
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

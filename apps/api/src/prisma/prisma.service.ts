import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getTenantId } from '../common/context/tenant-context';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public readonly extended: any;

  constructor() {
    super({
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
            
            if (tenantId) {
              if (operation === 'findUnique' || operation === 'findFirst' || operation === 'findMany' || operation === 'count') {
                args.where = { ...args.where, tenantId };
              } else if (operation === 'update' || operation === 'updateMany' || operation === 'delete' || operation === 'deleteMany') {
                args.where = { ...args.where, tenantId };
              } else if (operation === 'create') {
                args.data = { ...args.data, tenantId };
              } else if (operation === 'createMany') {
                if (Array.isArray(args.data)) {
                  args.data = args.data.map(d => ({ ...d, tenantId }));
                } else {
                  args.data = { ...args.data, tenantId };
                }
              }
            }

            return query(args);
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

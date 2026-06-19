"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const tenant_context_1 = require("../common/context/tenant-context");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    extended;
    constructor() {
        super({
            log: process.env.NODE_ENV === 'development'
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
                        const tenantId = (0, tenant_context_1.getTenantId)();
                        if (tenantId) {
                            if (operation === 'findUnique' || operation === 'findFirst' || operation === 'findMany' || operation === 'count') {
                                args.where = { ...args.where, tenantId };
                            }
                            else if (operation === 'update' || operation === 'updateMany' || operation === 'delete' || operation === 'deleteMany') {
                                args.where = { ...args.where, tenantId };
                            }
                            else if (operation === 'create') {
                                args.data = { ...args.data, tenantId };
                            }
                            else if (operation === 'createMany') {
                                if (Array.isArray(args.data)) {
                                    args.data = args.data.map(d => ({ ...d, tenantId }));
                                }
                                else {
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map
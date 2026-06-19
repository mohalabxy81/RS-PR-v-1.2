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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const deals_service_1 = require("./deals.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../roles/guards/permissions.guard");
const require_permissions_decorator_1 = require("../common/decorators/require-permissions.decorator");
const permissions_constants_1 = require("../roles/permissions.constants");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const deal_dto_1 = require("./dto/deal.dto");
let DealsController = class DealsController {
    dealsService;
    constructor(dealsService) {
        this.dealsService = dealsService;
    }
    async create(user, dto) {
        return this.dealsService.create(user.tenantId, user.userId, dto);
    }
    async findAll(user, query) {
        return this.dealsService.findAll(user.tenantId, query);
    }
    async findOne(user, id) {
        return this.dealsService.findOne(user.tenantId, id);
    }
    async update(user, id, dto) {
        return this.dealsService.update(user.tenantId, id, dto, user.userId);
    }
    async updateStage(user, id, dto) {
        return this.dealsService.updateStage(user.tenantId, id, user.userId, dto.stage);
    }
    async addNote(user, id, dto) {
        return this.dealsService.addNote(user.tenantId, id, user.userId, dto.content);
    }
};
exports.DealsController = DealsController;
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('create:deals'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new deal' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.CREATE_DEAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, deal_dto_1.CreateDealDto]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "create", null);
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('read:deals'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all deals (useful for Kanban board)' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.READ_DEAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, deal_dto_1.QueryDealDto]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "findAll", null);
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('read:deals'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deal details' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.READ_DEAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "findOne", null);
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('update:deals'),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a deal' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.UPDATE_DEAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, deal_dto_1.UpdateDealDto]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "update", null);
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('update:deals'),
    (0, common_1.Put)(':id/stage'),
    (0, swagger_1.ApiOperation)({ summary: 'Change deal stage (records history)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.UPDATE_DEAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, deal_dto_1.UpdateDealStageDto]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "updateStage", null);
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('create:deals'),
    (0, common_1.Post)(':id/notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a note to a deal' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.UPDATE_DEAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, deal_dto_1.AddDealNoteDto]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "addNote", null);
exports.DealsController = DealsController = __decorate([
    (0, swagger_1.ApiTags)('deals'),
    (0, common_1.Controller)({ path: 'deals', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [deals_service_1.DealsService])
], DealsController);
//# sourceMappingURL=deals.controller.js.map
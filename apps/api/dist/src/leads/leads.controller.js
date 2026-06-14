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
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leads_service_1 = require("./leads.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../roles/guards/permissions.guard");
const require_permissions_decorator_1 = require("../common/decorators/require-permissions.decorator");
const permissions_constants_1 = require("../roles/permissions.constants");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const lead_dto_1 = require("./dto/lead.dto");
let LeadsController = class LeadsController {
    leadsService;
    constructor(leadsService) {
        this.leadsService = leadsService;
    }
    async create(user, dto) {
        return this.leadsService.create(user.tenantId, user.userId, dto);
    }
    async findAll(user, query) {
        return this.leadsService.findAll(user.tenantId, query);
    }
    async findOne(user, id) {
        return this.leadsService.findOne(user.tenantId, id);
    }
    async update(user, id, dto) {
        return this.leadsService.update(user.tenantId, id, dto, user.userId);
    }
    async archive(user, id) {
        return this.leadsService.archive(user.tenantId, id);
    }
    async addNote(user, id, dto) {
        return this.leadsService.addNote(user.tenantId, id, user.userId, dto.content);
    }
    async assign(user, id, dto) {
        return this.leadsService.assign(user.tenantId, id, dto.assigneeId, user.userId);
    }
    async getTimeline(user, id) {
        return this.leadsService.getTimeline(user.tenantId, id);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new lead' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.CREATE_LEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all leads with pagination and filters' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.READ_LEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lead_dto_1.QueryLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lead details' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.READ_LEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a lead' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.UPDATE_LEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, lead_dto_1.UpdateLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Archive a lead' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.DELETE_LEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "archive", null);
__decorate([
    (0, common_1.Post)(':id/notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a note to a lead' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.UPDATE_LEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, lead_dto_1.AddLeadNoteDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "addNote", null);
__decorate([
    (0, common_1.Put)(':id/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a lead to an agent' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.ASSIGN_LEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, lead_dto_1.AssignLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "assign", null);
__decorate([
    (0, common_1.Get)(':id/timeline'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lead activity timeline' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.READ_LEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "getTimeline", null);
exports.LeadsController = LeadsController = __decorate([
    (0, swagger_1.ApiTags)('leads'),
    (0, common_1.Controller)({ path: 'leads', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [leads_service_1.LeadsService])
], LeadsController);
//# sourceMappingURL=leads.controller.js.map
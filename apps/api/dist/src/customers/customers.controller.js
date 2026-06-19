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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customers_service_1 = require("./customers.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../roles/guards/permissions.guard");
const require_permissions_decorator_1 = require("../common/decorators/require-permissions.decorator");
const permissions_constants_1 = require("../roles/permissions.constants");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const customer_dto_1 = require("./dto/customer.dto");
let CustomersController = class CustomersController {
    customersService;
    constructor(customersService) {
        this.customersService = customersService;
    }
    async create(user, data) {
        return this.customersService.create(user.tenantId, data);
    }
    async findAll(user, query) {
        return this.customersService.findAll(user.tenantId, query);
    }
    async findOne(user, id) {
        return this.customersService.findOne(user.tenantId, id);
    }
    async update(user, id, data) {
        return this.customersService.update(user.tenantId, id, data);
    }
    async addNote(user, id, body) {
        return this.customersService.addNote(user.tenantId, id, user.userId, body.content);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new customer' }),
    (0, swagger_1.ApiBody)({ type: customer_dto_1.CreateCustomerDto }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.CREATE_CUSTOMER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all customers' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.READ_CUSTOMER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, customer_dto_1.QueryCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer details' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.READ_CUSTOMER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a customer' }),
    (0, swagger_1.ApiBody)({ type: customer_dto_1.UpdateCustomerDto }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.UPDATE_CUSTOMER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a note to a customer' }),
    (0, swagger_1.ApiBody)({ type: customer_dto_1.AddCustomerNoteDto }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.UPDATE_CUSTOMER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, customer_dto_1.AddCustomerNoteDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "addNote", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('customers'),
    (0, common_1.Controller)({ path: 'customers', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map
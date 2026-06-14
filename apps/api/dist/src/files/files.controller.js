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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const files_service_1 = require("./files.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../roles/guards/permissions.guard");
const require_permissions_decorator_1 = require("../common/decorators/require-permissions.decorator");
const permissions_constants_1 = require("../roles/permissions.constants");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let FilesController = class FilesController {
    filesService;
    constructor(filesService) {
        this.filesService = filesService;
    }
    async getUploadUrl(user, filename, contentType, folder) {
        return this.filesService.getUploadUrl(user.tenantId, filename, contentType, folder);
    }
    async getDownloadUrl(user, key) {
        if (!key.startsWith(`tenants/${user.tenantId}/`)) {
            throw new Error('Unauthorized file access');
        }
        const url = await this.filesService.getDownloadUrl(key);
        return { url };
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('upload-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a pre-signed URL to upload a file directly to S3' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.UPLOAD_FILE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('filename')),
    __param(2, (0, common_1.Body)('contentType')),
    __param(3, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getUploadUrl", null);
__decorate([
    (0, common_1.Get)('download-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a pre-signed URL to download a private file' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getDownloadUrl", null);
exports.FilesController = FilesController = __decorate([
    (0, swagger_1.ApiTags)('files'),
    (0, common_1.Controller)({ path: 'files', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map
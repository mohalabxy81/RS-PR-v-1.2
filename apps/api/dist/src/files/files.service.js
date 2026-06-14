"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
let FilesService = FilesService_1 = class FilesService {
    config;
    s3Client;
    bucketName;
    logger = new common_1.Logger(FilesService_1.name);
    constructor(config) {
        this.config = config;
        this.bucketName = this.config.get('s3.bucketName') || 'reis-uploads';
        const endpoint = this.config.get('s3.endpoint');
        const region = this.config.get('s3.region') || 'us-east-1';
        const accessKeyId = this.config.get('s3.accessKeyId');
        const secretAccessKey = this.config.get('s3.secretAccessKey');
        const forcePathStyle = this.config.get('s3.usePathStyle');
        const s3Config = { region };
        if (endpoint)
            s3Config.endpoint = endpoint;
        if (forcePathStyle)
            s3Config.forcePathStyle = forcePathStyle;
        if (accessKeyId && secretAccessKey) {
            s3Config.credentials = { accessKeyId, secretAccessKey };
        }
        this.s3Client = new client_s3_1.S3Client(s3Config);
    }
    async getUploadUrl(tenantId, filename, contentType, folder = 'general') {
        const ext = path.extname(filename);
        const uniqueFilename = `${(0, uuid_1.v4)()}${ext}`;
        const key = `tenants/${tenantId}/${folder}/${uniqueFilename}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
            Metadata: { tenantId },
        });
        try {
            const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 3600 });
            return { uploadUrl: url, key, filename: uniqueFilename };
        }
        catch (error) {
            this.logger.error(`Failed to generate upload URL: ${error.message}`);
            throw new Error('Could not generate upload URL');
        }
    }
    async getDownloadUrl(key, expiresInSeconds = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        try {
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: expiresInSeconds });
        }
        catch (error) {
            this.logger.error(`Failed to generate download URL for ${key}: ${error.message}`);
            throw new Error('Could not generate download URL');
        }
    }
    async uploadBuffer(tenantId, fileBuffer, filename, contentType, folder = 'general') {
        const ext = path.extname(filename);
        const uniqueFilename = `${(0, uuid_1.v4)()}${ext}`;
        const key = `tenants/${tenantId}/${folder}/${uniqueFilename}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
            Metadata: { tenantId },
        });
        await this.s3Client.send(command);
        return { key, url: await this.getDownloadUrl(key) };
    }
    async deleteFile(key) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        try {
            await this.s3Client.send(command);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to delete file ${key}: ${error.message}`);
            return false;
        }
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = FilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FilesService);
//# sourceMappingURL=files.service.js.map
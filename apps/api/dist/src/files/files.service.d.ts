import { ConfigService } from '@nestjs/config';
export declare class FilesService {
    private readonly config;
    private readonly s3Client;
    private readonly bucketName;
    private readonly logger;
    constructor(config: ConfigService);
    getUploadUrl(tenantId: string, filename: string, contentType: string, folder?: string): Promise<{
        uploadUrl: string;
        key: string;
        filename: string;
    }>;
    getDownloadUrl(tenantId: string, key: string, expiresInSeconds?: number): Promise<string>;
    uploadBuffer(tenantId: string, fileBuffer: Buffer, filename: string, contentType: string, folder?: string): Promise<{
        key: string;
        url: string;
    }>;
    deleteFile(tenantId: string, key: string): Promise<boolean>;
}

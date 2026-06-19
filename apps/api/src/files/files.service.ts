import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly config: ConfigService) {
    this.bucketName = this.config.get<string>('s3.bucketName') || 'reis-uploads';
    
    // Configure S3 client (works with MinIO locally or AWS S3 in prod)
    const endpoint = this.config.get<string>('s3.endpoint');
    const region = this.config.get<string>('s3.region') || 'us-east-1';
    const accessKeyId = this.config.get<string>('s3.accessKeyId');
    const secretAccessKey = this.config.get<string>('s3.secretAccessKey');
    const forcePathStyle = this.config.get<boolean>('s3.usePathStyle');

    const s3Config: any = { region };
    
    if (endpoint) s3Config.endpoint = endpoint;
    if (forcePathStyle) s3Config.forcePathStyle = forcePathStyle;
    
    if (accessKeyId && secretAccessKey) {
      s3Config.credentials = { accessKeyId, secretAccessKey };
    }

    this.s3Client = new S3Client(s3Config);
  }

  /**
   * Generates a pre-signed URL for direct browser-to-S3 upload.
   * This is the preferred method for large files as it bypasses the Node API.
   */
  async getUploadUrl(tenantId: string, filename: string, contentType: string, folder: string = 'general') {
    const ext = path.extname(filename);
    const uniqueFilename = `${uuidv4()}${ext}`;
    const key = `tenants/${tenantId}/${folder}/${uniqueFilename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      // Metadata allows us to enforce tenant isolation even at the storage level
      Metadata: { tenantId }, 
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour
      return { uploadUrl: url, key, filename: uniqueFilename };
    } catch (error: any) {
      this.logger.error(`Failed to generate upload URL: ${error.message}`);
      throw new Error('Could not generate upload URL');
    }
  }

  /**
   * Generates a pre-signed URL to read a private file.
   */
  async getDownloadUrl(tenantId: string, key: string, expiresInSeconds: number = 3600) {
    if (!key.startsWith(`tenants/${tenantId}/`)) {
      throw new NotFoundException('File not found or access denied');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    } catch (error: any) {
      this.logger.error(`Failed to generate download URL for ${key}: ${error.message}`);
      throw new Error('Could not generate download URL');
    }
  }

  /**
   * Uploads a file buffer directly from the API (e.g. for small profile pics).
   */
  async uploadBuffer(tenantId: string, fileBuffer: Buffer, filename: string, contentType: string, folder: string = 'general') {
    const ext = path.extname(filename);
    const uniqueFilename = `${uuidv4()}${ext}`;
    const key = `tenants/${tenantId}/${folder}/${uniqueFilename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      Metadata: { tenantId },
    });

    await this.s3Client.send(command);
    return { key, url: await this.getDownloadUrl(tenantId, key) };
  }

  async deleteFile(tenantId: string, key: string) {
    if (!key.startsWith(`tenants/${tenantId}/`)) {
      throw new NotFoundException('File not found or access denied');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    
    try {
      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to delete file ${key}: ${error.message}`);
      return false;
    }
  }
}

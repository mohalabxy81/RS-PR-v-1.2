import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor() {
    const secretKey = process.env.ENCRYPTION_KEY;
    if (!secretKey) {
      this.logger.warn('ENCRYPTION_KEY is not set in environment variables! Using a fallback key for development.');
      // Fallback for dev only. In prod, this should throw an error.
      this.key = crypto.scryptSync(process.env.JWT_SECRET || 'fallback_dev_secret', 'salt', 32);
    } else {
      // Assuming ENCRYPTION_KEY is a 32-byte hex string
      this.key = Buffer.from(secretKey, 'hex');
      if (this.key.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
      }
    }
  }

  encrypt(text: string): string {
    if (!text) return text;
    
    const iv = crypto.randomBytes(12); // GCM standard IV size
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  decrypt(encryptedText: string): string {
    if (!encryptedText) return encryptedText;
    
    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format');
      }
      
      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encryptedData = parts[2];
      
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      this.logger.error(`Failed to decrypt data: ${error.message}`);
      throw new Error('Decryption failed');
    }
  }
}

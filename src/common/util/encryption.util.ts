import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionUtil {
    private readonly ENCRYPTION_KEY: string = this.configService.get<string>('ENCRYPTION_KEY');
    private readonly FIXED_IV: string = this.configService.get<string>('FIXED_IV');
    constructor(
        private readonly configService: ConfigService
    ) {
    }

    /**
     * 개인정보 암호화 (복호화 가능, 동일 값에 대해 항상 동일한 암호화 결과 생성)
     * @param text 암호화할 문자열
     * @returns 암호화된 문자열
     */
    encryptDeterministic(text: string): string {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), Buffer.from(this.FIXED_IV));
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    /**
     * 개인정보 복호화
     * @param encrypted 암호화된 문자열
     * @returns 복호화된 문자열
     */
    decryptDeterministic(encrypted: string): string {
        const decipher = crypto.createDecipheriv('aes-256-cbc',Buffer.from(this.ENCRYPTION_KEY), Buffer.from(this.FIXED_IV));
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
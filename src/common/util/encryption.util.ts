import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionUtil {
    private readonly ENCRYPTION_KEY: Buffer;
    private readonly FIXED_IV: Buffer;

    constructor(
        private readonly configService: ConfigService
    ) {
        const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
        const fixedIv = this.configService.get<string>('FIXED_IV');
        
        if (!encryptionKey || !fixedIv) {
            throw new Error('ENCRYPTION_KEY and FIXED_IV must be set in environment variables');
        }
        
        // ENCRYPTION_KEY를 32바이트로 변환
        this.ENCRYPTION_KEY = crypto.createHash('sha256').update(encryptionKey).digest();
        
        // FIXED_IV를 16바이트로 변환
        // hex 형식이면 hex로, 아니면 문자열을 해시로 변환
        if (fixedIv.length === 32 && /^[0-9a-fA-F]+$/.test(fixedIv)) {
            // hex 형식 (32자 hex = 16바이트)
            this.FIXED_IV = Buffer.from(fixedIv, 'hex');
        } else {
            // 일반 문자열인 경우 MD5 해시로 16바이트 생성
            this.FIXED_IV = crypto.createHash('md5').update(fixedIv).digest();
        }
    }

    /**
     * 개인정보 암호화 (복호화 가능, 동일 값에 대해 항상 동일한 암호화 결과 생성)
     * @param text 암호화할 문자열
     * @returns 암호화된 문자열
     */
    encryptDeterministic(text: string): string {
        const cipher = crypto.createCipheriv('aes-256-cbc', this.ENCRYPTION_KEY, this.FIXED_IV);
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
        const decipher = crypto.createDecipheriv('aes-256-cbc',this.ENCRYPTION_KEY, this.FIXED_IV);
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
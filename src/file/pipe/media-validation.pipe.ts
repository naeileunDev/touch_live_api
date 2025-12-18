import { PipeTransform } from "@nestjs/common";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MimeType } from "../enum/file-category.enum";

export class MediaValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File): Express.Multer.File {
        if (!file) {
            throw new ServiceException(MESSAGE_CODE.FILE_NOT_FOUND);
        }
        const allowedMimeTypes = Object.values(MimeType);
        
        if (!allowedMimeTypes.includes(file.mimetype as MimeType)) {
            throw new ServiceException(MESSAGE_CODE.FILE_INVALID_MIME_TYPE);
        }
        return file;
    }
}

export class MediaValidationPipeArray implements PipeTransform {
    transform(
        files: Record<string, Express.Multer.File[]>
    ): Record<string, Express.Multer.File[]> {
        if (!files || typeof files !== 'object') {
            throw new ServiceException(MESSAGE_CODE.FILE_NOT_FOUND);
        }
        
        const allowedMimeTypes = Object.values(MimeType) as string[];
        
        // 각 필드의 파일 배열들을 순회
        for (const [fieldName, fileArray] of Object.entries(files)) {
            if (!fileArray || !Array.isArray(fileArray)) {
                continue; // 빈 배열이거나 배열이 아닌 경우 건너뛰기
            }
            
            // 각 파일 검증
            for (const file of fileArray) {
                if (!file) {
                    throw new ServiceException(MESSAGE_CODE.FILE_NOT_FOUND);
                }
                
                if (!file.mimetype) {
                    throw new ServiceException(MESSAGE_CODE.FILE_INVALID_MIME_TYPE);
                }
                
                // ✅ 정확한 문자열 비교 (타입 캐스팅 제거)
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    console.error(
                        `Invalid MIME type for field "${fieldName}": ${file.mimetype}. ` +
                        `File: ${file.originalname}. Allowed: ${allowedMimeTypes.join(', ')}`
                    );
                    throw new ServiceException(MESSAGE_CODE.FILE_INVALID_MIME_TYPE);
                }
            }
        }
        
        return files;
    }
}
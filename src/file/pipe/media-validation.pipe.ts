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
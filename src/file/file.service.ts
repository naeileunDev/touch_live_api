import { Injectable } from '@nestjs/common';
import { FileCreateDto } from './dto/file-create.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { dirname, join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';

@Injectable()
export class FileService {
    saveLocalToUploads(fileCreateDto: FileCreateDto) {
    const staticRoot = join(__dirname, '..', 'uploads', fileCreateDto.category);
    const uploadPath = join(staticRoot, fileCreateDto.originalName);
    const uploadDir = dirname(uploadPath);
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
    }
    const file = createWriteStream(uploadPath);
    file.write(fileCreateDto.base64);
    file.end();
    return uploadPath;
  }
}

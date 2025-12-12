import { Injectable } from '@nestjs/common';
import { FileCreateDto } from './dto/file-create.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs'


@Injectable()
export class FileService {
    private basePath = path.join(process.cwd(), 'uploads');  
    async saveLocalToUploads(key: string, file: Express.Multer.File): Promise<string> {
        const fullPath = path.join(this.basePath, key); // category/entityId/filename
    
        const dir = path.dirname(fullPath);
        await fs.mkdir(dir, { recursive: true }); // 폴더 자동 생성
    
        await fs.writeFile(fullPath, file.buffer);
    
        // 클라이언트용 URL을 돌려줄 경우
        return `/uploads/${key}`;
    }

    /**
   * category: 'post', 'user', 'comment' 등 미디어를 사용하는 도메인 종류
   * entityId: 게시글 ID, 유저 ID 등
   * originalName: 원본 파일명
   */
    generatePath(category: string, entityId: number, originalName: string): string {
        const extension = path.extname(originalName); // 예: ".png"
        const uniqueName = `${uuidv4()}${extension}`;
    
        return `${category}/${entityId}/${uniqueName}`;
      }

  
}

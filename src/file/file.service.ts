import { Injectable } from '@nestjs/common';
import { FileCreateDto } from './dto/file-create.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs'
import * as ffmpeg from 'fluent-ffmpeg';
import { VideoInfoDto } from './dto/video-info.dto';
import { ResolutionGradeType } from './enum/resolution-grade-type.enum';
import { ServiceException } from 'src/common/filter/exception/service.exception';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';


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

    /**
   * Multer 파일 버퍼를 받아 FFprobe를 사용하여 영상 길이를 초 단위로 반환합니다.
   * @param file Multer의 파일 객체 (버퍼 사용을 가정)
   * @returns 영상 길이 (초)
   */
    async getVideoInfoFromBuffer(file: Express.Multer.File): Promise<VideoInfoDto> {
        const tempFilePath = path.join(this.basePath, `temp_${uuidv4()}${path.extname(file.originalname)}`);
        
        try {
            // 임시 파일로 저장
            await fs.writeFile(tempFilePath, file.buffer);
            
            return new Promise((resolve, reject) => {
                ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
                    // 임시 파일 삭제 (성공/실패 관계없이)
                    fs.unlink(tempFilePath).catch(() => {}); // 삭제 실패는 무시
                    
                    if (err) {
                        console.error('FFprobe 오류:', err);
                        return reject(new ServiceException(MESSAGE_CODE.FILE_METADATA_ANALYSIS_FAILED));
                    }
                    
                    const duration = metadata.format.duration;
                    const videoStream = metadata.streams.find(
                        stream => stream.codec_type === 'video'
                    );

                    if (!videoStream || !videoStream.width || !videoStream.height) {
                        return reject(new ServiceException(MESSAGE_CODE.FILE_RESOLUTION_NOT_FOUND));
                    }

                    const resolutionGrade = this.getResolutionGrade(videoStream.width, videoStream.height);
                    
                    resolve(new VideoInfoDto(
                        Math.round(duration * 100) / 100, 
                        videoStream.width, 
                        videoStream.height,
                        videoStream.bitrate, 
                        videoStream.codec_name, 
                        videoStream.format,
                        file.size,
                        resolutionGrade,
                    ));
                });
            });
        } catch (error) {
            // 파일 쓰기 실패 시 임시 파일 정리
            fs.unlink(tempFilePath).catch(() => {});
            throw new ServiceException(MESSAGE_CODE.FILE_TEMP_CREATE_FAILED);
        }
    }

    getResolutionGrade(width: number, height: number): ResolutionGradeType {
        // 세로·가로를 큰 값/작은 값으로 정렬해 가로/세로 뒤집힌 경우도 대응
        const longSide = Math.max(width, height);
        const shortSide = Math.min(width, height);
      
        if (longSide >= 3840 && shortSide >= 2160) return ResolutionGradeType.FOURK;
        if (longSide >= 2560 && shortSide >= 1440) return ResolutionGradeType.FOURTEENFOURTYP;
        if (longSide >= 1920 && shortSide >= 1080) return ResolutionGradeType.FULLHD;
        if (longSide >= 1280 && shortSide >= 720)  return ResolutionGradeType.HD;
        if (longSide >= 854  && shortSide >= 480)  return ResolutionGradeType.FOUREIGHTYP;
        if (longSide >= 640  && shortSide >= 360)  return ResolutionGradeType.THREESIXY;
        return ResolutionGradeType.TWOTWOF;
    }
  
  
}

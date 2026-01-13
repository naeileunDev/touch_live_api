import { Injectable, StreamableFile } from '@nestjs/common';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream, promises as fs } from 'fs'
import * as ffmpeg from 'fluent-ffmpeg';
import { ServiceException } from 'src/common/filter/exception/service.exception';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';
import { FileRepository } from './repository/file.repository';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { FileCreateDto } from './dto/file-create.dto';
import { FileDto } from './dto/file.dto';
import { MimeType, UsageType, MediaType, ContentCategory } from './enum/file-category.enum';
import { UserService } from 'src/user/service/user.service';
import { StoreRegisterLogCreateFileDto } from './dto/store-register-log-create-file.dto';
import { User } from 'src/user/entity/user.entity';
import { StoreRegisterLogFilesDto } from './dto/store-register-log-files.dto';

@Injectable()
export class FileService {

    constructor(
        private readonly fileRepository: FileRepository,
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {}
    private readonly envConfig: string = this.configService.get<string>('NODE_ENV') === 'local' ? 'local' : 'prod';
    private basePath = path.join(process.cwd(), 'uploads');

    async saveFileToS3(file: Express.Multer.File): Promise<any> {
        const s3 = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }
      
    async createLocal(file: Express.Multer.File, dto: FileCreateDto): Promise<FileDto> {
        const fullPath = this.generatePath(dto, file.mimetype);
        const dir = path.dirname(fullPath); 
        await fs.mkdir(dir, { recursive: true });
        
        await fs.writeFile(fullPath, file.buffer);
        const mediaType = file.mimetype.startsWith('image/') ? MediaType.Image : MediaType.Video;
        let duration = null;
        if (mediaType === MediaType.Video) {
            duration = await this.getMediaInfoFromBuffer(file);
        }

        const fileDto = new FileDto(
            {
                contentCategory: dto.contentCategory as ContentCategory,
                usageType: dto.usageType as UsageType,
                mediaType: mediaType as MediaType,
                mimeType: file.mimetype as MimeType,
                contentId: dto.contentId,
                originalName: file.originalname,
                fileUrl: fullPath,
                duration: duration,
            }
        );

        const savedFile = await this.fileRepository.createFile(fileDto);
        fileDto.id = savedFile.id;
        return fileDto;
    }

    /**
   * category: 'store', 'user', 'product' 등 미디어를 사용하는 도메인 종류
   * entityId: 가게 ID, 유저 ID, 상품 ID 등
   * originalName: 원본 파일명
   */
    generatePath(dto: FileCreateDto, mimeType: string): string {
        const extension = path.extname(mimeType); // 예: ".png"
        return path.join(this.basePath, dto.contentCategory.toString(), `${uuidv4()}${extension}`);
    }

    /**
   * Multer 파일 버퍼를 받아 FFprobe를 사용하여 영상 길이를 초 단위로 반환합니다.
   * @param file Multer의 파일 객체 (버퍼 사용을 가정)
   * @returns 영상 길이 (초)
   */
    async getMediaInfoFromBuffer(file: Express.Multer.File): Promise<number> {
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
                    
                    const duration = Math.round(Number(metadata.format.duration) * 100) / 100;
                    
                    resolve(
                        duration
                    );
                });
            });
        } catch (error) {
            // 파일 쓰기 실패 시 임시 파일 정리
            fs.unlink(tempFilePath).catch(() => {});
            throw new ServiceException(MESSAGE_CODE.FILE_TEMP_CREATE_FAILED);
        }
    }

    async findById(id: number): Promise<FileDto> {
        const file = await this.fileRepository.findById(id);
        return new FileDto(file);
    }

    async findByIds(ids: number[]): Promise<FileDto[]> {
        const files = await this.fileRepository.findByIds(ids);
        return files.map(file => new FileDto(file));
    }
    
    async findByIdAndServe(id: number): Promise<StreamableFile> {
        const file = await this.findById(id);
        try {
            await fs.access(file.fileUrl);
        } catch {
            throw new ServiceException(MESSAGE_CODE.FILE_NOT_FOUND);
        }

        const stream = createReadStream(file.fileUrl);
        return new StreamableFile(stream, {
            type: file.mimeType,
            disposition: `inline; filename="${file.originalName}"`,
        });
    }

    async createStoreRegisterLogFile(createDto: StoreRegisterLogCreateFileDto, user: User): Promise<StoreRegisterLogFilesDto> {
        const userEntity = await this.userService.findEntityById(user.id, true);
        
        const fileMappings: Array<{ field: keyof StoreRegisterLogCreateFileDto; usageType: UsageType }> = [
            { field: 'businessRegistrationImage', usageType: UsageType.BusinessRegistrationImage },
            { field: 'eCommerceLicenseImage', usageType: UsageType.eCommerceLicenseImage },
            { field: 'accountImage', usageType: UsageType.AccountImage },
            { field: 'profileImage', usageType: UsageType.Profile },
            { field: 'bannerImage', usageType: UsageType.Banner },
        ];

        const fileDtos = await Promise.all(
            fileMappings.map(async ({ field, usageType }) => {
                const files = createDto[field];
                if (!files || files.length === 0) {
                    throw new ServiceException(MESSAGE_CODE.FILE_NOT_FOUND);
                }
                return await this.createLocal(files[0] as Express.Multer.File, {
                    contentCategory: ContentCategory.User,
                    usageType,
                    contentId: userEntity.id,
                    userId: userEntity.id,
                });
            })
        );

        return new StoreRegisterLogFilesDto(
            fileDtos[0],
            fileDtos[1],
            fileDtos[2],
            fileDtos[3],
            fileDtos[4],
        );
    }
}

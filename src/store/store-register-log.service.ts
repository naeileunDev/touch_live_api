import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { StoreRegisterLogRepository } from './repository/store-register-log.repository';
import { FileService } from 'src/file/file.service';
import { ContentCategory, UsageType } from 'src/file/enum/file-category.enum';
import { StoreFilesDto } from './dto/store-files.dto';
import { Transactional } from 'typeorm-transactional';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';
import { ServiceException } from 'src/common/filter/exception/service.exception';
import { FileCreateDto } from 'src/file/dto/file-create.dto';
import { UserService } from 'src/user/service/user.service';
import { StoreRegisterStatus } from './enum/store-register-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/auth/auth.service';
import { StoreRegisterLogDto } from './dto/store-register-log.dto';
import { AuthTokenDto } from 'src/auth/dto/auth-token.dto';
import { UserRole } from 'src/user/enum/user-role.enum';
import { StoreRegisterLogCreateDto } from './dto/store-register-log-create.dto';
import { StoreRegisterLogCreateResponseDto } from './dto/store-register-log-create-response.dto';
import { StoreRegisterLog } from './entity/store-register-log.entity';

@Injectable()
export class StoreRegisterLogService {
  constructor(
    private readonly storeRegisterLogRepository: StoreRegisterLogRepository,
    private readonly FileService: FileService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
  }

  @Transactional()
  async createStoreRegisterLog(createDto: StoreRegisterLogCreateDto, user: User, files: {
    businessRegistrationImage: Express.Multer.File[],
    eCommerceLicenseImage: Express.Multer.File[],
    accountImage: Express.Multer.File[],
    profileImage: Express.Multer.File[],
    bannerImage: Express.Multer.File[],
  }) {
    const userEntity = await this.userService.findEntityById(user.id, true);
    const fileMappings = [
        { field: 'businessRegistrationImage', usageType: UsageType.BusinessRegistrationImage, required: true },
        { field: 'eCommerceLicenseImage', usageType: UsageType.eCommerceLicenseImage, required: true },
        { field: 'accountImage', usageType: UsageType.AccountImage, required: true },
        { field: 'profileImage', usageType: UsageType.Profile, required: false },
        { field: 'bannerImage', usageType: UsageType.Banner, required: false },
    ] as const;
    
    // 필수 파일 검증
    const requiredFiles = fileMappings.filter(m => m.required);
    if (requiredFiles.some(m => !files[m.field])) {
        throw new ServiceException(MESSAGE_CODE.FILE_REQUIRED_NOT_FOUND);
    }
    
    // 병렬 처리
    const fileResults = await Promise.all(
        fileMappings
            .filter(m => files[m.field])  // 파일이 있는 것만 처리
            .map(async (m) => {
                const fileArray = files[m.field] as Express.Multer.File[];
                const file = await this.FileService.saveLocalToUploads(
                    fileArray[0],
                    {   
                        contentCategory: ContentCategory.User,
                        usageType: m.usageType,
                        contentId: user.id,
                    } as FileCreateDto
                );
                return { usageType: m.usageType, id: file.id, url: file.fileUrl };
            })
    );
    const uuid = uuidv4();
    const storeFilesDto = new StoreFilesDto(new Map(fileResults.map(r => [r.usageType, {id: r.id, url: r.url}])));
    const storeRegisterLog = await this.storeRegisterLogRepository.createStoreRegisterLog(createDto, user, storeFilesDto);
    userEntity.storeRegisterStatus = StoreRegisterStatus.Pending;
    const savedUser = await this.userService.saveEntity(userEntity);
    const accessToken = await this.authService.createAccessToken(savedUser, uuid, createDto.fcmToken);
    const refreshToken = await this.authService.createRefreshToken(savedUser, uuid);
    return new StoreRegisterLogCreateResponseDto(storeRegisterLog, storeFilesDto, new AuthTokenDto(accessToken, refreshToken));
  }

  async findByRegisterLogId(id: number, user: User): Promise<StoreRegisterLogDto> {
    const log = await this.storeRegisterLogRepository.findById(id);
    if (log.user.id !== user.id && user.userOperation == null && user.role === UserRole.User) {
        throw new ServiceException(MESSAGE_CODE.STORE_REGISTER_LOG_NOT_ALLOWED);
    }
    return new StoreRegisterLogDto(log);
  }

  async findEntityByRegisterLogId(id: number): Promise<StoreRegisterLog> {
    const log = await this.storeRegisterLogRepository.findById(id);
    if (!log) {
      throw new ServiceException(MESSAGE_CODE.STORE_REGISTER_LOG_NOT_FOUND);
    }
    return log;
  }

  async saveRegisterLog(log: StoreRegisterLog): Promise<StoreRegisterLog> {
    return await this.storeRegisterLogRepository.save(log);
  }

  async deleteByRegisterLogId(id: number): Promise<boolean> {
    return await this.storeRegisterLogRepository.deleteById(id);
  }
}

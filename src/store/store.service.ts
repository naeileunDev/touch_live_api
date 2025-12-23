import { Injectable } from '@nestjs/common';
import { StoreCreateDto } from './dto/store-create.dto';
import { User } from 'src/user/entity/user.entity';
import { StoreRepository } from './repository/store.respository';
import { StoreRegisterLogRepository } from './repository/store-register-log.repository';
import { FileService } from 'src/file/file.service';
import { ContentCategory, UsageType } from 'src/file/enum/file-category.enum';
import { FileCommonDto } from 'src/file/dto/file-common-dto';
import { StoreRegisterLog } from './entity/store-register-log.entity';
import { StoreFilesDto } from './dto/store-files.dto';
import { FileDto } from 'src/file/dto/file.dto';
import { StoreRegisterLogDto } from './dto/store-register-log.dto';
import { TagCommonDto } from 'src/tag/dto/tag-common.dto';
import { Transactional } from 'typeorm-transactional';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';
import { ServiceException } from 'src/common/filter/exception/service.exception';
import { FileCreateDto } from 'src/file/dto/file-create.dto';
import { UserService } from 'src/user/service/user.service';
import { StoreRegisterStatus } from './enum/store-register-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/auth/auth.service';
import { StoreCreateResponseDto } from './dto/store-create-response.dto';
import { AuthTokenDto } from 'src/auth/dto/auth-token.dto';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storeRegisterLogRepository: StoreRegisterLogRepository,
    private readonly FileService: FileService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
  }
  @Transactional()
  async create(storeCreateDto: StoreCreateDto, user: User, files: {
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
                return { usageType: m.usageType, id: file.id };
            })
    );
    const fileIds = new Map<UsageType, number>(
        fileResults.map(r => [r.usageType, r.id])
    );
    const uuid = uuidv4();
    const storeFilesDto = new StoreFilesDto(fileIds);
    const storeRegisterLog = await this.storeRegisterLogRepository.saveStoreRegisterLog(storeCreateDto, user, storeFilesDto);
    userEntity.storeRegisterStatus = StoreRegisterStatus.Pending;
    const savedUser = await this.userService.saveEntity(userEntity);
    const accessToken = await this.authService.createAccessToken(savedUser, uuid, storeCreateDto.fcmToken);
    const refreshToken = await this.authService.createRefreshToken(savedUser, uuid);
    return new StoreCreateResponseDto(new StoreRegisterLogDto(storeRegisterLog), new AuthTokenDto(accessToken, refreshToken));
  }
}

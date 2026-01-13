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
import { UserDto } from 'src/user/dto';
import { Store } from './entity/store.entity';
import { StoreRegisterLogFilesDto } from 'src/file/dto/store-register-log-files.dto';


/* 
 * Todo 심사 요청 추가 로직 구현
 * 수정 사항: 파일 업로드 먼저 저장하고 값을 return 해서 로그 저장하는 방식으로 변경 
 * 심사 요청 추가 로직 구현
 * 어드민 심사로그 승인 로직 구현
 */

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
  async create(createDto: StoreRegisterLogCreateDto, user: User) {
    const userEntity = await this.userService.findEntityById(user.id, true);

    const uuid = uuidv4();
    const storeRegisterLog = await this.storeRegisterLogRepository.createStoreRegisterLog(createDto, user);
    userEntity.storeRegisterStatus = StoreRegisterStatus.Pending;
    const savedUser = await this.userService.save(userEntity);
    const accessToken = await this.authService.createAccessToken(savedUser, uuid, createDto.fcmToken);
    const refreshToken = await this.authService.createRefreshToken(savedUser, uuid);
    return new StoreRegisterLogCreateResponseDto(storeRegisterLog, createDto.files ,new AuthTokenDto(accessToken, refreshToken));
  }

  async findById(id: number, user: User): Promise<StoreRegisterLogDto> {
    const log = await this.storeRegisterLogRepository.findById(id);
    if (log.user.id !== user.id){
        const userEntity = await this.userService.findEntityById(user.id, true);
        if (userEntity.userOperation == null && userEntity.role === UserRole.User) {
            throw new ServiceException(MESSAGE_CODE.STORE_REGISTER_LOG_NOT_ALLOWED);
        }
    }
    const filesIds = [log.businessRegistrationImageId, log.eCommerceLicenseImageId, log.accountImageId, log.storeProfileImageId, log.storeBannerImageId];
    const files = await this.FileService.findByIds(filesIds);

    return new StoreRegisterLogDto(log, StoreRegisterLogFilesDto.of(files));
  }

  async findEntityById(id: number): Promise<StoreRegisterLog> {
    const log = await this.storeRegisterLogRepository.findById(id);
    if (!log) {
      throw new ServiceException(MESSAGE_CODE.STORE_REGISTER_LOG_NOT_FOUND);
    }
    return log;
  }

  async save(log: StoreRegisterLog): Promise<StoreRegisterLog> {
    return await this.storeRegisterLogRepository.save(log);
  }

  async deleteById(id: number): Promise<boolean> {
    return await this.storeRegisterLogRepository.deleteById(id);
  }

  async findByUserId(userId: string, user: User): Promise<StoreRegisterLogDto[]> {
    const logs = await this.storeRegisterLogRepository.findAllByUserId(userId);
    if (logs[1] === 0 || logs[0].length === 0) {
        return [];
    }
    const filesIds = logs[0].map(l => [l.businessRegistrationImageId, l.eCommerceLicenseImageId, l.accountImageId, l.storeProfileImageId, l.storeBannerImageId]);
    const files = await this.FileService.findByIds(filesIds.flat());
    return logs[0].map(l => new StoreRegisterLogDto(l, StoreRegisterLogFilesDto.of(files)));
  }
}

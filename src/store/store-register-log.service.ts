import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { StoreRegisterLogRepository } from './repository/store-register-log.repository';
import { FileService } from 'src/file/file.service';
import { Transactional } from 'typeorm-transactional';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';
import { ServiceException } from 'src/common/filter/exception/service.exception';
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
import { AuditStatus } from 'src/common/enums';
import { StoreRegisterLogAuditCreateDto } from './dto/store-register-log-audit-create.dto';
import { StoreService } from './store.service';
import { StoreRegisterLogListResponseDto } from './dto/store-register-log-list-response.dto';
import { StoreRegisterLogAuditDto } from './dto/store-register-log-audit.dto';

@Injectable()
export class StoreRegisterLogService {
  constructor(
    private readonly storeRegisterLogRepository: StoreRegisterLogRepository,
    private readonly FileService: FileService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly storeService: StoreService,
  ) {
  }

  @Transactional()
  async create(createDto: StoreRegisterLogCreateDto, user: User) {
    const userEntity = await this.userService.findEntityById(user.id, true);
    userEntity.storeRegisterStatus = StoreRegisterStatus.Pending;
    const savedUser = await this.userService.save(userEntity);
    const uuid = uuidv4();
    const accessToken = await this.authService.createAccessToken(savedUser, uuid, createDto.fcmToken);
    const refreshToken = await this.authService.createRefreshToken(savedUser, uuid);
    const storeRegisterLog = await this.storeRegisterLogRepository.createStoreRegisterLog(createDto, createDto.files, userEntity);
    return new StoreRegisterLogCreateResponseDto(storeRegisterLog, new AuthTokenDto(accessToken, refreshToken));
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

    return new StoreRegisterLogDto(log);
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

  async findByUserId(userId: string, user: User): Promise<StoreRegisterLogListResponseDto> {
    const [logs, total] = await this.storeRegisterLogRepository.findAllByUserId(userId);
    if (total === 0 || logs.length === 0) {
        return { logs: [], total: 0 };
    }
    return { logs: logs.map(l => new StoreRegisterLogDto(l)), total };
  }

  /* 
심사 시 승인 => 로그 업데이트, 스토어 등록, 로그 반환
거절 시 로그 업데이트, 로그 반환
 */      
  @Transactional()
  async auditById(id: number, auditDto: StoreRegisterLogAuditCreateDto, user: User): Promise<StoreRegisterLogAuditDto> {
    const log = await this.findEntityById(id);
    if(log.auditStatus !== AuditStatus.Pending) {
      throw new ServiceException(MESSAGE_CODE.STORE_REGISTER_LOG_AUDIT_ALREADY_DONE);
    }
    log.auditStatus = auditDto.auditStatus;
    log.comment = auditDto.comment;
    log.status = auditDto.auditStatus as unknown as StoreRegisterStatus;
    const savedLog = await this.save(log);
    if(savedLog.auditStatus !== AuditStatus.Approved) {
      return new StoreRegisterLogAuditDto(savedLog);
    }
    await this.storeService.create(savedLog);
    return new StoreRegisterLogAuditDto(savedLog);
  }
}

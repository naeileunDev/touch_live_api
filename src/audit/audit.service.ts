import { UserDto } from "src/user/dto";
import { AuditRequestCreateDto } from "./dto/audit-request-create.dto";
import { AuditRequestRepository } from "./repository/audit-request.repository";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/service/user.service";
import { AuditRequestDto } from "./dto/audit-request.dto";
import { UserRole } from "src/user/enum/user-role.enum";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { AuditType } from "./enum/audit-type.enum";
import { User } from "src/user/entity/user.entity";

// 해당 서비스로직은 관리자 플로우를 상정하여 구현 => 쓰임새 미정 
@Injectable()
export class AuditService {
    constructor(
        private readonly auditRequestRepository: AuditRequestRepository, 
    ) {}

    async create(dto: AuditRequestCreateDto, user: User): Promise<AuditRequestDto> {
        const auditRequest = await this.auditRequestRepository.createAuditRequest(dto, user.id);
        return new AuditRequestDto(auditRequest, user);
    }

    async findByUserId(user: User, userId: number): Promise<AuditRequestDto[]> {
        if (user.id !== userId && user.role === UserRole.User) {
            throw new ServiceException(MESSAGE_CODE.NOT_ALLOWED_OTHER);
        }
        const auditRequests = await this.auditRequestRepository.findByUserId(user.id);
        return auditRequests.map(auditRequest => new AuditRequestDto(auditRequest, user));
    }

    async findByUserIdAndTargetType(user: User, userId: number, targetType: AuditType): Promise<AuditRequestDto[]> {
        if (user.id !== userId && user.role === UserRole.User) {
            throw new ServiceException(MESSAGE_CODE.NOT_ALLOWED_OTHER);
        }
        const auditRequests = await this.auditRequestRepository.findByUserIdAndTargetType(user.id, targetType);
        return auditRequests.map(auditRequest => new AuditRequestDto(auditRequest, user));
    }
}
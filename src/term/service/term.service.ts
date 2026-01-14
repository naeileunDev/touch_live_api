import { Injectable } from "@nestjs/common";
import { TermVersionRepository } from "../repository/term-version.repository";
import { TermVersionCreateDto } from "../dto/term-version-create.dto";
import { TermVersionDto } from "../dto/term-version.dto";
import { User } from "src/user/entity/user.entity";
import { TargetType } from "../enum/term-version.enum";
import { TermVersion } from "../entity/term-version.entity";
import { UserTermAgreementChangeLogRepository } from "../repository/user-term-agreement-change-log.repository";
import { StoreTermAgreementChangeLogRepository } from "../repository/store-term-agreement-change-log.repository";
import { TermLogCreateDto } from "../dto/term-log-create.dto";
import { UserService } from "src/user/service/user.service";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { OptionalTermsFindDto } from "../dto/optional-terms-find.dto";

/* 약관 관련 기능 구현
    운영자: 
        약관 버전 관리(생성)
    사용자:
        사용자용 약관 조회기능(필수, 선택 약관)
        약관 동의 기능(필수, 선택 약관)(생성)
        선택 약관 상태 조회 
        선택 약관 동의 기능(생성)
    스토어:
        스토어용 약관 조회기능(필수, 선택 약관)
        약관 동의 기능(필수, 선택 약관)(생성)
        선택 약관 상태 조회 
        선택 약관 동의 기능(생성)
*/

@Injectable()
export class TermService {
    constructor(
        private readonly termVersionRepository: TermVersionRepository,
        private readonly userTermAgreementChangeLogRepository: UserTermAgreementChangeLogRepository,
        private readonly storeTermAgreementChangeLogRepository: StoreTermAgreementChangeLogRepository,
    ) {
    }

    // 약관 생성
    async create(dto: TermVersionCreateDto, user: User): Promise<TermVersionDto> {
        const termVersion = await this.termVersionRepository.createTermVersion(dto, user);
        termVersion.version = termVersion.createdAt;
        const savedTerm = await this.termVersionRepository.save(termVersion);
        return new TermVersionDto(savedTerm);
    }

    // 해당 대상(유저 / 스토어 ) 약관 조회 타입별 최신 버전 목록 
    async findAllByTargetType(targetType: TargetType): Promise<TermVersion[]|[]> {
        const termVersions = await this.termVersionRepository.getLatestTermsForTargetType(targetType);
        return termVersions as TermVersion[];
    }

    async createLog(dtos: TermLogCreateDto[], user: User, target: TargetType): Promise<boolean> {
        for (const dto of dtos) {
            if (dto.isRequired && !dto.isAgreed) {
                throw new ServiceException(MESSAGE_CODE.REQUIRED_TERM_NOT_AGREED);
            }
        }
        if (target === TargetType.User) {
            return await this.userTermAgreementChangeLogRepository.createUserTermAgreementChangeLog(dtos, user.id);
        } else {
            return await this.storeTermAgreementChangeLogRepository.createStoreTermAgreementChangeLog(dtos, user);
        }
    }

    async findOptionalTermsStatus(user: User, target: TargetType): Promise<OptionalTermsFindDto[]> {
        const dtos: OptionalTermsFindDto[] = [];
        if (target === TargetType.User) {
            const logs = await this.userTermAgreementChangeLogRepository.findOptionalTermsStatus(user.id);
            logs.forEach(log => {
                dtos.push({
                    termType: log.termType,
                    isAgreed: log.isAgreed,
                });
            });
        } else {
            const logs = await this.storeTermAgreementChangeLogRepository.findOptionalTermsStatus(user.store.id);
            logs.forEach(log => {
                dtos.push({
                    termType: log.termType,
                    isAgreed: log.isAgreed,
                });
            });
        }
        return dtos;
    }

    async updateTermLogMe(dtos: TermLogCreateDto[], user: User, target: TargetType): Promise<boolean> {
        if (target === TargetType.User) {
            return await this.userTermAgreementChangeLogRepository.createUserTermAgreementChangeLog(dtos, user.id);
        } else {
            return await this.storeTermAgreementChangeLogRepository.createStoreTermAgreementChangeLog(dtos, user);
        }
    }


}
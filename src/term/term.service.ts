import { Injectable } from "@nestjs/common";
import { StoreTermAgreementChangeLogRepository } from "./repository/store-term-agreement-change-log.repository";
import { TermVersionRepository } from "./repository/term-version.repository";
import { UserTermAgreementChangeLogRepository } from "./repository/user-term-agreement-change-log.repository";
import { TermVersionCreateDto } from "./dto /term-version-create.dto";
import { TermVersionDto } from "./dto /term-version.dto";
import { User } from "src/user/entity/user.entity";
import { TargetType, TermType } from "./enum/term-version.enum";

/* ToDo: 약관 관련 기능 구현
    운영자: 
        약관 버전 관리
    사용자:
        사용자용 약관 조회기능(필수, 선택 약관)
        약관 동의 기능(필수, 선택 약관)
    스토어:
        스토어용 약관 조회기능(필수, 선택 약관)
        약관 동의 기능(필수, 선택 약관)
*/

@Injectable()
export class TermService {
    constructor(
        private readonly termVersionRepository: TermVersionRepository,
        private readonly userTermAgreementChangeLogRepository: UserTermAgreementChangeLogRepository,
        private readonly storeTermAgreementChangeLogRepository: StoreTermAgreementChangeLogRepository,
    ) {
    }

    async create(dto: TermVersionCreateDto, user: User): Promise<TermVersionDto> {
        const termVersion = await this.termVersionRepository.createTermVersion(dto, user);
        termVersion.version = termVersion.createdAt;
        const savedTerm = await this.termVersionRepository.save(termVersion);
        return new TermVersionDto(savedTerm);
    }

    async findAllByTargetType(targetType: TargetType): Promise<TermVersionDto[]> {
        const termTypes = Object.values(TermType);
        const termVersions = await Promise.all(
            termTypes.map(async (termType) => {
                return await this.termVersionRepository.findByTargetType(targetType, termType);
            })
        );
        return termVersions.map(termVersion => new TermVersionDto(termVersion));
    }

    async findAllByRequired(required: boolean, targetType: TargetType): Promise<TermVersionDto[]> {
        const termTypes = Object.values(TermType);
        const termVersions = await Promise.all(
            termTypes.map(async (termType) => {
                return await this.termVersionRepository.findByRequired(required, targetType);
            })
        );
        return termVersions.map(termVersion => new TermVersionDto(termVersion));
    }
}
import { DataSource, Repository } from "typeorm";
import { TermsTemplate } from "../entity/terms-template.entity";
import { TermsType } from "../enum/terms-type.enum";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TermsTemplateRepository extends Repository<TermsTemplate> {
    constructor(private readonly dataSource: DataSource) {
        super(TermsTemplate, dataSource.createEntityManager());
    }
        /**
     * 특정 타입의 최신 활성 약관 조회
     * @param type 약관 타입
     * @returns 최신 약관 템플릿
     */
        async findLatestByType(type: TermsType): Promise<TermsTemplate | null> {
            return await this.findOne({
                where: {
                    type,
                    isActive: true,
                },
                order: {
                    createdAt: 'DESC',
                },
            });
        }
    
        /**
         * 모든 타입의 최신 활성 약관 조회
         * @returns 타입별 최신 약관 템플릿 배열
         */
        async findAllLatestActive(): Promise<TermsTemplate[]> {
            // 각 타입별로 최신 것만 조회
            const allTypes = Object.values(TermsType);
            const latestTerms = await Promise.all(
                allTypes.map(type => this.findLatestByType(type))
            );
            return latestTerms.filter(term => term !== null) as TermsTemplate[];
        }
    
        /**
         * 특정 타입의 최신 약관 조회 (활성화 여부 무관)
         * @param type 약관 타입
         * @returns 최신 약관 템플릿
         */
        async findLatestByTypeIgnoreActive(type: TermsType): Promise<TermsTemplate | null> {
            return await this.findOne({
                where: { type },
                order: {
                    createdAt: 'DESC',
                },
            });
        }
}
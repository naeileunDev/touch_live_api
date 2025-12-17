import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { TermType } from "../enum/term-type.enum";
import { TermTargetCategoryType } from "../enum/term-target-category-type.enum";

@Entity()
export class TermVersion extends BaseEntity {
    @Column({ type: 'varchar', length: 255, comment: '약관 버전(생성 날짜 기준)' })
    version: string;

    @Column({ type: 'varchar', comment: '약관 내용' })
    content: string;

    @Column({ type: 'boolean', comment: '약관 필수 여부' })
    isRequired: boolean;

    @Column({ type: 'enum', enum: TermType, comment: '약관 유형' })
    termType: TermType;

    @Column({ type: 'enum', enum: TermTargetCategoryType, comment: '약관 대상 카테고리' })
    targetCategory: TermTargetCategoryType;

    @Column({ type: 'int', comment: '운영자 아이디' })
    userId: number;
}
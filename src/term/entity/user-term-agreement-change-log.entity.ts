import { Column, Entity } from "typeorm";
import { BaseEntity } from "src/common/base-entity/base.entity";
import { TermType } from "../enum/term-version.enum";

@Entity()
export class UserTermAgreementChangeLog extends BaseEntity {

    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @Column({ type: 'enum', enum: TermType, comment: '약관 타입' })
    termType: TermType;

    @Column({ type: 'boolean', comment: '동의 여부'})
    isAgreed: boolean;;

    @Column({ type: 'int', comment: '약관 버전 ID' })
    termVersionId: number;
}
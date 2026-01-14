import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "src/common/base-entity/base.entity";
import { TermType } from "../enum/term-version.enum";
import { TermVersion } from "./term-version.entity";

@Entity()
export class StoreTermAgreementChangeLog extends BaseEntity {

    @Column({ type: 'int', comment: '스토어 ID' })
    storeId: number;

    @Column({ type: 'enum', enum: TermType, comment: '약관 타입' })
    termType: TermType;

    @Column({ type: 'boolean', comment: '동의 여부'})
    isAgreed: boolean;;

    @Column({ type: 'int', comment: '약관 버전 ID' })
    termVersionId: number;

    @Column({ type: 'int', comment: '스토어 주인ID(User ID)' })
    userId: number;
}
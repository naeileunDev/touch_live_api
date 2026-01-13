import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "src/common/base-entity/base.entity";
import { TermType } from "../enum/term-version.enum";
import { TermVersion } from "./term-version.entity";

@Entity()
export class UserTermAgreementChangeLog extends BaseEntity {

    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @Column({ type: 'enum', enum: TermType, comment: '약관 타입' })
    termType: TermType;

    @Column({ type: 'boolean', comment: '동의 여부'})
    isAgreed: boolean;;

    @ManyToOne(() => TermVersion, termVersion => termVersion.id)
    @JoinColumn({ name: 'termVersionId' })
    termVersion: TermVersion;
}
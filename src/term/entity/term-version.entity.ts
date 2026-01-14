import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { TargetType, TermType } from "../enum/term-version.enum";

@Entity()
export class TermVersion extends BaseEntity {
    @Column({ type: 'int', comment: '운영자 ID(User ID)' })
    operatorId: number;

    @Column({ type: 'enum', enum: TermType, comment: '약관 타입' })
    termType: TermType;

    @Column({ type: 'enum', enum: TargetType, comment: '대상 타입' })
    targetType: TargetType;

    @Column({ type: 'timestamptz',  comment: '약관 버전' })
    version: Date;

    @Column({ type: 'varchar', comment: '약관 내용' })
    content: string;

    @Column({ type: 'boolean', comment: '필수 여부'})
    isRequired: boolean;
}
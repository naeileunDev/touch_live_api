import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { AuditType } from "../enum/audit-type.enum";

@Entity()
export class AuditRequest extends BaseEntity {

    @Column({ type: 'enum', enum: AuditType, comment: '대상 타입' })
    targetType: AuditType;

    @Column({ type: 'int', comment: '대상 로그 ID' })
    targetLogId: number;

    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;
}

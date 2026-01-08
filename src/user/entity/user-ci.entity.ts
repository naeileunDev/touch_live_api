import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity()
export class UserCi extends BaseEntity{
    @Column({ type: 'varchar', length: 255, comment: '사용자 CI', unique: true })
    ci: string;

    @Column({ type: 'uuid', comment: '사용자 공개 식별자', unique: true })
    publicId: string;
}
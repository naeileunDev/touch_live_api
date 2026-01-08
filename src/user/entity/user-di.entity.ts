import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class UserDi extends BaseEntity {
    @Column({ type: 'varchar', length: 255, comment: '사용자 DI', unique: true })
    di: string;

    @Column({ type: 'uuid', comment: '사용자 공개 식별자', unique: true })
    publicId: string;
}
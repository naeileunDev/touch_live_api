import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, JoinColumn, OneToOne, Unique } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";
import { User } from "./user.entity";

@Entity()
export class UserCi extends BaseEntity{
    @Column({ type: 'varchar', length: 255, comment: '사용자 CI', unique: true })
    ci: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
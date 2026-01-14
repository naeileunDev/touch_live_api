import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, OneToOne, Unique } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserDi extends BaseEntity {
    @Column({ type: 'varchar', length: 255, comment: '사용자 DI', unique: true })
    di: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
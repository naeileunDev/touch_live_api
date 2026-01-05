import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserOauthType } from "../enum/user-oauth-type.enum";
import { User } from "./user.entity";
import { BaseEntity } from "src/common/base-entity/base.entity";

@Entity()
export class UserOauth extends BaseEntity {
    @Column({ type: 'enum', enum: UserOauthType, comment: 'SNS 유형' })
    type: UserOauthType;

    @Column({ type: 'varchar', comment: 'SNS User ID' })
    snsUserId: string;

    @Column({ type: 'varchar', comment: '이메일' })
    email: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}
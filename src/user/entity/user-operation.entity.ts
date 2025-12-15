import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { UserRole } from "../enum/user-role.enum";
import { IsIn } from "class-validator";
import { BaseEntity } from "src/common/base-entity/base.entity";

@Entity()
export class UserOperation extends BaseEntity {
    @OneToOne(() => User, user => user.userOperation)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'enum', enum: UserRole, comment: '사용자 권한', default: UserRole.Manager })
    @IsIn([UserRole.Manager])
    role: UserRole;
}
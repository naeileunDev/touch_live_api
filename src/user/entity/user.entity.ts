import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { UserRole } from "../enum/user-role.enum";
import { UserStatus } from "../enum/user-status.enum";

@Entity()
export class User extends BaseEntity {
    @Column({ type: 'enum', enum: UserRole, comment: '사용자 권한' })
    role: UserRole;

    @Column({ type: 'enum', enum: UserStatus, comment: '사용자 상태' })
    status: UserStatus;

    @Column({ type: 'varchar', length: 255, comment: '사용자 로그인 아이디', nullable: true })
    loginId: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 비밀번호', nullable: true })
    password: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 이메일', nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 이름' })
    name: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 전화번호' })
    phone: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 성별' })
    gender: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 생년월일' })
    birth: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 DI' })
    di: string;
}
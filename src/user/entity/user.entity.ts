import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { UserRole } from "../enum/user-role.enum";
import { UserStatus } from "../enum/user-status.enum";
import { UserGender } from "../enum/user-gender.enum";
import { StoreRegisterStatus } from "src/store/enum/store-register-status.enum";

@Entity()
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 255, comment: '사용자 로그인 아이디', unique: true })
    loginId: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 비밀번호'})
    password: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 이메일', nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 20, comment: '닉네임', unique: true })
    nickname: string;
    
    @Column({ type: 'enum', enum: UserRole, comment: '사용자 권한' })
    role: UserRole;

    @Column({ type: 'enum', enum: UserStatus, comment: '사용자 상태' })
    status: UserStatus;

    @Column({ type: 'varchar', length: 255, comment: '사용자 이름' })
    name: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 프로필 이미지', nullable: true })
    profileImage?: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 전화번호' })
    phone: string;

    @Column({ type: 'enum', enum: UserGender, comment: '사용자 성별', default: UserGender.Male })
    gender: UserGender;

    @Column({ type: 'date', comment: '사용자 생년월일' })
    birth: Date;

    @Column({ type: 'varchar', length: 255, comment: '사용자 DI' })
    di: string;

    @Column({ type: 'boolean', comment: '사용자 성인여부' })
    isAdult: boolean;

    @Column({ type: 'enum', enum: StoreRegisterStatus, comment: '사용자 가게 등록 상태', default: null, nullable: true })
    storeRegisterStatus?: StoreRegisterStatus;
}
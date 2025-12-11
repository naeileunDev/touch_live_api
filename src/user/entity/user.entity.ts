import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserStatus } from "../enum/user-status.enum";
import { StoreRegisterStatus } from "src/store/enum/store-register-status.enum";
import { UserCreateDto } from "../dto/user-create.dto";
import { UserSignupSourceData } from "./user-signup-surce-data.entity";
import { UserTermsAgreement } from "./user-terms-agreement.entity";
import { UserAddress } from "./user-address.entity";
import { PaymentMethod } from "src/payment-method/entity/payment-method.entity";
import { Store } from "src/store/entity/store.entity";
import { UserRole } from "../enum/user-role.enum";

@Entity()
export class User extends BaseEntity {
    @Column({ type: 'uuid', comment: '사용자 공개 식별자', unique: true })
    publicId: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 로그인 아이디', unique: true })
    loginId: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 비밀번호'})
    password: string;
    
    //관리자의 경우 이메일 필수 아님
    @Column({ type: 'varchar', length: 255, comment: '사용자 이메일', nullable: true, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 20, comment: '닉네임', unique: true })
    nickname: string;
    
    @Column({ type: 'enum', enum: UserRole, default: UserRole.User, comment: '사용자 권한' })
    role: UserRole;

    @Column({ type: 'enum', enum: UserStatus, comment: '사용자 상태' })
    status: UserStatus;

    @Column({ type: 'varchar', length: 255, comment: '사용자 이름' })
    name: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 프로필 이미지', nullable: true })
    profileImage?: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 전화번호' })
    phone: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 성별' })
    gender: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 생년월일' })
    birth: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 DI' })
    di: string;

    @Column({ type: 'boolean', comment: '사용자 성인여부' })
    isAdult: boolean;

    @Column({ type: 'enum', enum: StoreRegisterStatus, comment: '사용자 가게 등록 상태', nullable: true })
    storeRegisterStatus?: StoreRegisterStatus | null;
    
    @OneToOne(() => UserSignupSourceData, userSignupSourceData => userSignupSourceData.user, {
        nullable: true
    })
    userSignupSourceData: UserSignupSourceData;
    
    @OneToOne(() => UserTermsAgreement, userTermsAgreement => userTermsAgreement.user, {
        nullable: true
    })
    userTermsAgreement: UserTermsAgreement;

    @Column({ type: 'timestamptz', comment: '성인 여부 확인 일시', nullable: true })
    adultCheckAt?: Date;

    @OneToMany(() => UserAddress, userAddress => userAddress.user)
    userAddresses: UserAddress[];

    @OneToMany(() => PaymentMethod, paymentMethod => paymentMethod.user)
    paymentMethods: PaymentMethod[];

    @OneToOne(() => Store, store => store.user)
    @JoinColumn({ name: 'storeId' })
    store?: Store | null;

}
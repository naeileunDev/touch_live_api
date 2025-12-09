import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserRole } from "../enum/user-role.enum";
import { UserStatus } from "../enum/user-status.enum";
import { UserGender } from "../enum/user-gender.enum";
import { StoreRegisterStatus } from "src/store/enum/store-register-status.enum";
import { UserCreateDto } from "../dto/user-create.dto";
import { UserSignupSourceData } from "./user-signup-surce-data.entity";
import { UserTermsAgreement } from "./user-terms-agreement.entity";
import { UserAddress } from "./user-address.entity";
import { PaymentMethod } from "src/payment-method/entity/payment-method.entity";
import { Store } from "src/store/entity/store.entity";

@Entity()
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 255, comment: '사용자 로그인 아이디', unique: true })
    loginId: string;

    @Column({ type: 'varchar', length: 255, comment: '사용자 비밀번호'})
    password: string;
    
    //관리자의 경우 이메일 필수 아님
    @Column({ type: 'varchar', length: 255, comment: '사용자 이메일', nullable: true, unique: true })
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

       /**
     * UserCreateDto로부터 User 엔티티 생성
     * @param userCreateDto 사용자 생성 DTO
     * @returns User 엔티티
     */
       static fromCreateDto(userCreateDto: UserCreateDto): User {
        const user = new User();
        user.loginId = userCreateDto.loginId;
        user.password = userCreateDto.password;
        user.nickname = userCreateDto.nickname;
        user.email = userCreateDto.email;
        user.name = userCreateDto.name;
        user.phone = userCreateDto.phone;
        user.gender = userCreateDto.gender as unknown as UserGender;
        user.birth = new Date(
            userCreateDto.birth.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
        );
        user.di = userCreateDto.di;
        user.status = UserStatus.Active;
        user.role = userCreateDto.role ?? UserRole.User;
        user.isAdult = User.checkAdult(user.birth);
        user.storeRegisterStatus = null;
        return user;
    }

    /**
     * 생년월일로 성인 여부 확인 (1월 1일 기준)
     * @param birth 생년월일
     * @returns 성인 여부
     */
    static checkAdult(birth: Date): boolean {
        const today = new Date();
        const thisYearJan1 = new Date(today.getFullYear(), 0, 1); // 올해 1월 1일
        const birthDate = new Date(birth);
        const adultDate = new Date(birthDate.getFullYear() + 19, birthDate.getMonth(), birthDate.getDate()); // 19세가 되는 날
        
        // 19세가 되는 날이 올해 1월 1일 이전이거나 같으면 성인
        return adultDate <= thisYearJan1;
    }
}
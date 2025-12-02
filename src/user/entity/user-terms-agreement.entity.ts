import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserTermsAgreement extends BaseEntity {
    @OneToOne(() => User, user => user.userTermsAgreement, {
        onDelete: 'CASCADE',  
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    // 필수 약관
    @Column({ type: 'boolean', comment: '이용약관 동의', default: true})
    reqService: boolean;

    @Column({ type: 'boolean', comment: '위치기반 이용약관 동의', default: true })
    reqLocation: boolean;

    @Column({ type: 'boolean', comment: '전자금융거래 이용동의', default: true })
    reqFinance: boolean;

    // 선택 약관
    @Column({ type: 'boolean', comment: '맞춤형 숏폼 콘텐츠 추천', default: false })
    optShortform: boolean;

    @Column({ type: 'timestamptz', comment: '숏폼 동의 변경 일시', nullable: true })
    optShortformAt?: Date;

    @Column({ type: 'boolean', comment: '마케팅 정보 수신 동의', default: false })
    optMarketing: boolean;

    @Column({ type: 'timestamptz', comment: '마케팅 동의 변경 일시', nullable: true })
    optMarketingAt?: Date;

    @Column({ type: 'boolean', comment: '개인정보 제3자 제공 동의', default: false })
    optThirdparty: boolean;

    @Column({ type: 'timestamptz', comment: '제3자 제공 변경 일시', nullable: true })
    optThirdpartyAt?: Date;
}
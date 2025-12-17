import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { StoreStatusType } from "../enum/store-status-type.enum";
import { User } from "src/user/entity/user.entity";

@Entity()
export class Store extends BaseEntity{
    @Column({ type: 'varchar', length: 255, comment: '가게 이름' })
    name: string;

    @Column({ type: 'varchar', length: 255, comment: '가게 전화번호' })
    phone: string;

    @Column({ type: 'varchar', length: 255, comment: '가게 이메일' })
    email: string;


    @Column({ type: 'boolean', comment: '가게 노출 여부', default: false })
    isVisible: boolean;

    @Column({ type: 'varchar', length: 255, comment: '해시태그' })
    hashTag: string;

    @Column({ type: 'varchar', length: 255, comment: '사업자 등록번호' })
    businessRegistrationNumber: string;

    @Column({ type: 'varchar', length: 255, comment: '사업자 등록증 이미지' })
    businessRegistrationImage: string;

    @Column({ type: 'varchar', length: 255, comment: '대표자 이름' })
    ceoName: string;
    
    @Column({ type: 'varchar', length: 255, comment: '업태' })
    businessType: string

    @Column({ type: 'varchar', length: 255, comment: '업종' })
    businessCategory: string;

    @Column({ type: 'varchar', length: 255, comment: '통신판매업 신고번호' })
    eCommerceLicenseNumber: string;

    @Column({ type: 'varchar', length: 255, comment: '통신판매업 신고증 이미지' })
    eCommerceLicenseImage: string;

    @Column({ type: 'varchar', length: 255, comment: '사업자 은행명' })
    bankName: string;
    @Column({ type: 'varchar', length: 255, comment: '사업자 계좌번호' })
    accountNumber: string;
    @Column({ type: 'varchar', length: 255, comment: '사업자 예금주' })
    accountHolder: string;

    @Column({ type: 'enum', enum: StoreStatusType, comment: '가게 상태', default: StoreStatusType.Active })
    status: StoreStatusType;

    @OneToOne(() => User, user => user.store)
    @JoinColumn({ name: 'userId' })
    user: User;
}

import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { StoreStatusType } from "../enum/store-status-type.enum";
import { BaseEntity } from "src/common/base-entity/base.entity";
import { CategoryType } from "src/tag/enum/category-type.enum";
import { User } from "src/user/entities/user.entity";
import { StoreMedia } from "./store-media.entity";

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

    @Column({ type: 'varchar', length: 255, comment: '사업자 등록번호' })
    businessRegistrationNumber: string;

    @Column({ type: 'int', comment: '사업자 등록증 이미지 id' })
    businessRegistrationImageId: number;

    @Column({ type: 'int', comment: '가게 배너 이미지 id', nullable: true })
    storeBannerImageId?: number | null;

    @Column({ type: 'varchar', length: 255, comment: '대표자 이름' })
    ceoName: string;

    @Column({ type: 'varchar', length: 255, comment: '업태' })
    businessType: string;

    @Column({ type: 'varchar', length: 255, comment: '업종' })
    businessCategory: string;

    @Column({ type: 'varchar', length: 255, comment: '통신판매업 신고번호' })
    eCommerceLicenseNumber: string;

    @Column({ type: 'int', comment: '통신판매업 신고증 이미지 id' })
    eCommerceLicenseImageId: number;

    @Column({ type: 'varchar', length: 255, comment: '사업자 은행명' })
    bankName: string;

    @Column({ type: 'varchar', length: 255, comment: '사업자 계좌번호' })
    accountNumber: string;
    
    @Column({ type: 'varchar', length: 255, comment: '사업자 예금주' })
    accountOwner: string;

    @Column({ type: 'int', comment: '사업자 정산계좌 이미지 id' })
    accountImageId: number;

    @Column({ type: 'varchar', array: true, length: 3, comment: '메인태그(3개까지)' })
    mainTags: string[];

    @Column({ type: 'varchar', array: true, length: 5, comment: '최대 서브태그(5개까지)' })
    subTags: string[];

    @Column({ type: 'enum', enum: StoreStatusType, comment: '가게 상태', default: StoreStatusType.Active })
    status: StoreStatusType;

    @OneToOne(() => User, user => user.store)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int', comment: '판매 수수료 비율', default: 11 })
    saleChageRate: number;

    @Column({ type: 'varchar', array: true, comment: '가게 카테고리 리스트 (최대 3개)', default:[]})
    category: CategoryType[];

    @Column({ type: 'varchar', length: 255, comment: '가게 정보' })
    storeInfo: string;

    @Column({ type: 'int', comment: '가게 배너 이미지 id', nullable: true })
    storebannerImageId?: number | null;

    @Column({ type: 'int', comment: '가게 프로필 이미지 id', nullable: true })
    storeProfileImageId?: number | null;

    @OneToMany(() => StoreMedia, storeMedia => storeMedia.store)
    medias: StoreMedia[];
}

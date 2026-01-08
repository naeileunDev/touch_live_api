import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { ProductTargetAge } from "../enum/product-target-age.enum";
import { ProductTargetGender } from "../enum/product-target-gender.enum";

@Entity()
export class Product extends BaseEntity {
    @Column({ type: 'varchar', comment: '상품명' })
    name: string;

    @Column({ type: 'int', comment: '가격' })
    price: number;

    @Column({ type: 'enum', enum: ProductTargetGender, comment: '구매 대상 성별' })
    targetGender: ProductTargetGender;

    @Column({ type: 'enum', enum: ProductTargetAge, comment: '구매 대상 나이' })
    targetAge: ProductTargetAge;

    @Column({ type: 'int', comment: '할인 가격', nullable: true })
    discountValue?: number;

    @Column({ type: 'int', comment: '배송비' })
    deliveryFee: number;

    @Column({ type: 'varchar', comment: '배송 회사' })
    deliveryCompany: string;

    @Column({ type: 'int', comment: '배송 기간' })
    deliveryPeriod: number;

    @Column({ type: 'int', comment: '최대 결제 횟수', nullable: true })
    maxPurchaseLimit: number;

    @Column({ type: 'boolean', default: true, comment: '활성 여부' })
    isActive: boolean;

    @Column({ type: 'boolean', comment: '옵션 여부' })
    isMixed: boolean;

    @Column({ type: 'int', comment: '수수료' })
    charge: number;

    @Column({ type: 'timestamptz', comment: '버전' })
    version: Date;

    @Column({ type: 'int', comment: '제주도 배송비', default: 0 })
    jejuDeliveryFee: number;

    @Column({ type: 'int', comment: '도서산간 배송비', default: 0 })
    islandDeliveryFee: number;



    
}
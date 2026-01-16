import { BaseEntity } from "src/common/base-entity/base.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Product } from "./product.entity";
import { createPublicId } from "src/common/util/public-id.util";

@Entity()
export class ProductFlexible extends BaseEntity {
    @Column({ type: 'int', comment: '재고(단일 옵션시)', nullable: true })
    stock?: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'int', comment: '상품 ID' })
    productId: number;

    @Column({ type: 'int', comment: '가격' })
    price: number;

    @Column({ type: 'int', comment: '할인 가격', nullable: true })
    discountValue?: number;

    @Column({ type: 'int', comment: '배송비' })
    deliveryFee: number;

    @Column({ type: 'varchar', comment: '배송 회사' })
    deliveryCompany: string;

    @Column({ type: 'varchar', comment: '배송 기간' })
    deliveryPeriod: string;

    @Column({ type: 'int', comment: '제주도 배송비', default: 0 })
    jejuDeliveryFee: number;

    @Column({ type: 'int', comment: '도서산간 배송비', default: 0 })
    islandDeliveryFee: number;

    @Column({ type: 'int', comment: '수수료' })
    charge: number;

    @Column({ type: 'timestamptz', comment: '버전', nullable: true })
    version: Date;

    @Column({ type: 'varchar', comment: '상품 상세 고유 ID(PDD_랜덤UUID)' })
    publicId: string;

    @Column({ type: 'boolean', default: true, comment: '활성 여부' })
    isActive: boolean;

    @BeforeInsert()
    createPublicId() {
        this.publicId = createPublicId('PDD');
    }



}
import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { ProductOptionDetail } from "./product-option-detail.entity";

@Entity()
export class ProductOptionDetailStock extends BaseEntity {
    @Column({ type: 'int', comment: '재고' })
    stock: number;

    @Column({ type: 'int', comment: '추가 요금' })
    extraFee: number;

    @Column({ type: 'int', comment: '상품 옵션 상세 ID' })
    detailId: number;

    @ManyToOne(() => ProductOptionDetail)
    @JoinColumn({ name: 'detailId' })
    productOptionDetail: ProductOptionDetail;
}
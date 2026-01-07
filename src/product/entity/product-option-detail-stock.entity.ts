import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ProductOptionDetail } from "./product-option-detail.entity";

@Entity()
export class ProductOptionDetailStock extends BaseEntity {
    @Column({ type: 'int', comment: '재고' })
    stock: number;

    @ManyToOne(() => ProductOptionDetail)
    @JoinColumn({ name: 'productOptionDetailId' })
    productOptionDetail: ProductOptionDetail;
}
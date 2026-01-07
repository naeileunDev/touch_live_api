import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductOption extends BaseEntity {
    @Column({ type: 'varchar', comment: '옵션명' })
    name: string;

    @Column({ type: 'boolean', default: true, comment: '옵션 활성 여부' })
    isActive: boolean;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;
}
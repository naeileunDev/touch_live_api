import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ProductOption } from "./product-option.entity";

@Entity()
export class ProductOptionDetail extends BaseEntity {
    @Column({ type: 'varchar', comment: '옵션 상세명' })
    name: string;

    @Column({ type: 'boolean', default: true, comment: '옵션 상세 활성 여부' })
    isActive: boolean;

    @Column({ type: 'timestamptz', comment: '버전' })
    version: Date;

    @ManyToOne(() => ProductOption)
    @JoinColumn({ name: 'productOptionId' })
    productOption: ProductOption;
}
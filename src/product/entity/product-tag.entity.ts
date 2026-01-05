import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Product } from "./product.entity";
import { Tag } from "src/tag/entity/tag.entity";

@Entity('product_tag')
@Unique(['productId', 'tagId'])
export class ProductTag extends BaseEntity {
    @Column({ type: 'int', comment: '제품 ID' })
    productId: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'int', comment: '태그 ID' })
    tagId: number;

    @ManyToOne(() => Tag)
    @JoinColumn({ name: 'tagId' })
    tag: Tag;

    @Column({ type: 'int', comment: '순서', default: 0 })
    displayOrder: number;
}

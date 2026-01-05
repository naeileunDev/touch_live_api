import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { ShortForm } from "./short-form.entity";
import { Product } from "src/product/entity/product.entity";

@Entity('short_form_product_tag')
@Unique(['shortFormId', 'productId'])
export class ShortFormProductTag extends BaseEntity {
    @Column({ type: 'int', comment: '숏폼 ID' })
    shortFormId: number;

    @ManyToOne(() => ShortForm, (shortForm) => shortForm.productTags)
    @JoinColumn({ name: 'shortFormId' })
    shortForm: ShortForm;

    @Column({ type: 'int', comment: '상품 ID' })
    productId: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'int', comment: '순서', default: 0 })
    displayOrder: number;
}

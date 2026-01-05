import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { ProductItemType } from "src/common/enums";

@Entity('product_required_info')
export class ProductRequiredInfo extends BaseEntity {
    @Column({ type: 'int', comment: '제품 ID' })
    productId: number;

    @ManyToOne(() => Product, (product) => product.requiredInfos)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'enum', enum: ProductItemType, comment: '품목 타입' })
    itemType: ProductItemType;

    @Column({ type: 'varchar', length: 100, comment: '표기 정보명' })
    infoName: string;

    @Column({ type: 'varchar', length: 500, comment: '표기 정보 내용' })
    infoValue: string;

    @Column({ type: 'int', comment: '순서', default: 0 })
    displayOrder: number;
}

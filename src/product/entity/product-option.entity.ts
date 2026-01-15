import { BaseEntity } from "src/common/base-entity/base.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { createPublicId } from "src/common/util/public-id.util";

@Entity()
export class ProductOption extends BaseEntity {
    @Column({ type: 'varchar', comment: '옵션명' })
    name: string;

    @Column({ type: 'boolean', default: true, comment: '옵션 활성 여부' })
    isActive: boolean;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'timestamptz', comment: '버전' })
    version: Date;

    @Column({ type: 'varchar', comment: '옵션 고유 ID(PO_랜덤UUID)' })
    publicId: string;

    @BeforeInsert()
    createPublicId() {
        this.publicId = createPublicId('PO');
    }
}
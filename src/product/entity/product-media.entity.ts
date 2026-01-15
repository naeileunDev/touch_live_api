import { Column, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "src/common/base-entity/base.entity";
import { Entity } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductMedia extends BaseEntity {

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;
    
    @Column({ type: 'int', comment: '썸네일이미지 ID' })
    thumbnailId: number;

    @Column({ type: 'int', array: true, comment: '상품정보이미지 ID', nullable: true })
    infoIds: number[];

    @Column({ type: 'int', array: true, comment: '상품 상세 이미지 ID(최대 10개)' })
    detailIds: number[];

    @Column({ type: 'boolean', comment: '활성 여부' })
    isActive: boolean;

    @Column({ type: 'timestamptz', comment: '버전' })
    version: Date;
}
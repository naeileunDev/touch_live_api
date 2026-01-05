import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { File } from "src/file/entities/file.entity";

@Entity('product_option')
export class ProductOption extends BaseEntity {
    @Column({ type: 'int', comment: '제품 ID' })
    productId: number;

    @ManyToOne(() => Product, (product) => product.options)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'int', comment: '옵션 이미지 파일 ID', nullable: true })
    imageFileId?: number;

    @ManyToOne(() => File, { nullable: true })
    @JoinColumn({ name: 'imageFileId' })
    imageFile?: File;

    @Column({ type: 'varchar', length: 200, comment: '옵션명 (예: 블랙 / M)' })
    name: string;

    @Column({ type: 'int', comment: '재고 수량' })
    stock: number;

    @Column({ type: 'int', comment: '추가 가격', default: 0 })
    additionalPrice: number;

    @Column({ type: 'int', comment: '순서', default: 0 })
    displayOrder: number;

    @Column({ type: 'boolean', comment: '판매 가능 여부', default: true })
    isAvailable: boolean;
}

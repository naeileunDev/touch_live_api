import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { File } from "src/file/entity/file.entity";

@Entity('product_image')
export class ProductImage extends BaseEntity {
    @Column({ type: 'int', comment: '제품 ID' })
    productId: number;

    @ManyToOne(() => Product, (product) => product.images)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'int', comment: '파일 ID' })
    fileId: number;

    @ManyToOne(() => File)
    @JoinColumn({ name: 'fileId' })
    file: File;

    @Column({ type: 'varchar', length: 20, comment: '이미지 타입 (DETAIL: 상세, INFO: 상세정보)' })
    imageType: string;

    @Column({ type: 'int', comment: '순서', default: 0 })
    displayOrder: number;
}

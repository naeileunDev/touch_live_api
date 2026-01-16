import { BaseEntity } from "src/common/base-entity/base.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { createPublicId } from "src/common/util/public-id.util";
import { File } from "src/file/entity/file.entity";
import { Product } from "./product.entity";

@Entity()
export class ProductOptionDetail extends BaseEntity {
    @Column({ type: 'varchar', comment: '옵션 상세명' })
    name: string;

    @Column({ type: 'boolean', default: true, comment: '옵션 상세 활성 여부' })
    isActive: boolean;

    @Column({ type: 'timestamptz', comment: '버전', nullable: true })
    version: Date;

    @Column({ type: 'int', comment: '옵션 상세 이미지 ID' })
    fileId: number;

    @OneToOne(() => File)
    @JoinColumn({ name: 'fileId' })
    file: File;

    @Column({ type: 'varchar', comment: '옵션 상세 고유 ID(POD_랜덤UUID)' })
    publicId: string;

    @Column({ type: 'int', comment: '상품 ID' })
    productId: number;
    
    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'boolean', comment: '단일 옵션 여부', default: true})
    isMixed: boolean;

    @BeforeInsert()
    createPublicId() {
        this.publicId = createPublicId('POD');
    }
}
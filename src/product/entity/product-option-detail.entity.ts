import { BaseEntity } from "src/common/base-entity/base.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ProductOption } from "./product-option.entity";
import { createPublicId } from "src/common/util/public-id.util";

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

    @Column({ type: 'varchar', comment: '옵션 상세 이미지 URL' })
    imgUrl: string;

    @Column({ type: 'varchar', comment: '옵션 상세 고유 ID(POD_랜덤UUID)' })
    publicId: string;

    @BeforeInsert()
    createPublicId() {
        this.publicId = createPublicId('POD');
    }
}
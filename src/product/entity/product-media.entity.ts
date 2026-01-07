import { Column } from "typeorm";
import { BaseEntity } from "src/common/base-entity/base.entity";
import { Entity } from "typeorm";
import { ProductMediaCategory } from "../enum/product-media-category.enum";
import { ProductMediaType } from "../enum/product-media-type.enum";

@Entity()
export class ProductMedia extends BaseEntity {
    @Column({ type: 'enum', enum: ProductMediaCategory, comment: '미디어 카테고리' })
    category: ProductMediaCategory;

    @Column({ type: 'enum', enum: ProductMediaType, comment: '미디어 타입' })
    type: ProductMediaType;

    @Column({ type: 'int', comment: '순서' })
    order: number;

    @Column({ type: 'boolean', comment: '메인 이미지 여부' })
    isMain: boolean;

    @Column({ type: 'boolean', comment: '썸네일 이미지 여부' })
    isThumbnail: boolean;

    @Column({ type: 'boolean', comment: '상세 이미지 여부' })
    isDetail: boolean;

    @Column({ type: 'boolean', comment: '화이트 배경 여부' })
    isWhite: boolean;
}
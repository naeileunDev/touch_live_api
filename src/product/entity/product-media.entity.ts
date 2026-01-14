import { Column } from "typeorm";
import { BaseEntity } from "src/common/base-entity/base.entity";
import { Entity } from "typeorm";

@Entity()
export class ProductMedia extends BaseEntity {
    
    @Column({ type: 'int', comment: '상품 ID' })
    productId: number;

    @Column({type: 'uuid', comment: '상품 고유 ID'})
    publicId: string;

    @Column({ type: 'int', comment: '썸네일 ID' })
    thumbnailId: number;

    @Column({ type: 'int', comment: '정보 ID' })
    infoId: number;

    @Column({ type: 'int', array: true, comment: '상세 ID(최대 10개)' })
    detailIds: number[];
}
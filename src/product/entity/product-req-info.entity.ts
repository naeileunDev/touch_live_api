import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class ProductReqInfo extends BaseEntity {
    @Column({ type: 'varchar', comment: '상품 분류 이름' })
    title: string;

    @Column({ type: 'varchar', array: true, comment: '상품 분류 속성 리스트' })
    itemList: string[];
}
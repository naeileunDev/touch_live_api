import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class ProductOptionDetailStock extends BaseEntity {
    @Column({ type: 'int', comment: '재고' })
    stock: number;

    @Column({ type: 'int', comment: '옵션 상세 ID' })
    detailId: number;
}
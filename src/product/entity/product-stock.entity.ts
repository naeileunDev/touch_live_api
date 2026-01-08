import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class ProductStock extends BaseEntity {
    @Column({ type: 'int', comment: '재고' })
    stock: number;
}
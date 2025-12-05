import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Product extends BaseEntity {
    @Column({ type: 'varchar', length: 255, comment: '상품명' })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, comment: '가격' })
    price: number;
}
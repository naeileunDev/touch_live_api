import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import { OrderProduct } from "./order-product.entity";

@Entity()
export class OrderProductOption extends BaseEntity {

    @ManyToOne(() => OrderProduct, (orderProduct) => orderProduct.orderProductOptions)
    @JoinColumn({ name: 'orderProductId' })
    orderProduct: OrderProduct;

    @Column({ type: 'int', comment: '상품 옵션 상세 ID' })
    productOptionDetailId: number;

    @Column({ type: 'int', comment: '옵션 수량' })
    quantity: number;

    @Column({ type: 'int', comment: '옵션 가격' })
    price: number;
}
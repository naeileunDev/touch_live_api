import { BaseEntity, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/product/entity/product.entity";

@Entity('order_product')
export class OrderProduct extends BaseEntity {
    @OneToOne(() => Order)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;
}
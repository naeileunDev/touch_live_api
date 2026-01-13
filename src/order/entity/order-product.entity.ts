import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Order } from "./order.entity";
import { OrderProductStatus } from "../enum/order-product-status.enum";
import { DecisionStatus } from "../enum/decision-status.enum";
import { BaseEntity } from "src/common/base-entity/base.entity";
import { OrderProductOption } from "./order-product-option.entity";

@Entity()
export class OrderProduct extends BaseEntity {
    @ManyToOne(() => Order)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ type: 'int', comment: '상품 ID' })
    productId: number;

    @Column({ type: 'int', comment: '수량' })
    quantity: number;

    @Column({ type: 'int', comment: '상품 가격' })
    price: number;

    @Column({ type: 'varchar', comment: '상품 이미지 URL' })
    productImageUrl: string;

    @Column({ type: 'timestamptz', comment: '상품 버전' })
    productVersion: Date;

    @Column({ type: 'int', comment: '할인 가격' })
    discountFee: number;

    @Column({ type: 'int', comment: '결제 가격' })
    paymentFee: number;

    @Column({ type: 'enum', enum: OrderProductStatus, comment: '상품 상태', default: OrderProductStatus.Pending })
    status: OrderProductStatus;

    @Column({ type: 'enum', enum: DecisionStatus, comment: '소비자 선택 상태', nullable: true })
    decisionStatus?: DecisionStatus;

    @OneToMany(() => OrderProductOption, (orderProductOption) => orderProductOption.orderProduct)
    orderProductOptions: OrderProductOption[];

    @Column({ type: 'int', comment: '스토어 ID' })
    storeId: number;
}
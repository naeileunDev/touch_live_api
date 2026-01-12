import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PaymentType } from "../enum/payment-type.enum";
import { Order } from "src/order/entity/order.entity";

@Entity()
export class PaymentInformation extends BaseEntity {
    @Column({ type: 'int', comment: '결제 가격' })
    paymentFee: number;

    @Column({ type: 'enum', enum: PaymentType, comment: '결제 타입' })
    type: PaymentType;

    @Column({ type: 'int', comment: '주문 ID', nullable: true })
    orderId: number;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ type: 'int', comment: '사용 포인트', nullable: true })
    usePoint: number;
}
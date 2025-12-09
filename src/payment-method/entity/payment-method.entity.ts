import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PaymentMethodType } from "../enum/payment-method-type.enum";
import { PaymentMethodStatusType } from "../enum/payment-method-status-type.enum";
import { User } from "src/user/entity/user.entity";

@Entity()
export class PaymentMethod extends BaseEntity {
    @Column({ type: 'enum', enum: PaymentMethodType, comment: '결제 방법 타입' })
    methodType: PaymentMethodType;

    @Column({type:'boolean', comment: '기본 결제 수단 여부', default: false })
    isDefault: boolean;

    @Column({type:'enum', enum: PaymentMethodStatusType, comment: '결제 수단 상태' })
    status: PaymentMethodStatusType;

    @Column({type:'varchar', length: 255, comment: 'PG 제공자', nullable: true})
    pgProvider?: string;

    @Column({type:'varchar', length: 255, comment: '카드 번호', nullable: true})
    cardNumberMasked?: string;

    @Column({type:'varchar', length: 255, comment: '카드 브랜드', nullable: true})
    cardBrand?: string;

    @Column({type:'int', comment: '카드 만료 월', nullable: true})
    expiryMonth?: number;

    @Column({type:'int', comment: '카드 만료 년', nullable: true})
    expiryYear?: number;

    @Column({type:'varchar', length: 255, comment: '토큰', nullable: true})
    token?: string;

    @Column({type:'varchar', length: 255, comment: '토큰 타입', nullable: true})
    tokenType?: string;

    @ManyToOne(() => User, user => user.paymentMethods)
    @JoinColumn({ name: 'userId' })
    user: User;
}
import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { DiscountType } from "../enum/coupon.enum";
import { CategoryType } from "src/tag/enum/category-type.enum";

@Entity()
export class Coupon extends BaseEntity {
    @Column({ type: 'int', comment: '쿠폰 재고' })
    stock: number;

    @Column({ type: 'enum', enum: DiscountType, comment: '할인 타입' })
    discountType: DiscountType;

    @Column({ type: 'enum', enum: CategoryType, comment: '쿠폰 타입', nullable: true })
    category: CategoryType;

    @Column({ type: 'int', comment: '할인 금액', nullable: true })
    amount: number;

    @Column({ type: 'int', comment: '쿠폰 사용 가능 최소 금액', nullable: true })
    minOrderAmount: number;

    @Column({ type: 'int', comment: '쿠폰 할인 최대 금액(퍼센트 쿠폰용)', nullable: true })
    maxDiscountAmount: number;

    @Column({ type: 'timestamptz', comment: '쿠폰 만료 일시', nullable: true })
    issuableUntil: Date;

    @Column({ type: 'int', comment: '쿠폰 유효 일수', nullable: true })
    validDays: number;
}
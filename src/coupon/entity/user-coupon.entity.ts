import { BaseEntity } from "src/common/base-entity/base.entity";
import { CategoryType } from "src/tag/enum/category-type.enum";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DiscountType } from "../enum/coupon.enum";

@Entity()
export class UserCoupon extends BaseEntity {
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int', comment: '쿠폰 ID' })
    couponId: number;

    @Column({ type: 'varchar', comment: '쿠폰 번호' })
    couponNo: string;
    
    @Column({ type: 'boolean', comment: '사용 여부', default: false })
    isUsed: boolean;

    @Column({ type: 'enum', enum: CategoryType, comment: '쿠폰 타입', nullable: true })
    category: CategoryType;

    @Column({ type: 'int', comment: '쿠폰 사용 가능 최소 금액', nullable: true })
    minOrderAmount: number;

    @Column({ type: 'int', comment: '쿠폰 할인 최대 금액(퍼센트 쿠폰용)', nullable: true })
    maxDiscountAmount: number;

    @Column({ type: 'int', comment: '쿠폰 유효 일수', nullable: true })
    validDays: number;

    @Column({ type: 'int', comment: '할인 금액 또는 퍼센트', nullable: true })
    amount: number;

    @Column({ type: 'enum', enum: DiscountType, comment: '할인 타입', nullable: true })
    discountType: DiscountType;

    @Column({ type: 'timestamptz', comment: '쿠폰 사용 만료 일시', nullable: true })
    expiresAt: Date;
}
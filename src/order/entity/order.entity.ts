import { BaseEntity } from "src/common/base-entity/base.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Order extends BaseEntity {

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', length: 100, comment: '주문 번호(임의로 만든 사용자 노출번호)' })
    orderNo: string;

    @Column({ type: 'boolean', comment: '사용자 숨김 여부', default: false })
    isUserHidden: boolean;


}
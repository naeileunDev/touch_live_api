import { BaseEntity } from "src/common/base-entity/base.entity";
import { Store } from "src/store/entity/store.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

@Entity()
@Unique(['followerId', 'storeId'])
export class StoreFollow extends BaseEntity {
    @Column({ type: 'int', comment: '팔로워 ID' })
    followerId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'followerId' })
    follower: User;

    @Column({ type: 'int', comment: '스토어 ID' })
    storeId: number;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'storeId' })
    store: Store;
    followersCount: number;
}

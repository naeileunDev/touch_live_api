import { BaseEntity } from "src/common/base-entity/base.entity";
import { Store } from "src/store/entity/store.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

@Entity()
@Unique(['followerId', 'storeId'])
export class StoreFollow extends BaseEntity {
    @Column({ type: 'int', comment: '팔로워 ID' })
    followerId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followerId' })
    follower: User;

    @Column({ type: 'int', comment: '스토어 ID' })
    storeId: number;

    @ManyToOne(() => Store, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    store: Store;
    followersCount: number;
}

import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique, Check } from "typeorm";
import { User } from "src/user/entity/user.entity";

@Entity('user_follow')
@Unique(['followerId', 'followingId'])
@Check('"followerId" != "followingId"')
export class UserFollow extends BaseEntity {
    @Column({ type: 'int', comment: '팔로워 ID' })
    followerId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'followerId' })
    follower: User;

    @Column({ type: 'int', comment: '팔로잉 ID' })
    followingId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'followingId' })
    following: User;
}

import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique, Check } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Review } from "src/review/entity/review.entity";

@Entity()
@Unique(['userId', 'reviewId'])
export class ReviewLike extends BaseEntity {
    @Column({ type: 'int', comment: '유저 ID' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int', comment: '리뷰 ID' })
    reviewId: number;

    @ManyToOne(() => Review, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reviewId' })
    review: Review;
}

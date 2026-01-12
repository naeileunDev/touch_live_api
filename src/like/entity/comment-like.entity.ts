import { BaseEntity } from "src/common/base-entity/base.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Comment } from "src/comment/entity/comment.entity";

@Entity()
@Unique(['userId', 'commentId'])
export class CommentLike extends BaseEntity {
    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int', comment: '댓글 ID' })
    commentId: number;
    
    @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'commentId' })
    comment: Comment;

    @Column({ type: 'boolean', comment: '타겟 숏폼 여부', default: false })
    isShortForm: boolean;
    
    @Column({ type: 'int', comment: '타겟 ID' })
    targetId: number;
}
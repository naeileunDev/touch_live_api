import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { VideoTargetType } from "src/common/enums";

// 영상 시청 기록
@Entity('video_view_log')
export class VideoViewLog extends BaseEntity {
    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'enum', enum: VideoTargetType, comment: '대상 타입' })
    targetType: VideoTargetType;

    @Column({ type: 'int', comment: '대상 ID' })
    targetId: number;

    @Column({ type: 'int', comment: '시청 시간(초)', default: 0 })
    watchDuration: number;

    @Column({ type: 'boolean', comment: '완료 여부', default: false })
    isCompleted: boolean;
}

// 영상 좋아요
@Entity('video_like')
@Unique(['userId', 'targetType', 'targetId'])
export class VideoLike extends BaseEntity {
    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'enum', enum: VideoTargetType, comment: '대상 타입' })
    targetType: VideoTargetType;

    @Column({ type: 'int', comment: '대상 ID' })
    targetId: number;
}

// 영상 댓글 (대댓글 없음)
@Entity('video_comment')
export class VideoComment extends BaseEntity {
    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'enum', enum: VideoTargetType, comment: '대상 타입' })
    targetType: VideoTargetType;

    @Column({ type: 'int', comment: '대상 ID' })
    targetId: number;

    @Column({ type: 'varchar', length: 500, comment: '댓글 내용' })
    content: string;

    @Column({ type: 'int', comment: '좋아요 수', default: 0 })
    likeCount: number;
}

// 댓글 좋아요
@Entity('video_comment_like')
@Unique(['userId', 'commentId'])
export class VideoCommentLike extends BaseEntity {
    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int', comment: '댓글 ID' })
    commentId: number;

    @ManyToOne(() => VideoComment)
    @JoinColumn({ name: 'commentId' })
    comment: VideoComment;
}

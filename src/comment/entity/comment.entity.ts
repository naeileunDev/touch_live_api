import { BaseEntity } from "src/common/base-entity/base.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Comment extends BaseEntity {

    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', length: 500, comment: '댓글 내용' })
    content: string;

    @Column({ type: 'int', comment: '좋아요 수', default: 0 })
    likeCount: number;

    @Column({ type: 'boolean', comment: '타겟 숏폼 여부' })
    isShortForm: boolean;

    @Column({ type: 'int', comment: '타겟 ID' })
    targetId: number;
}
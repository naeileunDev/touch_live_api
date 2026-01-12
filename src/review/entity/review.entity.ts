import { BaseEntity } from "src/common/base-entity/base.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

@Entity()
@Unique(['userId', 'orderProductId'])
export class Review extends BaseEntity {
    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int', comment: '썸네일 파일 ID' })
    thumbnailId: number;

    @Column({ type: 'int', comment: '영상 파일 ID' })
    videoId: number;

    @Column({ type: 'int', comment: '주문 상품 ID' })
    orderProductId: number;

    @Column({ type: 'varchar', length: 100, comment: '제목' })
    title: string;

    @Column({ type: 'varchar', length: 255, comment: '태그 배열' })
    tags: string[];
}
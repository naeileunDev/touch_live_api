import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { SearchType } from "src/common/enums";

@Entity('search_history')
export class SearchHistory extends BaseEntity {
    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'enum', enum: SearchType, comment: '검색 타입' })
    searchType: SearchType;

    @Column({ type: 'varchar', length: 100, comment: '검색어' })
    keyword: string;

    @Column({ type: 'int', comment: '클릭한 결과 ID', nullable: true })
    clickedResultId?: number;
}

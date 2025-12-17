import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { UsageType } from "../enum/usage-type.enum";
import { CategoryType } from "../enum/category-type.enum";

@Entity()
export class Keyword extends BaseEntity {
    @Column({ type: 'varchar', length: 30, comment: '키워드 이름' })
    name: string;

    @Column({ type: 'enum', enum: UsageType, comment: '키워드 사용 타입' })
    usage: UsageType;

    @Column({ type: 'enum', enum: CategoryType, comment: '키워드 카테고리 타입' })
    category: CategoryType;
}
import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { UsageType } from "../enum/usage-type.enum";

@Entity()
export class TagUsageLog extends BaseEntity {
    @Column({ type: 'boolean', comment: '태그 노출 여부(false시 미활성화, 노출x', default: true })
    isVisible: boolean;

    @Column({ type: 'enum', enum: UsageType, comment: '태그 사용 타입(가게, 상품, 리뷰)' })
    usageType: UsageType;

    @Column({ type: 'int', comment: '태그 사용 콘텐츠 id' })
    contentId: number;

    @Column({ type: 'varchar', length: 30, comment: '사용된 태그 이름' })
    tagName: string;
}
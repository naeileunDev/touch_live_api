import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree('materialized-path') // 트리 구조를 위한 설정
export class ProductCategory extends BaseEntity {
    @Column({ type: 'varchar', comment: '카테고리명' })
    name: string;

    @Column({ type: 'int', comment: '순서' })
    order: number;

    @TreeParent()
    upperCategory: ProductCategory; // 상위 카테고리 (재귀적 관계)

    @TreeChildren()
    subCategories: ProductCategory[]; // 하위 카테고리들 (트리 구조를 위한 필드)
}
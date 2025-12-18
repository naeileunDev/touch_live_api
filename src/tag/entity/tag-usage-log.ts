import { BaseEntity } from "src/common/base-entity/base.entity";
import { Product } from "src/product/entity/product.entity";
import { Store } from "src/store/entity/store.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class TagUsageLog extends BaseEntity {
    @Column({ type: 'boolean', comment: '메인 태그 여부', default: false })
    isMain: boolean;
    @Column({ type: 'boolean', comment: '서브 태그 여부', default: false })
    isSub: boolean;

    // @OneToMany(() => Store, store => store.tagUsageLog, {
    //     onDelete: 'CASCADE',
    // })
    // store: Store[];

    // @OneToMany(() => Product, product => product.tagUsageLog)
    // products: Product[];

    // @OneToMany(() => Review, review => review.tagUsageLog)
    // reviews: Review[];

}
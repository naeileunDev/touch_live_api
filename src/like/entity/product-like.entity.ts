import { BaseEntity } from "src/common/base-entity/base.entity";
import { Product } from "src/product/entity/product.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

@Entity()
@Unique(['userId', 'product'])
export class ProductLike extends BaseEntity {
    @Column({ type: 'int', comment: '유저 ID' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int', comment: '상품 ID' })
    productId: number;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;
}

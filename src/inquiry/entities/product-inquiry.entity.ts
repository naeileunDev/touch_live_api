import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Product } from "src/product/entities/product.entity";
import { ProductInquiryAnswer } from "./product-inquiry-answer.entity";

@Entity('product_inquiry')
export class ProductInquiry extends BaseEntity {
    @Column({ type: 'int', comment: '상품 ID' })
    productId: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'int', comment: '사용자 ID' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', length: 100, comment: '문의 제목' })
    title: string;

    @Column({ type: 'varchar', length: 1000, comment: '문의 내용' })
    content: string;

    @Column({ type: 'boolean', comment: '비밀글 여부', default: false })
    isSecret: boolean;

    @Column({ type: 'boolean', comment: '답변 완료 여부', default: false })
    isAnswered: boolean;

    @OneToOne(() => ProductInquiryAnswer, (answer) => answer.inquiry)
    answer?: ProductInquiryAnswer;
}

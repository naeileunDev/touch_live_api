import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Store } from "src/store/entities/store.entity";
import { ProductInquiry } from "./product-inquiry.entity";

@Entity('product_inquiry_answer')
export class ProductInquiryAnswer extends BaseEntity {
    @Column({ type: 'int', comment: '문의 ID' })
    inquiryId: number;

    @OneToOne(() => ProductInquiry, (inquiry) => inquiry.answer)
    @JoinColumn({ name: 'inquiryId' })
    inquiry: ProductInquiry;

    @Column({ type: 'int', comment: '스토어 ID' })
    storeId: number;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'storeId' })
    store: Store;

    @Column({ type: 'varchar', length: 1000, comment: '답변 내용' })
    content: string;
}

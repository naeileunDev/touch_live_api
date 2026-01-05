import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Store } from "src/store/entity/store.entity";
import { File } from "src/file/entity/file.entity";
import { ProductCategory, GenderType, AgeType, ProductOptionType, ProductStatus, UploadType } from "src/common/enums";
import { ProductImage } from "./product-image.entity";
import { ProductOption } from "./product-option.entity";
import { ProductRequiredInfo } from "./product-required-info.entity";

@Entity('product')
export class Product extends BaseEntity {
    @Column({ type: 'int', comment: '스토어 ID' })
    storeId: number;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'storeId' })
    store: Store;

    @Column({ type: 'int', comment: '썸네일 파일 ID' })
    thumbnailFileId: number;

    @ManyToOne(() => File)
    @JoinColumn({ name: 'thumbnailFileId' })
    thumbnailFile: File;

    @Column({ type: 'varchar', length: 200, comment: '제품명' })
    name: string;

    @Column({ type: 'enum', enum: ProductCategory, comment: '카테고리' })
    category: ProductCategory;

    @Column({ type: 'int', comment: '제품 가격' })
    price: number;

    @Column({ type: 'int', comment: '할인율 (%)', default: 0 })
    discountRate: number;

    @Column({ type: 'int', comment: '최종 판매가' })
    salePrice: number;

    @Column({ type: 'enum', enum: ProductOptionType, comment: '옵션 타입', default: ProductOptionType.Single })
    optionType: ProductOptionType;

    @Column({ type: 'int', comment: '재고 (단일 옵션일 때)', nullable: true })
    stock?: number;

    @Column({ type: 'enum', enum: GenderType, comment: '성별', default: GenderType.Unisex })
    gender: GenderType;

    @Column({ type: 'enum', enum: AgeType, comment: '연령', default: AgeType.All })
    age: AgeType;

    @Column({ type: 'int', comment: '기본 배송비', default: 0 })
    deliveryFee: number;

    @Column({ type: 'int', comment: '제주도 배송비', default: 0 })
    jejuDeliveryFee: number;

    @Column({ type: 'int', comment: '도서산간 배송비', default: 0 })
    islandDeliveryFee: number;

    @Column({ type: 'varchar', length: 100, comment: '택배사', nullable: true })
    deliveryCompany?: string;

    @Column({ type: 'varchar', length: 100, comment: '배송 기간', nullable: true })
    deliveryPeriod?: string;

    @Column({ type: 'enum', enum: ProductStatus, comment: '상품 상태', default: ProductStatus.Pending })
    status: ProductStatus;

    @Column({ type: 'enum', enum: UploadType, comment: '업로드 타입', default: UploadType.Normal })
    uploadType: UploadType;

    @Column({ type: 'timestamptz', comment: '승인일', nullable: true })
    approvedAt?: Date;

    @Column({ type: 'int', comment: '조회수', default: 0 })
    viewCount: number;

    @Column({ type: 'int', comment: '좋아요 수', default: 0 })
    likeCount: number;

    @Column({ type: 'int', comment: '리뷰 수', default: 0 })
    reviewCount: number;

    @Column({ type: 'float', comment: '평균 별점', default: 0 })
    avgRating: number;

    @OneToMany(() => ProductImage, (image) => image.product)
    images: ProductImage[];

    @OneToMany(() => ProductOption, (option) => option.product)
    options: ProductOption[];

    @OneToMany(() => ProductRequiredInfo, (info) => info.product)
    requiredInfos: ProductRequiredInfo[];
}

import { BaseEntity } from "src/common/base-entity/base.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Store } from "src/store/entity/store.entity";
import { createPublicId } from "src/common/util/public-id.util";
import { AuditStatus, UploadType } from "src/common/enums";

@Entity()
export class Product extends BaseEntity {

    @Column({ type: 'int', comment: '최대 결제 횟수', nullable: true })
    maxPurchaseLimit: number;

    @Column({ type: 'int', comment: '등록 비용', nullable: true })
    registerFee: number;

    @Column({ type: 'enum', enum: UploadType, comment: '업로드 타입' })
    uploadType: UploadType;

    @Column({ type: 'timestamptz', comment: '결제 완료 날짜', nullable: true })
    payedAt?: Date | null;

    @Column({ type: 'boolean', default: true, comment: '활성 여부' })
    isActive: boolean;

    @Column({ type: 'boolean', comment: '옵션 여부' })
    isMixed: boolean;

    @Column({ type: 'timestamptz', comment: '버전' })
    version: Date;

    @Column({ type: 'int', comment: '스토어 ID' })
    storeId: number;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'storeId' })
    store: Store;

    @Column({ type: 'varchar', comment: '상품 고유 ID(P_랜덤UUID)' })
    publicId: string;

    @Column({ type: 'boolean', comment: '승인 여부', default: false })
    isApproved: boolean;

    @Column({ type: 'enum', enum: AuditStatus, comment: '심사 상태', default: AuditStatus.Pending })
    auditStatus: AuditStatus;

    @Column({ type: 'varchar', comment: '심사 코멘트', nullable: true })
    auditComment?: string | null;

    @BeforeInsert()
    createPublicId() {
        this.publicId = createPublicId('P');
    }

}
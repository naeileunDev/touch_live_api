import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { CategoryType } from "src/tag/enum/category-type.enum";
import { StoreRegisterStatus } from "../enum/store-register-status.enum";
import { BaseEntity } from "src/common/base-entity/base.entity";
import { AuditStatus } from "src/common/enums";

@Entity()
export class StoreRegisterLog extends BaseEntity {
    @ManyToOne(() => User, user => user.storeRegisterLog)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', length: 255, comment: '가게 이름' })
    name: string;

    @Column({ type: 'varchar', length: 255, comment: '가게 전화번호' })
    phone: string;

    @Column({ type: 'varchar', length: 255, comment: '가게 이메일' })
    email: string;

    @Column({ type: 'varchar', length: 255, comment: '가게 정보' })
    storeInfo: string;

    @Column({ type: 'varchar', length: 255, comment: '사업자 등록번호' })
    businessRegistrationNumber: string;

    @Column({ type: 'int', comment: '사업자 등록증 이미지 id' })
    businessRegistrationImageId: number;

    @Column({ type: 'varchar', length: 255, comment: '대표자 이름' })
    ceoName: string;

    @Column({ type: 'varchar', length: 255, comment: '업태' })
    businessType: string;

    @Column({ type: 'varchar', length: 255, comment: '업종' })
    businessCategory: string;

    @Column({ type: 'varchar', length: 255, comment: '통신판매업 신고번호' })
    eCommerceLicenseNumber: string;

    @Column({ type: 'int', comment: '통신판매업 신고증 이미지 id' })
    eCommerceLicenseImageId: number;

    @Column({ type: 'varchar', length: 255, comment: '사업자 은행명' })
    bankName: string;

    @Column({ type: 'varchar', length: 255, comment: '사업자 계좌번호' })
    accountNumber: string;

    @Column({ type: 'varchar', length: 255, comment: '사업자 예금주' })
    accountOwner: string;

    @Column({ type: 'int', comment: '사업자 정산계좌 이미지 id' })
    accountImageId: number;

    @Column({ type: 'int', comment: '가게 프로필 이미지 id' })
    storeProfileImageId: number;

    @Column({ type: 'int', comment: '가게 배너 이미지 id' })
    storeBannerImageId: number;

    @Column({ type: "jsonb", comment: '메인태그 리스트' })
    mainTags: string[];

    @Column({ type: "jsonb", comment: '서브태그 리스트'})
    subTags: string[];

    @Column({ type: "jsonb", comment: '가게 카테고리 리스트 (최대 3개)'})
    category: CategoryType[];

    @Column({ type: 'enum', enum: StoreRegisterStatus, comment: '가게 등록 상태', default: StoreRegisterStatus.Pending })
    status: StoreRegisterStatus;

    @Column({ type: 'varchar', length: 255, comment: '교환/환불 불가 사유' })
    nonReturnableReason: string; 

    @Column({ type: 'varchar', length: 255, comment: '교환/환불 처리 방법' })
    returnableProcess: string;

    @Column({ type: 'varchar', length: 255, comment: '택배 지불 주체' })
    shippingPayer: string;

    @Column({ type: 'varchar', length: 255, comment: 'As 제공자' })
    asProvider: string;

    @Column({ type: 'varchar', length: 255, comment: '고객센터 전화번호' })
    csPhoneNumber: string;

    @Column({ type: 'enum', enum: AuditStatus, comment: '심사 상태', default: AuditStatus.Pending })
    auditStatus: AuditStatus;

    @Column({ type: 'varchar', length: 255, comment: '심사 코멘트', nullable: true })
    comment?: string | null;
}
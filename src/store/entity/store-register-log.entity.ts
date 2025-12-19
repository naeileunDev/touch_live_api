import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { StoreRegisterStatus } from "../enum/store-register-status.enum";
import { User } from "src/user/entity/user.entity";
import { FileCommonDto } from "src/file/dto/file-common-dto";
import { Type } from "class-transformer";

@Entity()
export class StoreRegisterLog extends BaseEntity {
    @ManyToOne(() => User, user => user.storeRegisterLog)
    @JoinColumn({ name: 'userPublicId' })
    user: User;

    @Column({ type: 'varchar', length: 255, comment: '가게 이름' })
    name: string;

    @Column({ type: 'varchar', length: 255, comment: '가게 전화번호' })
    phone: string;

    @Column({ type: 'varchar', length: 255, comment: '가게 이메일' })
    email: string;

    @Column({ type: 'varchar', length: 255, comment: '사업자 등록번호' })
    businessRegistrationNumber: string;

    @Column({ type: 'jsonb', comment: '사업자 등록증 이미지' })
    @Type(() => FileCommonDto)
    businessRegistrationImage: FileCommonDto;

    @Column({ type: 'varchar', length: 255, comment: '대표자 이름' })
    ceoName: string;

    @Column({ type: 'varchar', length: 255, comment: '업태' })
    businessType: string;

    @Column({ type: 'varchar', length: 255, comment: '업종' })
    businessCategory: string;

    @Column({ type: 'varchar', length: 255, comment: '통신판매업 신고번호' })
    eCommerceLicenseNumber: string;

    @Column({ type: 'jsonb', comment: '통신판매업 신고증 이미지' })
    eCommerceLicenseImage: { id: number; fileUrl: string };

    @Column({ type: 'varchar', length: 255, comment: '사업자 은행명' })
    bankName: string;

    @Column({ type: 'varchar', length: 255, comment: '사업자 계좌번호' })
    accountNumber: string;

    @Column({ type: 'varchar', length: 255, comment: '사업자 예금주' })
    accountOwner: string;

    @Column({ type: 'jsonb', comment: '사업자 정산계좌 이미지' })
    accountImage: { id: number; fileUrl: string };

    @Column({ type: 'timestamptz', comment: '가게 등록 일시', nullable: true })
    registerAt: Date;

    @Column({  type: 'timestamptz', comment: '가게 등록 실패 일시', nullable: true })
    registerFailedAt: Date;
    
    @Column({ type: 'enum', enum: StoreRegisterStatus, comment: '가게 등록 상태', default: StoreRegisterStatus.Pending })
    status: StoreRegisterStatus;

    @Column({ type: 'jsonb', comment: '가게 프로필 이미지', nullable: true })
    storeProfileImage: { id: number; fileUrl: string } | null;

    @Column({ type: 'jsonb', comment: '가게 배너 이미지', nullable: true })
    storeBannerImage: { id: number; fileUrl: string } | null;

    @Column({ type: 'jsonb', comment: '메인태그 리스트', nullable: true })
    mainTag: { id: number; name: string }[];

    @Column({ type: 'jsonb', comment: '서브태그 리스트', nullable: true })
    subTag: { id: number; name: string }[];


}
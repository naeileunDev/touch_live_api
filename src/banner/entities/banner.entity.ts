import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { File } from "src/file/entities/file.entity";
import { BannerPosition, BannerLinkType } from "src/common/enums";

@Entity('banner')
export class Banner extends BaseEntity {
    @Column({ type: 'int', comment: '파일 ID' })
    fileId: number;

    @ManyToOne(() => File)
    @JoinColumn({ name: 'fileId' })
    file: File;

    @Column({ type: 'enum', enum: BannerPosition, comment: '배너 위치' })
    position: BannerPosition;

    @Column({ type: 'varchar', length: 100, comment: '배너 제목', nullable: true })
    title?: string;

    @Column({ type: 'enum', enum: BannerLinkType, comment: '링크 타입', default: BannerLinkType.None })
    linkType: BannerLinkType;

    @Column({ type: 'varchar', length: 500, comment: '링크 URL', nullable: true })
    linkUrl?: string;

    @Column({ type: 'int', comment: '링크 대상 ID', nullable: true })
    linkTargetId?: number;

    @Column({ type: 'int', comment: '노출 순서', default: 0 })
    displayOrder: number;

    @Column({ type: 'boolean', comment: '활성화 여부', default: true })
    isActive: boolean;

    @Column({ type: 'timestamptz', comment: '노출 시작일', nullable: true })
    startAt?: Date;

    @Column({ type: 'timestamptz', comment: '노출 종료일', nullable: true })
    endAt?: Date;
}

import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { ContentCategory, MediaType, MimeType, UsageType } from "../enum/file-category.enum";

@Entity()
export class File extends BaseEntity {

    @Column({ type: 'enum', enum: ContentCategory, comment: '콘텐츠 카테고리' })
    contentCategory: ContentCategory;

    @Column({ type: 'enum', enum: MediaType, comment: '미디어 타입' })
    mediaType: MediaType;

    @Column({ type: 'enum', enum: MimeType, comment: 'mime 타입' })
    mimeType: MimeType;

    @Column({ type: 'enum', enum: UsageType, comment: '파일 사용 용도' })
    usageType: UsageType;

    @Column({ type: 'varchar', length: 255, comment: '파일 원래 이름' })
    originalName: string;

    @Column({ type: 'varchar', length: 255, comment: '파일 경로' })
    fileUrl: string;

    @Column({ type: 'float', comment: '영상 길이', nullable: true })
    duration: number;

    @Column({ type: 'int', comment: '콘텐츠 타입', nullable: true })
    contentId: number;

    @Column({ type: 'int', comment: '유저 ID', nullable: true })
    userId: number;

}

import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Store } from "src/store/entity/store.entity";
import { File } from "src/file/entity/file.entity";
import { ShortFormProductTag } from "./short-form-product-tag.entity";

@Entity('short_form')
export class ShortForm extends BaseEntity {
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

    @Column({ type: 'int', comment: '제품 영상 파일 ID' })
    videoFileId: number;

    @ManyToOne(() => File)
    @JoinColumn({ name: 'videoFileId' })
    videoFile: File;

    @Column({ type: 'int', comment: '백색 영상 파일 ID' })
    whiteVideoFileId: number;

    @ManyToOne(() => File)
    @JoinColumn({ name: 'whiteVideoFileId' })
    whiteVideoFile: File;

    @Column({ type: 'varchar', length: 100, comment: '제목' })
    title: string;

    @Column({ type: 'float', comment: '영상 길이 (초)', nullable: true })
    duration?: number;

    @Column({ type: 'int', comment: '조회수', default: 0 })
    viewCount: number;

    @Column({ type: 'int', comment: '좋아요 수', default: 0 })
    likeCount: number;

    @Column({ type: 'int', comment: '댓글 수', default: 0 })
    commentCount: number;

    @Column({ type: 'boolean', comment: '활성화 여부', default: true })
    isActive: boolean;

    @OneToMany(() => ShortFormProductTag, (tag) => tag.shortForm)
    productTags: ShortFormProductTag[];
}

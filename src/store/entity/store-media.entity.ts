import { Column, Entity, ManyToOne } from "typeorm";
import { Store } from "./store.entity";
import { File } from "src/file/entity/file.entity";
import { MediaPurpose } from "../enum/media-purpose.enum";
import { MediaType } from "src/file/enum/file-category.enum";
import { BaseEntity } from "src/common/base-entity/base.entity";

@Entity()
export class StoreMedia extends BaseEntity {
    @ManyToOne(() => Store, store => store.medias)
    store: Store;

    @ManyToOne(() => File)
    file: File;

    @Column({ type: 'enum', enum: MediaPurpose, comment: '미디어 카테고리' })
    mediaPurpose: MediaPurpose;

    @Column({ type: 'enum', enum: MediaType, comment: '미디어 타입' })
    mediaType: MediaType;

    @Column({ type: 'boolean', comment: '미디어 수정 가능 여부'})
    isUpdatable: boolean;
}
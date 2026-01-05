import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { ShortForm } from "./short-form.entity";
import { Tag } from "src/tag/entity/tag.entity";

@Entity('short_form_tag')
@Unique(['shortFormId', 'tagId'])
export class ShortFormTag extends BaseEntity {
    @Column({ type: 'int', comment: '숏폼 ID' })
    shortFormId: number;

    @ManyToOne(() => ShortForm)
    @JoinColumn({ name: 'shortFormId' })
    shortForm: ShortForm;

    @Column({ type: 'int', comment: '태그 ID' })
    tagId: number;

    @ManyToOne(() => Tag)
    @JoinColumn({ name: 'tagId' })
    tag: Tag;

    @Column({ type: 'int', comment: '순서', default: 0 })
    displayOrder: number;
}

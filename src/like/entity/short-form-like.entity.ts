import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique, Check } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { ShortForm } from "src/short-form/entity/short-form.entity";

@Entity()
@Unique(['userId', 'shortFormId'])
export class ShortFormLike extends BaseEntity {
    @Column({ type: 'int', comment: '유저 ID' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int', comment: '숏폼 ID' })
    shortFormId: number;

    @ManyToOne(() => ShortForm, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'shortFormId' })
    shortForm: ShortForm;
}

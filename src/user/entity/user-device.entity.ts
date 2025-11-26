import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { User } from "./user.entity";

@Entity()
@Unique(['jwtUuid'])
export class UserDevice extends BaseEntity {
    @Column({ type: 'varchar', comment: '엑세스 토큰 식별자' })
    jwtUuid: string;

    @Column({ type: 'varchar', comment: 'FCM 토큰' })
    fcmToken: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "src/common/base-entity/base.entity";

@Entity()
export class UserAddress extends BaseEntity {
    @ManyToOne(() => User, user => user.userAddresses)
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column({ type: 'varchar', length: 255, comment: '주소' })
    basicAddress: string;
    @Column({ type: 'varchar', length: 255, comment: '상세주소' })
    detailAddress: string;
    @Column({ type: 'varchar', length: 255, comment: '우편번호' })
    zipCode: string;
    @Column({ type: 'varchar', length: 255, comment: '전화번호' })
    phone: string;
    @Column({ type: 'varchar', length: 255, comment: '이메일' })
    email: string;
    @Column({ type: 'varchar', length: 255, comment: '이름' })
    name: string;
    @Column({ type: 'boolean', comment: '기본 주소 여부', default: false })
    isDefault: boolean;
}
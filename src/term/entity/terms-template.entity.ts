import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity, Index } from "typeorm";
import { TermsType } from "../enum/terms-type.enum";


@Entity()
@Index(['type']) 
export class TermsTemplate extends BaseEntity {
    @Column({ type: 'varchar', length: 255, comment: '약관 버전', default: '1.0' })
    version: string; 

    @Column({ type: 'text', comment: '약관 내용' })
    content: string;

    @Column({ 
        type: 'enum', 
        enum: TermsType, 
        comment: '약관 유형' 
    })
    type: TermsType;

    @Column({ type: 'boolean', comment: '활성화 여부', default: true })
    isActive: boolean;

    @Column({ 
        type: 'boolean', 
        comment: '약관 필수 여부', 
        default: true 
    })
    isRequired: boolean;
}
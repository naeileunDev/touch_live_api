import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class VideoBaseEntity extends BaseEntity {
    @ApiProperty({
        example: 1,
        description: "Object's id",
      })
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMPTZ(6)',
    })
    createdAt: Date;

    @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMPTZ(6)',
    onUpdate: 'CURRENT_TIMESTAMPTZ(6)', 
    })
    updatedAt: Date;
    
    @DeleteDateColumn({
    type: 'timestamptz',
    })
    deletedAt: Date;
    
    @Column({ type: 'varchar', comment: '제목' })
    title: string;

    @Column({ type: "jsonb", comment: '해시 태그(최소 1개, 최대 3개까지)' })
    tags: string[];
}
import { ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity {
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
  }
  
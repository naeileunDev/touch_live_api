import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Unique } from "typeorm";
import { User } from "./user.entity";
import { UserSignupSourceCategory } from "../enum/user-signup-source-category.enum";
import { UserSignupSourceDto } from "../dto/user-signup-source.dto";
import { BaseEntity } from "src/common/base-entity/base.entity";

@Entity()
export class UserSignupSourceData extends BaseEntity {
    @Column({ 
        type: 'enum', 
        enum: UserSignupSourceCategory, 
        comment: '유입경로 카테고리' 
    })
    category: UserSignupSourceCategory;

    @Column({ 
        type: 'varchar', 
        length: 255, 
        comment: '유입경로 기타 설명',
        nullable: true 
    })
    etcDescription?: string;

    @OneToOne(() => User, { 
        onDelete: 'SET NULL',  // User 삭제 시 userId만 NULL, 데이터는 보존
        nullable: true 
    })
    @JoinColumn({ name: 'userId' }) 
    user: User;

      /**
     * UserSignupSourceDto로부터 UserSignupSourceData 엔티티 생성
     * @param dto 유입경로 DTO
     * @param user User 엔티티
     * @returns UserSignupSourceData 엔티티
     */
      static fromDto(dto: UserSignupSourceDto, user: User): UserSignupSourceData {
        const signupSourceData = new UserSignupSourceData();
        signupSourceData.category = dto.category;
        signupSourceData.etcDescription = dto.etcDescription;
        signupSourceData.user = user;
        return signupSourceData;
    }
}
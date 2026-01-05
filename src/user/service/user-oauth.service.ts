import { Injectable } from "@nestjs/common";
import { UserOauthCreateDto } from "../dto/user-oauth-create.dto";
import { UserOauthDto } from "../dto/user-oauth.dto";
import { UserOauth } from "../entities/user-oauth.entity";
import { UserOauthType } from "../enum/user-oauth-type.enum";
import { UserOauthRepository } from "../repository/user-oauth.repository";

@Injectable()
export class UserOauthService {
    constructor(private readonly userOauthRepository: UserOauthRepository) {
    }
     /**
     * OAuth 사용자 생성
     * @param userCreateDto 사용자 생성 DTO
     */
     async createUserOauth(userOauthCreateDto: UserOauthCreateDto): Promise<UserOauthDto> {
        const userOauth = await this.userOauthRepository.createUserOauth(userOauthCreateDto);
        return new UserOauthDto(userOauth);
    }

    /**
     * OAuth ID와 타입으로 사용자가 존재하는지 확인
     * @param snsUserId OAuth ID
     * @param type OAuth 타입
     */
    async existsBySnsUserIdAndTypeWithDeleted(snsUserId: string, type: UserOauthType): Promise<boolean> {
        return await this.userOauthRepository.existsBySnsUserIdAndTypeWithDeleted(snsUserId, type);
    }

    /**
     * 사용자 식별자로 모든 oauth 정보 조회
     * @param userId 사용자 식별자
     */
    async findUserOauthAllByUserId(userId: string): Promise<UserOauthDto[]> {
        const userOauths = await this.userOauthRepository.findAllByUserId(userId);
        return userOauths.map(userOauth => new UserOauthDto(userOauth));
    }

    /**
     * oauth 정보로 사용자 조회
     * @param snsUserId OAuth ID
     * @param type OAuth 타입
     */
    async findUserOauthBySnsUserIdAndType(snsUserId: string, type: UserOauthType): Promise<UserOauthDto> {
        const userOauth = await this.userOauthRepository.findBySnsUserIdAndType(snsUserId, type);
        return new UserOauthDto(userOauth);
    }

    /**
     * 사용자 식별자와 타입으로 oauth 정보 조회
     * @param userId 사용자 식별자
     * @param type OAuth 타입
     */
    async findUserOauthEntityByUserIdAndType(userId: number, type: UserOauthType): Promise<UserOauth> {
        return await this.userOauthRepository.findByUserIdAndType(userId, type);
    }

    /**
     * OAuth 정보 삭제
     * @param id OAuth 식별자
     */
    async deleteUserOauthById(id: number): Promise<boolean> {
        return await this.userOauthRepository.deleteById(id);
    }

}
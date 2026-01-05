import { DataSource, DeleteResult, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserOauth } from "../entities/user-oauth.entity";
import { UserOauthCreateDto } from "../dto/user-oauth-create.dto";
import { UserOauthType } from "../enum/user-oauth-type.enum";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class UserOauthRepository extends Repository<UserOauth> {
    constructor(private dataSource: DataSource) {
        super(UserOauth, dataSource.createEntityManager());
    }

    async createUserOauth(userOauthCreateDto: UserOauthCreateDto): Promise<UserOauth> {
        const userOauth = this.create({
            ...userOauthCreateDto,
            user: {
                publicId: userOauthCreateDto.user.id,
            },
        });
        await this.save(userOauth);
        return userOauth;
    }

    async existsBySnsUserIdAndTypeWithDeleted(snsUserId: string, type: UserOauthType): Promise<boolean> {
        return await this.exists({
            where: {
                snsUserId,
                type,
            },
            withDeleted: true,
        });
    }

    async findBySnsUserIdAndType(snsUserId: string, type: UserOauthType): Promise<UserOauth> {
        const userOauth = await this.findOne({
            where: {
                snsUserId,
                type,
            },
        });
        if (!userOauth) {
            throw new ServiceException(MESSAGE_CODE.USER_OAUTH_NOT_FOUND);
        }
        return userOauth;
    }

    async findAllByUserId(userId: string): Promise<UserOauth[]> {
        return await this.find({
            where: {
                user: { publicId: userId },
            },
        });
    }

    async findByUserIdAndType(userId: number, type: UserOauthType): Promise<UserOauth> {
        const userOauth = await this.findOne({
            where: {
                user: { id: userId },
                type,
            },
        });
        if (!userOauth) {
            throw new ServiceException(MESSAGE_CODE.USER_OAUTH_NOT_FOUND);
        }
        return userOauth;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected === 0 ? false : true;
    }

    async findAllByUserIdWithDeleted(userId: string): Promise<UserOauth[]> {
        return await this.find({
            where: {
                user: {
                    publicId: userId,
                },
            },
            withDeleted: true,
        });
    }
}

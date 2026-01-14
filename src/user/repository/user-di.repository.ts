import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { UserDi } from "../entity/user-di.entity";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { User } from "../entity/user.entity";

@Injectable()
export class UserDiRepository extends Repository<UserDi> {
    constructor(private dataSource: DataSource) {
        super(UserDi, dataSource.createEntityManager());
    }

    async createUserDi(di: string, user: User): Promise<UserDi> {
        const userDi = new UserDi();
        userDi.di = di;
        userDi.user = user;
        await this.save(userDi);
        return userDi;
    }

    async findByDi(di: string): Promise<UserDi> {
        const userDi = await this.findOne({
            where: {
                di,
            },
        });
        if (!userDi) {
            throw new ServiceException(MESSAGE_CODE.USER_DI_NOT_FOUND);
        }
        return userDi;
    }

    async existsByDi(di: string): Promise<boolean> {
        return await this.exists({
            where: {
                di,
            },
        });
    }

    async existsByDiWithDeleted(di: string): Promise<boolean> {
        return await this.exists({
            where: {
                di,
            },
            withDeleted: true,
        });
    }

    async findByUserIdWithDeleted(userId: number): Promise<UserDi> {
        const userDi = await this.findOne({
            where: {
                user: { id: userId },
            },
            withDeleted: true,
        });
        if (!userDi) {
            throw new ServiceException(MESSAGE_CODE.USER_DI_NOT_FOUND);
        }
        return userDi;
    }

    async deleteByUserId(userId: number): Promise<boolean> {
        const result: DeleteResult = await this.softDelete({
            user: { id: userId },
        });
        return result.affected > 0;
    }
}
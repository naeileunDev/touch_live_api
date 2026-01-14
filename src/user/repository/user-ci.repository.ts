import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { UserDi } from "../entity/user-di.entity";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { UserCi } from "../entity/user-ci.entity";
import { User } from "../entity/user.entity";

@Injectable()
export class UserCiRepository extends Repository<UserCi> {
    constructor(private dataSource: DataSource) {
        super(UserDi, dataSource.createEntityManager());
    }

    async createUserCi(ci: string, user: User): Promise<UserCi> {
        const userCi = new UserCi();
        userCi.ci = ci;
        userCi.user = user;
        await this.save(userCi);
        return userCi;
    }

    async existsByCiWithDeleted(ci: string): Promise<boolean> {
        return await this.exists({
            where: {
                ci,
            },
            withDeleted: true,
        });
    }

    async findByUserIdWithDeleted(userId: number): Promise<UserCi> {
        const userCi = await this.findOne({
            where: {
                user: { id: userId },
            },
            withDeleted: true,
        });
        if (!userCi) {
            throw new ServiceException(MESSAGE_CODE.USER_CI_NOT_FOUND);
        }
        return userCi;
    }

    async deleteByUserId(userId: number): Promise<boolean> {
        const result: DeleteResult = await this.softDelete({
            user: { id: userId },
        });
        return result.affected > 0;
    }
}
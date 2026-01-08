import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { UserDi } from "../entity/user-di.entity";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { UserDiCreateDto } from "../dto/user-di-create.dto";
import { UserCi } from "../entity/user-ci.entity";
import { UserCiCreateDto } from "../dto/user-ci-create.dto";

@Injectable()
export class UserCiRepository extends Repository<UserCi> {
    constructor(private dataSource: DataSource) {
        super(UserDi, dataSource.createEntityManager());
    }

    async createUserCi(userCiCreateDto: UserCiCreateDto): Promise<UserCi> {
        const userCi = this.create(userCiCreateDto);
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

    async findByUserIdWithDeleted(publicId: string): Promise<UserCi> {
        const userCi = await this.findOne({
            where: {
                publicId,
            },
            withDeleted: true,
        });
        if (!userCi) {
            throw new ServiceException(MESSAGE_CODE.USER_CI_NOT_FOUND);
        }
        return userCi;
    }

    async deleteByUserId(publicId: string): Promise<boolean> {
        const result: DeleteResult = await this.softDelete({
            publicId,
        });
        return result.affected > 0;
    }
}
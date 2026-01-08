import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { UserDi } from "../entity/user-di.entity";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { UserDiCreateDto } from "../dto/user-di-create.dto";

@Injectable()
export class UserDiRepository extends Repository<UserDi> {
    constructor(private dataSource: DataSource) {
        super(UserDi, dataSource.createEntityManager());
    }

    async createUserDi(userDiCreateDto: UserDiCreateDto): Promise<UserDi> {
        const userDi = this.create(userDiCreateDto);
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

    async findByUserIdWithDeleted(publicId: string): Promise<UserDi> {
        const userDi = await this.findOne({
            where: {
                publicId,
            },
            withDeleted: true,
        });
        if (!userDi) {
            throw new ServiceException(MESSAGE_CODE.USER_DI_NOT_FOUND);
        }
        return userDi;
    }

    async deleteByUserId(publicId: string): Promise<boolean> {
        const result: DeleteResult = await this.softDelete({
            publicId,
        });
        return result.affected > 0;
    }
}
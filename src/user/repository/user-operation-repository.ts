import { DataSource, Repository } from "typeorm";
import { UserOperation } from "../entity/user-operation.entity";
import { Injectable } from "@nestjs/common";
import { User } from "../entity/user.entity";
import { UserRole } from "../enum/user-role.enum";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class UserOperationRepository extends Repository<UserOperation> {
    constructor(private dataSource: DataSource) {
        super(UserOperation, dataSource.createEntityManager());
    }

    async createOperationUser(user: User, role: UserRole): Promise<UserOperation> {
        if (await this.existsOperationUserByUserId(user.publicId)) {
            throw new ServiceException(MESSAGE_CODE.USER_OPERATION_ALREADY_EXISTS);
        }
        const userOperation = this.create({
            user: user,
            role: role,
        });
        return await this.save(userOperation);
    }

    async existsOperationUserByUserId(userId: string): Promise<boolean> {
        return await this.exists({
            where: {
                user: {
                    publicId: userId,
                },
            },
        });
    }

    async findOperationUserByLoginId(loginId: string): Promise<UserOperation> {
        const userOperation = await this.findOne({
            where: {
                user: {
                    loginId,
                },
            },
          relations: ['user'],
        });
        if (!userOperation) {
            throw new ServiceException(MESSAGE_CODE.USER_NOT_FOUND);
        }
        return userOperation;
    }
}
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

    async createOperationUser(user: User): Promise<UserOperation> {
        if (await this.existsOperationUserByUserId(user.publicId)) {
            throw new ServiceException(MESSAGE_CODE.USER_OPERATION_ALREADY_EXISTS);
        }
        const userOperation = this.create({
            user: user,
            role: UserRole.Manager,
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
}
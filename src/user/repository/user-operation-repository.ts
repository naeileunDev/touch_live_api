import { DataSource, DeleteResult, Repository } from "typeorm";
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
        if (await this.existsByUserId(user.publicId)) {
            throw new ServiceException(MESSAGE_CODE.USER_OPERATION_ALREADY_EXISTS);
        }
        const userOperation = this.create({
            user: user,
            role: role,
        });
        return await this.save(userOperation);
    }

    async findById(id: number): Promise<UserOperation> {
        const userOperation = await this.findOne({
            where: {
                id,
            },
        });
        if (!userOperation) {
            throw new ServiceException(MESSAGE_CODE.USER_OPERATION_NOT_FOUND);
        }
        return userOperation;
    }

    async existsByUserId(userId: string): Promise<boolean> {
        return await this.exists({
            where: {
                user: {
                    publicId: userId,
                },
            },
        });
    }

    async findByLoginId(loginId: string): Promise<UserOperation> {
        const userOperation = await this.findOne({
            where: {
                user: {
                    loginId,
                },
            },
          relations: ['user'],
        });
        if (!userOperation) {
            throw new ServiceException(MESSAGE_CODE.USER_OPERATION_NOT_FOUND);
        }
        return userOperation;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected > 0;
    }
}
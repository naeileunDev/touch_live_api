import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, In, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { UserCreateDto } from "../dto/user-create.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(userCreateDto: UserCreateDto): Promise<User> {
        const user = this.create(userCreateDto);
        await this.save(user);
        return user;
    }

    async findById(id: number): Promise<User> {
        const user = await this.findOne({
            where: {
                id,
            },
        });
        if (!user) {
            throw new ServiceException(MESSAGE_CODE.USER_NOT_FOUND);
        }
        return user;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected > 0;
    }

    async findByLoginIdAndRoles(loginId: string, roles: string[]): Promise<User> {
        const user = await this.findOne({
            where: {
                loginId,
                role: In(roles),
            },
        });
        if (!user) {
            throw new ServiceException(MESSAGE_CODE.USER_NOT_FOUND);
        }
        return user;
    }

    async existsByLoginIdWithDeleted(loginId: string): Promise<boolean> {
        return await this.exists({
            where: {
                loginId,
            },
            withDeleted: true,
        });
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

    async findByDi(di: string): Promise<User> {
        const user = await this.findOne({
            where: {
                di,
            },
        });
        if (!user) {
            throw new ServiceException(MESSAGE_CODE.USER_NOT_FOUND);
        }
        return user;
    }
}

import { DataSource, DeleteResult, Repository } from "typeorm";
import { UserAddress } from "../entity/user-address.entity";
import { UserAddressCreateDto } from "../dto/user-address-create.dto";
import { User } from "../entity/user.entity";
import { Injectable } from "@nestjs/common";
import { UserAddressUpdateDto } from "../dto/user-address-update.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class UserAddressRepository extends Repository<UserAddress> {
    constructor(private dataSource: DataSource) {
        super(UserAddress, dataSource.createEntityManager());
    }

    async createUserAddress(userAddressCreateDto: UserAddressCreateDto, user: User): Promise<UserAddress> {
        const userAddress = this.create(userAddressCreateDto);
        userAddress.user = user;
        await this.save(userAddress);
        return userAddress;
    }

    async findById(id: number): Promise<UserAddress> {
        const userAddress = await this.findOne({
            where: {
                id,
            },
            relations: ['user'],
        });
        if (!userAddress) {
            throw new ServiceException(MESSAGE_CODE.USER_ADDRESS_NOT_FOUND);
        }
        return userAddress;
    }

    async existsById(id: number): Promise<boolean> {
        const userAddress = await this.findById(id);
        if (!userAddress) {
            return false;
        }
        return true;
    }
    
    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected > 0;
    }

    async updateById(id: number, userAddressUpdateDto: UserAddressUpdateDto): Promise<UserAddress> {
        const userAddress = await this.findById(id);
        if (!userAddress) {
            throw new ServiceException(MESSAGE_CODE.USER_ADDRESS_NOT_FOUND);
        }
        Object.keys(userAddressUpdateDto).forEach(key => {
            const value = userAddressUpdateDto[key];
            if (value !== undefined) {
                userAddress[key] = value;
            }
        });
        return await this.save(userAddress);
    }

    async findAllByUserId(userId: string): Promise<UserAddress[]> {
        return await this.find({
            where: {
                user: { publicId: userId },
            },
            relations: ['user'],
        });
    }
}
import { DataSource, Repository } from "typeorm";
import { UserAddress } from "../entity/user-address.entity";
import { UserAddressCreateDto } from "../dto/user-address-create.dto";
import { User } from "../entity/user.entity";
import { Injectable } from "@nestjs/common";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { UserAddressUpdateDto } from "../dto/user-address-update.dto";

@Injectable()
export class UserAddressRepository extends Repository<UserAddress> {
    constructor(private dataSource: DataSource) {
        super(UserAddress, dataSource.createEntityManager());
    }

    async createUserAddress(userAddressCreateDto: UserAddressCreateDto, user: User): Promise<UserAddress> {
        const userAddress = this.create(userAddressCreateDto);
        userAddress.user = user;
        return await this.save(userAddress);
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

    async updateUserAddress(userAddress: UserAddress, userAddressUpdateDto: UserAddressUpdateDto): Promise<UserAddress> {
        Object.keys(userAddressUpdateDto).forEach(key => {
            const value = userAddressUpdateDto[key];
            if (value !== undefined) {
                userAddress[key] = value;
            }
        });
        return await this.save(userAddress);
    }
}
import { DataSource, Repository } from "typeorm";
import { UserAddress } from "../entity/user-address.entity";
import { UserAddressCreateDto } from "../dto/user-address-create.dto";
import { User } from "../entity/user.entity";
import { Injectable } from "@nestjs/common";

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
}
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { UserAddressCreateDto } from "../dto/user-address-create.dto";
import { UserAddressUpdateDto } from "../dto/user-address-update.dto";
import { UserAddressDto } from "../dto/user-address.dto";
import { UserDto } from "../dto/user.dto";
import { UserAddressRepository } from "../repository/user-address-repository";
import { UserRepository } from "../repository/user.repository";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserAddressService {
    constructor(
        private readonly userAddressRepository: UserAddressRepository, 
        private readonly userRepository: UserRepository) {
    }

    async registerAddress(userAddressCreateDto: UserAddressCreateDto, userDto: UserDto): Promise<UserAddressDto> {
        const user = await this.userRepository.findById(userDto.id);
        const userAddress = await this.userAddressRepository.createUserAddress(userAddressCreateDto, user);
        return new UserAddressDto(userAddress);
    }

    async updateAddress(id: number, userAddressUpdateDto: UserAddressUpdateDto, userDto: UserDto): Promise<UserAddressDto> {
        const isAuth = await this.checkAuthAddress(id, userDto);
        if (!isAuth) {
            throw new ServiceException(MESSAGE_CODE.USER_ADDRESS_UPDATE_NOT_ALLOWED);
        }
        const userAddress = await this.userAddressRepository.findByAddressId(id);
        const updatedUserAddress = await this.userAddressRepository.updateUserAddress(userAddress, userAddressUpdateDto);
        return new UserAddressDto(updatedUserAddress);
    }

    async checkAuthAddress(id: number, userDto: UserDto): Promise<boolean> {
        const user = await this.userRepository.findById(userDto.id);
        const userAddress = await this.userAddressRepository.findByAddressId(id);
        if (userAddress.user.id !== user.id) {
            return false;
        }
        return true;
    }
    async findUserAddressAllByUserId(userId: string): Promise<UserAddressDto[]> {
        const userAddresses = await this.userAddressRepository.findAllByUserId(userId);
        return userAddresses.map(userAddress => new UserAddressDto(userAddress));
    }
}
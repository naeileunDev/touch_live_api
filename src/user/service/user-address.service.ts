import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { UserAddressCreateDto } from "../dto/user-address-create.dto";
import { UserAddressUpdateDto } from "../dto/user-address-update.dto";
import { UserAddressDto } from "../dto/user-address.dto";
import { UserDto } from "../dto/user.dto";
import { UserAddressRepository } from "../repository/user-address-repository";
import { UserRepository } from "../repository/user.repository";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { Injectable } from "@nestjs/common";
import { UserAddress } from "../entities/user-address.entity";

@Injectable()
export class UserAddressService {
    constructor(
        private readonly userAddressRepository: UserAddressRepository, 
        private readonly userRepository: UserRepository) {
    }

    async create(userAddressCreateDto: UserAddressCreateDto, userDto: UserDto): Promise<UserAddressDto> {
        const user = await this.userRepository.findByPublicId(userDto.id);
        const userAddress = await this.userAddressRepository.createUserAddress(userAddressCreateDto, user);
        return new UserAddressDto(userAddress);
    }

    async findById(id: number): Promise<UserAddressDto> {
        const userAddress = await this.userAddressRepository.findById(id);
        if (!userAddress) {
            throw new ServiceException(MESSAGE_CODE.USER_ADDRESS_NOT_FOUND);
        }
        return new UserAddressDto(userAddress);
    }

    async findEntityById(id: number): Promise<UserAddress> {
        const userAddress = await this.userAddressRepository.findById(id);
        if (!userAddress) {
            throw new ServiceException(MESSAGE_CODE.USER_ADDRESS_NOT_FOUND);
        }
        return userAddress;
    }
    
    async deleteById(id: number): Promise<boolean> {
        if (!await this.existsById(id)) {
            throw new ServiceException(MESSAGE_CODE.USER_ADDRESS_NOT_FOUND);
        }
        return await this.userAddressRepository.deleteById(id);
    }

    async save(id: number, userAddressUpdateDto: UserAddressUpdateDto, userDto: UserDto): Promise<UserAddressDto> {
        const userAddress = await this.userAddressRepository.findById(id);
        if (userAddress.user.publicId !== userDto.id) {
            throw new ServiceException(MESSAGE_CODE.USER_ADDRESS_UPDATE_NOT_ALLOWED);
        }
        const updatedUserAddress = await this.userAddressRepository.updateById(id, userAddressUpdateDto);
        return new UserAddressDto(updatedUserAddress);
    }

    async existsById(id: number): Promise<boolean> {
        return await this.userAddressRepository.existsById(id);
    }

    async findAllByUserId(userId: string): Promise<UserAddressDto[]> {
        const userAddresses = await this.userAddressRepository.findAllByUserId(userId);
        return userAddresses.map(userAddress => new UserAddressDto(userAddress));
    }
}
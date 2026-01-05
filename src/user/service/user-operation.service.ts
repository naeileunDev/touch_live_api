import { EncryptionUtil } from "src/common/util/encryption.util";
import { UserDto } from "../dto";
import { UserOperationDto } from "../dto/user-operaion.dto";
import { UserOperation } from "../entities/user-operation.entity";
import { UserOperationRepository } from "../repository/user-operation-repository";
import { Injectable } from "@nestjs/common";
import { UserOperationRequestDto } from "../dto/user-operation-request.dto";
import { UserRepository } from "../repository/user.repository";

@Injectable()
export class UserOperationService {
    constructor(
        private readonly userOperationRepository: UserOperationRepository,
        private readonly encryptionUtil: EncryptionUtil,
        private readonly userRepository: UserRepository
    ) {
    }
    
    async create(dto: UserOperationRequestDto): Promise<UserOperationDto> {
        const encLoginId = this.encryptionUtil.encryptDeterministic(dto.loginId);
        const user = await this.userRepository.findByLoginId(encLoginId, true);
        const userOperation = await this.userOperationRepository.createOperationUser(user, dto.role);
        const userDto = new UserDto(user, this.encryptionUtil);
        return new UserOperationDto(userDto, userOperation.role);
    }

    async save(dto: UserOperationRequestDto): Promise<UserOperationDto> {
        const encLoginId = this.encryptionUtil.encryptDeterministic(dto.loginId);
        const userOperation = await this.userOperationRepository.findByLoginId(encLoginId);
        userOperation.role = dto.role;
        await this.userOperationRepository.save(userOperation);
        const userDto = new UserDto(userOperation.user, this.encryptionUtil);
        return new UserOperationDto(userDto, userOperation.role);
    }

    async findById(id: number): Promise<UserOperationDto> {
        const userOperation = await this.userOperationRepository.findById(id);
        return new UserOperationDto(new UserDto(userOperation.user, this.encryptionUtil), userOperation.role);
    }

    async findEntityById(id: number): Promise<UserOperation> {
        return await this.userOperationRepository.findById(id);
    }

    async findByLoginId(loginId: string): Promise<UserOperationDto> {
        const encLoginId = this.encryptionUtil.encryptDeterministic(loginId);
        const userOperation = await this.userOperationRepository.findByLoginId(encLoginId);
        const userDto = new UserDto(userOperation.user, this.encryptionUtil);
        return new UserOperationDto(userDto, userOperation.role);
    }

    async findEntityByLoginId(loginId: string): Promise<UserOperation> {
        const encLoginId = this.encryptionUtil.encryptDeterministic(loginId);
        return await this.userOperationRepository.findByLoginId(encLoginId);
    }

    async deleteById(id: number): Promise<boolean> {
        return await this.userOperationRepository.deleteById(id);
    }

    async existsByUserId(userId: string): Promise<boolean> {
        return await this.userOperationRepository.existsByUserId(userId);
    }
    
    
}
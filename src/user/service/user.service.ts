import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserOauthRepository } from '../repository/user-oauth.repository';
import { User } from '../entity/user.entity';
import { UserRole } from '../enum/user-role.enum';
import { UserOauthType } from '../enum/user-oauth-type.enum';
import { UserOauth } from '../entity/user-oauth.entity';
import { UserDevice } from '../entity/user-device.entity';
import { UserStatus } from '../enum/user-status.enum';
import { UserSignupSourceDataRepository } from '../repository/user-signup-source-data.repository';
import { Transactional } from 'typeorm-transactional';
import { AuthCheckRegisterFormDto } from 'src/auth/dto/auth-check-register-form.dto';
import { UserTermsAgreementRepository } from '../repository/user-terms-agreement.repository';
import { UserDeviceService } from './user-device.service';
import { UserAddressService } from './user-address.service';
import { UserOauthService } from './user-oauth.service';
import {UserDto, UserOauthDto, UserOauthCreateDto, UserDeviceCreateDto, UserAddressCreateDto, UserAddressDto, UserAddressUpdateDto} from '../dto/index';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userOauthRepository: UserOauthRepository,
        private readonly userSignupSourceDataRepository: UserSignupSourceDataRepository,
        private readonly userTermsAgreementRepository: UserTermsAgreementRepository,
        private readonly userDeviceService: UserDeviceService,
        private readonly userAddressService: UserAddressService,
        private readonly userOauthService: UserOauthService,
    ) { }

    /**
     * 사용자 생성
     * @param userCreateDto 사용자 생성 정보
     * 
     */
    @Transactional()
    async create(dto: AuthCheckRegisterFormDto): Promise<UserDto> {
        const user = User.fromCreateDto(dto.userInfo);
        const isAdult = User.checkAdult(user.birth);
        user.isAdult = isAdult;
        if (isAdult) {
            user.adultCheckAt = new Date();
        }
        const savedUser = await this.userRepository.save(user);
        await this.userSignupSourceDataRepository.createUserSignupSourceData(dto.signupSourceInfo, savedUser);
        const userTermsAgreement = await this.userTermsAgreementRepository.createUserTermsAgreement(dto.termsAgreementInfo, savedUser);
        savedUser.userTermsAgreement = userTermsAgreement;
        await this.userRepository.save(savedUser);
        return new UserDto(savedUser);
    }

    /**
     * 사용자 단일 조회
     * @param id 사용자 식별자
     */
    async findById(id: number): Promise<UserDto> {
        const user = await this.userRepository.findById(id);
        return new UserDto(user);
    }

    /**
     * 식별자로 사용자 조회 (비밀번호 재확인 패스워드 비교용)
     * @param id 사용자 식별자
     */
    async findEntityById(id: number): Promise<User> {
        return await this.userRepository.findById(id);
    }

    /**
     * DI로 사용자 조회
     * @param di DI
     */
    async findByDi(di: string): Promise<UserDto> {
        const user = await this.userRepository.findByDi(di);
        return new UserDto(user);
    }

    /**
     * DI로 사용자 조회
     * @param di DI
     */
    async findEntityByDi(di: string): Promise<User> {
        return await this.userRepository.findByDi(di);
    }

    /**
     * 사용자 정보 저장
     * @param user 사용자 엔티티
     */
    async save(user: User): Promise<UserDto> {
        const savedUser = await this.userRepository.save(user);
        return new UserDto(savedUser);
    }

    /**
     * 사용자 탈퇴
     * @param userDto 사용자 DTO
     */
    async leave(userDto: UserDto): Promise<boolean> {
        // 사용자 상태를 탈퇴로 변경
        const user = await this.userRepository.findById(userDto.id);
        user.status = UserStatus.Withdrawn;
        await this.save(user);

        // 사용자 삭제
        await this.userRepository.deleteById(user.id);

        // Oauth 삭제
        const userOauths = await this.userOauthRepository.findAllByUserId(user.id);
        for (const userOauth of userOauths) {
            await this.userOauthRepository.deleteById(userOauth.id);
        }
        return true;
    }

    /**
     * CI로 사용자가 존재하는지 확인
     * @param ci CI
     */
    async existsByDi(di: string): Promise<boolean> {
        return await this.userRepository.existsByDi(di);
    }

    /**
     * DI로 사용자가 존재하는지 확인 (삭제 포함)
     * @param di DI
     */
    async existsByDiWithDeleted(di: string): Promise<boolean> {
        console.log("di:", di);
        return await this.userRepository.existsByDiWithDeleted(di);
    }

    /**
     * 아이디로 사용자가 존재하는지 확인
     * @param loginId 아이디
     */
    async existsByLoginIdWithDeleted(loginId: string): Promise<boolean> {
        return await this.userRepository.existsByLoginIdWithDeleted(loginId);
    }

    /**
     * 닉네임으로 사용자가 존재하는지 확인
     * @param nickname 닉네임
     */
    async existsByNicknameWithDeleted(nickname: string): Promise<boolean> {
        return await this.userRepository.existsByNicknameWithDeleted(nickname);
    }

    /**
     * 이메일로 사용자가 존재하는지 확인
     * @param email 이메일
     */
    async existsByEmailWithDeleted(email: string): Promise<boolean> {
        return await this.userRepository.existsByEmailWithDeleted(email);
    }
    /**
     * 아이디로 사용자 조회 (로그인시 패스워드 비교용)
     * @param loginId 아이디
     */
    async findEntityByLoginIdAndRoles(loginId: string, roles: UserRole[]): Promise<User> {
        return await this.userRepository.findByLoginIdAndRoles(loginId, roles);
    }

    // ========== Device 관련 메서드 위임 ==========
    async createUserDevice(userDeviceCreateDto: UserDeviceCreateDto): Promise<void> {
        return this.userDeviceService.createUserDevice(userDeviceCreateDto);
    }

    async findUserDeviceByJwtUuid(jwtUuid: string): Promise<UserDevice> {
        return this.userDeviceService.findUserDeviceByJwtUuid(jwtUuid);
    }

    async existsDeviceByJwtUuid(jwtUuid: string): Promise<boolean> {
        return this.userDeviceService.existsDeviceByJwtUuid(jwtUuid);
    }

    async deleteUserDeviceByJwtUuid(jwtUuid: string): Promise<boolean> {
        return this.userDeviceService.deleteUserDeviceByJwtUuid(jwtUuid);
    }

    async deleteAllUserDeviceByUserId(userId: number): Promise<boolean> {
        return this.userDeviceService.deleteAllUserDeviceByUserId(userId);
    }

    // ========== Oauth 관련 메서드 위임 ==========
    async createUserOauth(userOauthCreateDto: UserOauthCreateDto): Promise<UserOauthDto> {
        return this.userOauthService.createUserOauth(userOauthCreateDto);
    }

    async existsBySnsUserIdAndTypeWithDeleted(snsUserId: string, type: UserOauthType): Promise<boolean> {
        return this.userOauthService.existsBySnsUserIdAndTypeWithDeleted(snsUserId, type);
    }

    async findUserOauthAllByUserId(userId: number): Promise<UserOauthDto[]> {
        return this.userOauthService.findUserOauthAllByUserId(userId);
    }

    async findUserOauthBySnsUserIdAndType(snsUserId: string, type: UserOauthType): Promise<UserOauthDto> {
        return this.userOauthService.findUserOauthBySnsUserIdAndType(snsUserId, type);
    }

    async findUserOauthEntityByUserIdAndType(userId: number, type: UserOauthType): Promise<UserOauth> {
        return this.userOauthService.findUserOauthEntityByUserIdAndType(userId, type);
    }

    async deleteUserOauthById(id: number): Promise<boolean> {
        return this.userOauthService.deleteUserOauthById(id);
    }

    // ========== Address 관련 메서드 위임 ==========
    async registerAddress(userAddressCreateDto: UserAddressCreateDto, userDto: UserDto): Promise<UserAddressDto> {
        return this.userAddressService.registerAddress(userAddressCreateDto, userDto);
    }

    async updateAddress(id: number, userAddressUpdateDto: UserAddressUpdateDto, userDto: UserDto): Promise<UserAddressDto> {
        return this.userAddressService.updateAddress(id, userAddressUpdateDto, userDto);
    }

    async findUserAddressAllByUserId(userId: number): Promise<UserAddressDto[]> {
        return this.userAddressService.findUserAddressAllByUserId(userId);
    }
}

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
import { EncryptionUtil } from 'src/common/util/encryption.util';
import { v4 as uuidv4 } from 'uuid'; 
import { UserOperationRepository } from '../repository/user-operation-repository';
import { UserOperationDto } from '../dto/user-operaion.dto';
import { UserOperationRequestDto } from '../dto/user-operation-request.dto';
import { UserOperation } from '../entity/user-operation.entity';


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
        private readonly encryptionUtil: EncryptionUtil,
        private readonly userOperationRepository: UserOperationRepository,
    ) {}
    private readonly ENCRYPTED_FIELDS = ['loginId', 'birth', 'phone', 'gender', 'di', 'name', 'email'];

    /**
     * 사용자 생성
     * @param userCreateDto 사용자 생성 정보
     * 
     */
    @Transactional()
    async create(dto: AuthCheckRegisterFormDto): Promise<UserDto> {
        const user = new User();
        user.isAdult = this.checkAdult(dto.userInfo.birth);
        if (user.isAdult) {
            user.adultCheckAt = new Date();
        }
        Object.assign(user, dto.userInfo);
        Object.entries(user).forEach(([key, value]) => {
            if (this.ENCRYPTED_FIELDS.includes(key)) {
                user[key] = this.encryptionUtil.encryptDeterministic(value);
            }
        });
        user.publicId = uuidv4();
        user.status = UserStatus.Active;
        const savedUser = await this.userRepository.save(user);
        await this.userSignupSourceDataRepository.createUserSignupSourceData(dto.signupSourceInfo, savedUser);
        const userTermsAgreement = await this.userTermsAgreementRepository.createUserTermsAgreement(dto.termsAgreementInfo, savedUser);
        savedUser.userTermsAgreement = userTermsAgreement;
        await this.userRepository.save(savedUser);
        return new UserDto(savedUser, this.encryptionUtil);
    }

    async setOperationRole(dto: UserOperationRequestDto): Promise<UserOperationDto> {
        const encryptedLoginId = this.encryptionUtil.encryptDeterministic(dto.loginId);
        const user = await this.userRepository.findEntityByLoginIdWithStore(encryptedLoginId, true);
        const userOperation = await this.userOperationRepository.createOperationUser(user, dto.role);
        const userDto = new UserDto(user, this.encryptionUtil);
        return new UserOperationDto(userDto, userOperation.role);
    }

    async modifyOperationRole(dto: UserOperationRequestDto): Promise<UserOperationDto> {
        const encryptedLoginId = this.encryptionUtil.encryptDeterministic(dto.loginId);
        const userOperation = await this.userOperationRepository.findOperationUserByLoginId(encryptedLoginId);
        userOperation.role = dto.role;
        await this.userOperationRepository.save(userOperation);
        const userDto = new UserDto(userOperation.user, this.encryptionUtil);
        return new UserOperationDto(userDto, userOperation.role);
    }

    async findOperationUserEntityByLoginId(loginId: string): Promise<UserOperation> {
        const encryptedLoginId = this.encryptionUtil.encryptDeterministic(loginId);
        return await this.userOperationRepository.findOperationUserByLoginId(encryptedLoginId);
    }

    async existsOperationUserByUserId(userId: string): Promise<boolean> {
        return await this.userOperationRepository.existsOperationUserByUserId(userId);
    }


    private checkAdult(birth: string): boolean {
        const today = new Date();
    const thisYearJan1 = new Date(today.getFullYear(), 0, 1); // 올해 1월 1일
    
    // YYYYMMDD 형식 파싱 (예: '19900101')
    const year = parseInt(birth.substring(0, 4), 10);
    const month = parseInt(birth.substring(4, 6), 10) - 1; // 월은 0부터 시작 실제로는 1월
    const day = parseInt(birth.substring(6, 8), 10);
    
    // 19세가 되는 날 계산
    const adultDate = new Date(year + 19, month, day);
    
    // 19세가 되는 날이 올해 1월 1일 이전이거나 같으면 성인
    return adultDate <= thisYearJan1;
    }


    /**
     * 사용자 단일 조회
     * @param id 사용자 식별자
     */
    async findById(id: string): Promise<UserDto> {
        const user = await this.userRepository.findById(id);
        return new UserDto(user, this.encryptionUtil);
    }

    /**
     * 식별자로 사용자 조회 (비밀번호 재확인 패스워드 비교용)
     * @param id 사용자 식별자
     */
    async findEntityById(id: string, includeStore: boolean = false): Promise<User> {
        const encryptedId = this.encryptionUtil.encryptDeterministic(id);
        return await this.userRepository.findById(encryptedId, includeStore);
    }

    /**
     * DI로 사용자 조회
     * @param di DI
     */
    async findByDi(di: string): Promise<UserDto> {
        const encryptedDi = this.encryptionUtil.encryptDeterministic(di);
        const user = await this.userRepository.findByDi(encryptedDi);
        return new UserDto(user, this.encryptionUtil);
    }

    /**
     * DI로 사용자 조회
     * @param di DI
     */
    async findEntityByDi(di: string): Promise<User> {
        const encryptedDi = this.encryptionUtil.encryptDeterministic(di);
        return await this.userRepository.findByDi(encryptedDi);
    }

    /**
     * 아이디로 사용자 조회
     * @param loginId 아이디
     */
    async findEntityByLoginId(loginId: string, includeStore: boolean = false): Promise<User> {
        const encryptedLoginId = this.encryptionUtil.encryptDeterministic(loginId);
        return await this.userRepository.findEntityByLoginIdWithStore(encryptedLoginId, includeStore);
    }

    /**
     * 사용자 정보 저장
     * @param user 사용자 엔티티
     */
    async save(user: User): Promise<UserDto> {
        const savedUser = await this.userRepository.save(user);
        return new UserDto(savedUser, this.encryptionUtil);
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
        await this.userRepository.deleteById(user.publicId);

        // Oauth 삭제
        const userOauths = await this.userOauthRepository.findAllByUserId(user.publicId);
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
        const encryptedDi = this.encryptionUtil.encryptDeterministic(di);
        return await this.userRepository.existsByDi(encryptedDi);
    }

    /**
     * DI로 사용자가 존재하는지 확인 (삭제 포함)
     * @param di DI
     */
    async existsByDiWithDeleted(di: string): Promise<boolean> {
        const encryptedDi = this.encryptionUtil.encryptDeterministic(di);
        return await this.userRepository.existsByDiWithDeleted(encryptedDi);
    }

    /**
     * 아이디로 사용자가 존재하는지 확인
     * @param loginId 아이디
     */
    async existsByLoginIdWithDeleted(loginId: string): Promise<boolean> {
        const encryptedLoginId = this.encryptionUtil.encryptDeterministic(loginId);
        return await this.userRepository.existsByLoginIdWithDeleted(encryptedLoginId);
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
        const encryptedEmail = this.encryptionUtil.encryptDeterministic(email);
        return await this.userRepository.existsByEmailWithDeleted(encryptedEmail);
    }
    /**
     * 아이디로 사용자 조회 (로그인시 패스워드 비교용)
     * @param loginId 아이디
     */
    async findEntityByLoginIdAndRoles(loginId: string, roles: UserRole[]): Promise<User> {
        const encryptedLoginId = this.encryptionUtil.encryptDeterministic(loginId);
        return await this.userRepository.findByLoginIdAndRoles(encryptedLoginId, roles);
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

    async deleteAllUserDeviceByUserId(userId: string): Promise<boolean> {
        return this.userDeviceService.deleteAllUserDeviceByUserId(userId);
    }

    // ========== Oauth 관련 메서드 위임 ==========
    async createUserOauth(userOauthCreateDto: UserOauthCreateDto): Promise<UserOauthDto> {
        return this.userOauthService.createUserOauth(userOauthCreateDto);
    }

    async existsBySnsUserIdAndTypeWithDeleted(snsUserId: string, type: UserOauthType): Promise<boolean> {
        return this.userOauthService.existsBySnsUserIdAndTypeWithDeleted(snsUserId, type);
    }

    async findUserOauthAllByUserId(userId: string): Promise<UserOauthDto[]> {
        return this.userOauthService.findUserOauthAllByUserId(userId);
    }

    async findUserOauthBySnsUserIdAndType(snsUserId: string, type: UserOauthType): Promise<UserOauthDto> {
        return this.userOauthService.findUserOauthBySnsUserIdAndType(snsUserId, type);
    }

    async findUserOauthEntityByUserIdAndType(userId: string, type: UserOauthType): Promise<UserOauth> {
        return this.userOauthService.findUserOauthEntityByUserIdAndType(userId, type);
    }

    async deleteUserOauthById(id: number): Promise<boolean> {
        return this.userOauthService.deleteUserOauthById(id);
    }

    // ========== Address 관련 메서드 위임 ==========
    async registerAddress(userAddressCreateDto: UserAddressCreateDto, userDto: UserDto): Promise<UserAddressDto> {
        return this.userAddressService.registerAddress(userAddressCreateDto, userDto);
    }

    async updateAddress(addressId: number, userAddressUpdateDto: UserAddressUpdateDto, userDto: UserDto): Promise<UserAddressDto> {
        return this.userAddressService.updateAddress(addressId, userAddressUpdateDto, userDto);
    }

    async findUserAddressAllByUserId(userId: string): Promise<UserAddressDto[]> {
        return this.userAddressService.findUserAddressAllByUserId(userId);
    }
}



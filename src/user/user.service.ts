import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserOauthRepository } from './repository/user-oauth.repository';
import { UserCreateDto } from './dto/user-create.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserDeviceCreateDto } from './dto/user-device-create.dto';
import { UserDeviceRepository } from './repository/user-device.repository';
import { UserRole } from './enum/user-role.enum';
import { UserOauthDto } from './dto/user-oauth.dto';
import { UserOauthCreateDto } from './dto/user-oauth-create.dto';
import { UserOauthType } from './enum/user-oauth-type.enum';
import { UserOauth } from './entity/user-oauth.entity';
import { UserDevice } from './entity/user-device.entity';
import { UserStatus } from './enum/user-status.enum';
import { UserSignupSourceDataRepository } from './repository/user-signup-source-data.repository';
import { Transactional } from 'typeorm-transactional';
import { AuthCheckRegisterFormDto } from 'src/auth/dto/auth-check-register-form.dto';
import { UserTermsAgreementRepository } from './repository/user-terms-agreement.repository';
import { UserAddressCreateDto } from './dto/user-address-create.dto';
import { UserAddress } from './entity/user-address.entity';
import { UserAddressRepository } from './repository/user-address-repository';
import { UserAddressDto } from './dto/user-address.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userOauthRepository: UserOauthRepository,
        private readonly userDeviceRepository: UserDeviceRepository,
        private readonly userSignupSourceDataRepository: UserSignupSourceDataRepository,
        private readonly userTermsAgreementRepository: UserTermsAgreementRepository,
        private readonly userAddressRepository: UserAddressRepository,
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
     * 사용자 디바이스 생성
     * @param userDeviceCreateDto 사용자 디바이스 생성 DTO
     */
    async createUserDevice(userDeviceCreateDto: UserDeviceCreateDto): Promise<void> {
        const { user, jwtUuid, fcmToken } = userDeviceCreateDto;

        // 최대 로그인 디바이스 개수
        const maxLoginDeviceCount = parseInt(process.env.MAX_LOGIN_DEVICE_COUNT);

        // 등록된 디바이스 조회
        const devices = await this.userDeviceRepository.findAllByUserId(user.id);

        // 리프레쉬 토큰으로 재발급인 경우에는 생성 하지 않음
        const existingDevice = devices.find(device => device.jwtUuid === jwtUuid);
        if (existingDevice) {
            return;
        }

        // 기존 등록된 디바이스가 최대 허용 개수 이상일 경우 가장 오래된 디바이스 정보 업데이트
        if (devices.length >= maxLoginDeviceCount) {
            const oldestDevice = devices[devices.length - 1];
            oldestDevice.jwtUuid = jwtUuid;
            oldestDevice.fcmToken = fcmToken;
            await this.userDeviceRepository.save(oldestDevice);
            return;
        }
        await this.userDeviceRepository.createUserDevice(userDeviceCreateDto);
    }

    /**
     * JWT UUID로 사용자 디바이스 조회
     * @param uuid 디바이스 UUID
     */
    async findUserDeviceByJwtUuid(jwtUuid: string): Promise<UserDevice> {
        return await this.userDeviceRepository.findByJwtUuid(jwtUuid);
    }

    /**
     * JWT UUID로 사용자 디바이스 존재 여부 확인
     * @param jwtUuid 디바이스 JWT UUID
     */
    async existsDeviceByJwtUuid(jwtUuid: string): Promise<boolean> {
        return await this.userDeviceRepository.existsByJwtUuid(jwtUuid);
    }

    /**
     * 사용자 디바이스 삭제
     * @param jwtUuid 디바이스 JWT UUID
    */
    async deleteUserDeviceByJwtUuid(jwtUuid: string): Promise<boolean> {
        return await this.userDeviceRepository.deleteByJwtUuid(jwtUuid);
    }

    /**
     * 사용자 디바이스 삭제
     * @param userId 사용자 식별자
     */
    async deleteAllUserDeviceByUserId(userId: number): Promise<boolean> {
        return await this.userDeviceRepository.deleteAllByUserId(userId);
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

    /**
     * OAuth 사용자 생성
     * @param userCreateDto 사용자 생성 DTO
     */
    async createUserOauth(userOauthCreateDto: UserOauthCreateDto): Promise<UserOauthDto> {
        const userOauth = await this.userOauthRepository.createUserOauth(userOauthCreateDto);
        return new UserOauthDto(userOauth);
    }

    /**
     * OAuth ID와 타입으로 사용자가 존재하는지 확인
     * @param snsUserId OAuth ID
     * @param type OAuth 타입
     */
    async existsBySnsUserIdAndTypeWithDeleted(snsUserId: string, type: UserOauthType): Promise<boolean> {
        return await this.userOauthRepository.existsBySnsUserIdAndTypeWithDeleted(snsUserId, type);
    }

    /**
     * 사용자 식별자로 모든 oauth 정보 조회
     * @param userId 사용자 식별자
     */
    async findUserOauthAllByUserId(userId: number): Promise<UserOauthDto[]> {
        const userOauths = await this.userOauthRepository.findAllByUserId(userId);
        return userOauths.map(userOauth => new UserOauthDto(userOauth));
    }

    /**
     * oauth 정보로 사용자 조회
     * @param snsUserId OAuth ID
     * @param type OAuth 타입
     */
    async findUserOauthBySnsUserIdAndType(snsUserId: string, type: UserOauthType): Promise<UserOauthDto> {
        const userOauth = await this.userOauthRepository.findBySnsUserIdAndType(snsUserId, type);
        return new UserOauthDto(userOauth);
    }

    /**
     * 사용자 식별자와 타입으로 oauth 정보 조회
     * @param userId 사용자 식별자
     * @param type OAuth 타입
     */
    async findUserOauthEntityByUserIdAndType(userId: number, type: UserOauthType): Promise<UserOauth> {
        return await this.userOauthRepository.findByUserIdAndType(userId, type);
    }

    /**
     * OAuth 정보 삭제
     * @param id OAuth 식별자
     */
    async deleteUserOauthById(id: number): Promise<boolean> {
        return await this.userOauthRepository.deleteById(id);
    }

    async registerAddress(userAddressCreateDto: UserAddressCreateDto, userDto: UserDto): Promise<UserAddressDto> {
        const user = await this.userRepository.findById(userDto.id);
        const userAddress = await this.userAddressRepository.createUserAddress(userAddressCreateDto, user);
        return new UserAddressDto(userAddress);
    }
}

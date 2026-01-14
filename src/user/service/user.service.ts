import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserOauthRepository } from '../repository/user-oauth.repository';
import { User } from '../entity/user.entity';
import { UserRole } from '../enum/user-role.enum';
import { UserStatus } from '../enum/user-status.enum';
import { UserSignupSourceDataRepository } from '../repository/user-signup-source-data.repository';
import { Transactional } from 'typeorm-transactional';
import { AuthCheckRegisterFormDto } from 'src/auth/dto/auth-check-register-form.dto';
import {UserDto} from '../dto/index';
import { EncryptionUtil } from 'src/common/util/encryption.util';
import { v4 as uuidv4 } from 'uuid'; 
import { UserCiRepository } from '../repository/user-ci.repository';
import { UserDiRepository } from '../repository/user-di.repository';
import { TermService } from 'src/term/service/term.service';
import { TargetType } from 'src/term/enum/term-version.enum';
import { UserCi } from '../entity/user-ci.entity';
import { UserDi } from '../entity/user-di.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userOauthRepository: UserOauthRepository,
        private readonly userSignupSourceDataRepository: UserSignupSourceDataRepository,
        private readonly encryptionUtil: EncryptionUtil,
        private readonly userCiRepository: UserCiRepository,
        private readonly userDiRepository: UserDiRepository,
        private readonly termService: TermService,
    ) {}
    // ** 
    // *private readonly ENCRYPTED_FIELDS = ['loginId', 'birth', 'phone', 'gender', 'name', 'email', 'ci', 'di'];
    // 개발 테스트를 위해 ci, di 필드 제외 => 실 서비스에서는 ci, di 필드 포함
    // */
    private readonly ENCRYPTED_FIELDS = ['loginId', 'birth', 'phone', 'gender', 'name', 'email'];
    /**
     * 사용자 생성
     * @param userCreateDto 사용자 생성 정보
     * 
     */
    @Transactional()
    async create(dto: AuthCheckRegisterFormDto): Promise<User> {
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
        const encryptedCi = this.encryptionUtil.encryptDeterministic(dto.userInfo.ci);
        const encryptedDi = this.encryptionUtil.encryptDeterministic(dto.userInfo.di);
        user.publicId = uuidv4();
        user.status = UserStatus.Active;
        const userCi = new UserCi();
        userCi.ci = encryptedCi;
        user.userCi = userCi;
        const userDi = new UserDi();
        userDi.di = encryptedDi;
        user.userDi = userDi;
        const savedUser = await this.userRepository.save(user);
        await this.userSignupSourceDataRepository.createUserSignupSourceData(dto.signupSourceInfo, savedUser);
        await this.termService.createLog(dto.termsAgreementInfo, savedUser, TargetType.User);
        return savedUser;
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
     * 사용자DTO 단일 조회
     * @param id 사용자 식별자
     * @param includeStore 스토어 포함 여부
     */
    async findById(id: number, includeStore: boolean = false): Promise<UserDto> {
        const user = await this.userRepository.findById(id, includeStore);
        return new UserDto(user);
    }

    /**
     * 사용자 단일 조회
     * @param id 사용자 식별자
     * @param includeStore 스토어 포함 여부
     */
    async findEntityById(id: number, includeStore: boolean = false): Promise<User> {
        return await this.userRepository.findById(id, includeStore);
    }


    /**
     * 사용자DTO 단일 조회
     * @param publicId 사용자 공개 식별자
     * @param includeStore 스토어 포함 여부
     */
    async findByPublicId(publicId: string, includeStore: boolean = false): Promise<UserDto> {
        const user = await this.userRepository.findByPublicId(publicId, includeStore);
        return new UserDto(user);
    }

    /**
     * 식별자로 사용자 조회 (비밀번호 재확인 패스워드 비교용)
     * @param id 사용자 식별자
     */
    async findEntityByPublicId(publicId: string, includeStore: boolean = false): Promise<User> {
        return await this.userRepository.findByPublicId(publicId, includeStore);
    }

    /**
     * DI로 사용자 조회
     * @param di DI
     */
    async findByDi(di: string): Promise<UserDto> {
        const encryptedDi = this.encryptionUtil.encryptDeterministic(di);
        const userDi = await this.userDiRepository.findByDi(encryptedDi);
        const user = await this.userRepository.findById(userDi.user.id);
        return new UserDto(user);
    }

    /**
     * 
     * @param di DI
     * @param includeStore 스토어 포함 여부
     * @returns 사용자 엔티티
     */
    async findEntityByDi(di: string, includeStore: boolean = false): Promise<User> {
        const encryptedDi = this.encryptionUtil.encryptDeterministic(di);
        const userDi = await this.userDiRepository.findByDi(encryptedDi);
        return await this.userRepository.findById(userDi.user.id);
    }
    
    /**
     * 아이디로 사용자 조회
     * @param loginId 아이디
     */
    async findEntityByLoginId(loginId: string, includeStore: boolean = false): Promise<User> {
        const encLoginId = this.encryptionUtil.encryptDeterministic(loginId);
        return await this.userRepository.findByLoginId(encLoginId, includeStore);
    }

    /**
     * 사용자 정보 저장
     * @param user 사용자 엔티티
     */
    async save(user: User): Promise<User> {
        const savedUser = await this.userRepository.save(user);
        return savedUser;
    }

    /**
     * 사용자 탈퇴
     * @param userDto 사용자 DTO
     */
    async leave(userDto: UserDto): Promise<boolean> {
        // 사용자 상태를 탈퇴로 변경
        const user = await this.userRepository.findByPublicId(userDto.id);
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
    async existsByCi(ci: string): Promise<boolean> {
        const encryptedCi = this.encryptionUtil.encryptDeterministic(ci);
        return await this.userCiRepository.existsByCiWithDeleted(encryptedCi);
    }

    /**
     * DI로 사용자가 존재하는지 확인
     * @param di DI
     */
    async existsByDi(di: string): Promise<boolean> {
        const encryptedDi = this.encryptionUtil.encryptDeterministic(di);
        return await this.userDiRepository.existsByDi(encryptedDi);
    }

    /**
     * DI로 사용자가 존재하는지 확인 (삭제 포함)
     * @param di DI
     */
    async existsByDiWithDeleted(di: string): Promise<boolean> {
        const encryptedDi = this.encryptionUtil.encryptDeterministic(di);
        return await this.userDiRepository.existsByDiWithDeleted(encryptedDi);
    }

    /**
     * 아이디로 사용자가 존재하는지 확인
     * @param loginId 아이디
     */
    async existsByLoginIdWithDeleted(loginId: string): Promise<boolean> {
        const encLoginId = this.encryptionUtil.encryptDeterministic(loginId);
        return await this.userRepository.existsByLoginIdWithDeleted(encLoginId);
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
    async findByLoginIdAndRoles(loginId: string, roles: UserRole[]): Promise<User> {
        const encLoginId = this.encryptionUtil.encryptDeterministic(loginId);
        return await this.userRepository.findByLoginIdAndRoles(encLoginId, roles);
    }

}



import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../enum/user-role.enum";
import { UserStatus } from "../enum/user-status.enum";
import { StoreRegisterStatus } from "src/store/enum/store-register-status.enum";
import { UserGender } from "../enum/user-gender.enum";
import { IsString, Matches } from "class-validator";
import { User } from "../entity/user.entity";
import { EncryptionUtil } from "src/common/util/encryption.util";

export class UserDto {
    @ApiProperty({ description: '사용자 식별자', example: 'uuid' })
    id: string;

    @ApiProperty({ description: '사용자 로그인 아이디', example: 'test' })
    loginId: string;    

    @ApiProperty({ description: '사용자 권한', example: UserRole.User })
    role: UserRole;

    @ApiProperty({ description: '사용자 상태', example: UserStatus.Active })
    status: UserStatus = UserStatus.Active;

    @ApiProperty({ description: '사용자 이메일', example: 'test@test.com' })
    email: string;

    @ApiProperty({ description: '사용자 닉네임', example: '홍길동' })
    nickname: string;

    @ApiProperty({ description: '사용자 이름', example: '홍길동' })
    name: string;

    @ApiProperty({ description: '사용자 전화번호', example: '010-1234-5678', format: 'phone' })
    @IsString({ always: true })
    @Matches(/^01[0-9]\d{7,8}$/, { message: '전화번호는 하이픈 없이 11자리 숫자여야 합니다.', always: true })
    phone: string;

    @ApiProperty({ description: '사용자 성별', enum: UserGender, example: UserGender.Male })
    gender: UserGender;

    @ApiProperty({ 
        description: '사용자 생년월일', 
        example: '19900101', 
        type: String, 
        format: 'date-time' })
    birth: string;

    @ApiProperty({ description: '사용자 성인여부', example: true })
    isAdult: boolean;

    @ApiProperty({ 
        description: '사용자 가게 등록 상태', 
        example: StoreRegisterStatus.Pending, 
        nullable: true, 
        enum: StoreRegisterStatus 
    })
    storeRegisterStatus?: StoreRegisterStatus | null;

    constructor(user: User, encryptionUtil?: EncryptionUtil) {
        this.id = user.publicId;
        this.loginId = encryptionUtil ? encryptionUtil.decryptDeterministic(user.loginId) : user.loginId;
        this.role = encryptionUtil ? encryptionUtil.decryptDeterministic(user.role) as UserRole : user.role as UserRole;
        this.status = user.status;
        this.email = encryptionUtil ? encryptionUtil.decryptDeterministic(user.email) : user.email;
        this.nickname = user.nickname;
        this.name = encryptionUtil ? encryptionUtil.decryptDeterministic(user.name) : user.name;
        this.phone = encryptionUtil ? encryptionUtil.decryptDeterministic(user.phone) : user.phone;
        this.gender = encryptionUtil ? encryptionUtil.decryptDeterministic(user.gender) as UserGender : user.gender as UserGender;
        this.birth = encryptionUtil ? encryptionUtil.decryptDeterministic(user.birth) : user.birth.toString();
        this.isAdult = user.isAdult;
        this.storeRegisterStatus = user.storeRegisterStatus;
    }
}
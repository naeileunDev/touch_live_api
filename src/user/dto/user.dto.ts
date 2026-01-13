import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "../enum/user-role.enum";
import { UserStatus } from "../enum/user-status.enum";
import { StoreRegisterStatus } from "src/store/enum/store-register-status.enum";
import { UserGender } from "../enum/user-gender.enum";
import { IsEnum, IsIn, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { Transform } from "class-transformer";
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

    @ApiProperty({ description: '사용자 전화번호', example: '01012345678', format: 'phone' })
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

    @ApiPropertyOptional({ description: '운영자 권한', enum: UserRole, example: UserRole.Admin, nullable: true })
    @IsOptional()
    @IsEnum(UserRole)
    @IsIn([UserRole.Admin, UserRole.Manager])
    userOperation?: UserRole;
    
    @ApiPropertyOptional({ description: '스토어 ID', example: 1, nullable: true })
    @IsOptional()
    @IsNumber()
    storeId?: number | null;


    constructor(user: User) {
        this.id = user.publicId;
        // @Transform 데코레이터가 있지만, 생성자에서 직접 할당할 때는 작동하지 않으므로 여기서도 복호화
        this.loginId = EncryptionUtil.decryptDeterministic(user.loginId)?? null;
        this.role = user.role as UserRole;
        this.status = user.status;
        this.email = EncryptionUtil.decryptDeterministic(user.email)?? null;
        this.nickname = user.nickname;
        this.name = EncryptionUtil.decryptDeterministic(user.name)?? null;
        this.phone = EncryptionUtil.decryptDeterministic(user.phone)?? null;
        this.gender = EncryptionUtil.decryptDeterministic(user.gender) as UserGender?? null;
        this.birth = EncryptionUtil.decryptDeterministic(user.birth)?? null;
        this.isAdult = user.isAdult;
        this.userOperation = user.userOperation?.role;
        this.storeId = user.store?.id ?? null;
    }
}
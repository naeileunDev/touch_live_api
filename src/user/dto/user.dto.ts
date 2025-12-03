import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../enum/user-role.enum";
import { User } from "../entity/user.entity";
import { UserStatus } from "../enum/user-status.enum";
import { StoreRegisterStatus } from "src/store/enum/store-register-status.enum";
import { UserGender } from "../enum/user-gender.enum";
import { IsString, Matches } from "class-validator";

export class UserDto {
    @ApiProperty({ description: '사용자 식별자', example: 1 })
    id: number;

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

    @ApiProperty({ description: '사용자 DI', example: 'DI' })
    di: string;

    @ApiProperty({ description: '사용자 성인여부', example: true })
    isAdult: boolean;

    @ApiProperty({ 
        description: '사용자 가게 등록 상태', 
        example: StoreRegisterStatus.Pending, 
        nullable: true, 
        enum: StoreRegisterStatus 
    })
    storeRegisterStatus?: StoreRegisterStatus | null;
    constructor(user: User) {
        this.id = user.id;
        this.loginId = user.loginId;
        this.role = user.role;
        this.status = user.status;
        this.email = user.email;
        this.name = user.name;
        this.phone = user.phone;
        this.gender = user.gender;
        this.birth = user.birth.toString().slice(0, 10).replace(/-/g, '');
        this.di = user.di;
        this.isAdult = user.isAdult;
        this.storeRegisterStatus = user.storeRegisterStatus;
    }
}
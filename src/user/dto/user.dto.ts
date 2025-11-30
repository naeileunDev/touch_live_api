import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../enum/user-role.enum";
import { User } from "../entity/user.entity";
import { UserStatus } from "../enum/user-status.enum";

export class UserDto {
    @ApiProperty({ description: '사용자 식별자', example: 1 })
    id: number;

    @ApiProperty({ description: '사용자 로그인 아이디', example: 'test' })
    loginId: string;    

    @ApiProperty({ description: '사용자 권한', example: UserRole.User })
    role: UserRole;

    @ApiProperty({ description: '사용자 상태', example: UserStatus.Active })
    status: UserStatus;

    @ApiProperty({ description: '사용자 이메일', example: 'test@test.com' })
    email: string;

    @ApiProperty({ description: '사용자 이름', example: '홍길동' })
    name: string;

    @ApiProperty({ description: '사용자 전화번호', example: '01012345678' })
    phone: string;

    @ApiProperty({ description: '사용자 성별', example: '남' })
    gender: string;

    @ApiProperty({ description: '사용자 생년월일', example: '1990-01-01' })
    birth: string;

    constructor(user: User) {
        this.id = user.id;
        this.loginId = user.loginId;
        this.role = user.role;
        this.status = user.status;
        this.email = user.email;
        this.name = user.name;
        this.phone = user.phone;
        this.gender = user.gender;
        this.birth = user.birth;
    }
}
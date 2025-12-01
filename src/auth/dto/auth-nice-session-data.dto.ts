import { ApiProperty } from "@nestjs/swagger";
import { UserGender } from "src/user/enum/user-gender.enum";

export class AuthNiceSessionDataDto {
    @ApiProperty({ description: 'DI' })
    di: string;

    @ApiProperty({ description: 'CI' })
    ci: string;

    @ApiProperty({ description: '이름' })
    name: string;

    @ApiProperty({ description: '전화번호' })
    phone: string;

    @ApiProperty({ description: '성별', enum: UserGender })
    gender: UserGender;

    @ApiProperty({ description: '생년월일' })
    birth: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class UserDeviceCreateDto {
    @ApiProperty({ description: '엑세스 토큰 식별자' })
    jwtUuid: string;

    @ApiProperty({ description: 'FCM 토큰' })
    fcmToken: string;

    @ApiProperty({ description: '사용자' })
    user: UserDto;
}
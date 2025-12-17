// import { ApiProperty } from "@nestjs/swagger";
// import { IsNotEmpty, IsOptional, IsString } from "class-validator";
// import { UserRole } from "src/user/enum/user-role.enum";

// export class AuthSnsRegisterDto {
//     @ApiProperty({ description: 'NICE 세션 키' })
//     @IsNotEmpty()
//     @IsString()
//     niceSessionKey: string;

//     @ApiProperty({ description: 'SNS 세션 키' })
//     @IsNotEmpty()
//     @IsString()
//     snsSessionKey: string;

//     @ApiProperty({ description: '이메일', required: false })
//     @IsOptional()
//     @IsString()
//     email?: string;

//     @ApiProperty({ description: 'FCM 토큰'})
//     @IsNotEmpty()
//     @IsString()
//     fcmToken: string;

//     name: string;

//     phone: string;

//     gender: string;

//     birth: string;

//     ci: string;

//     di: string;

//     role: UserRole;
// }
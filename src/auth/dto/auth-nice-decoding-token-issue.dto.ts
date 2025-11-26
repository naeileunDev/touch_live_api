import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { AuthRequestHistoryPurposeType } from "../enum/auth-request-history-purpose-type.enum";

export class AuthNiceDecodingTokenIssueDto {
    @ApiProperty({ description: '인증 목적', enum: AuthRequestHistoryPurposeType })
    @IsNotEmpty()
    @IsEnum(AuthRequestHistoryPurposeType)
    purposeType: AuthRequestHistoryPurposeType;
}
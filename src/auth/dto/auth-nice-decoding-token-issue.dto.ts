import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { NiceAuthRequestPurpose } from "../enum/nice-auth-request-history-purpose.enum";

export class AuthNiceDecodingTokenIssueDto {
    @ApiProperty({ description: '인증 목적', enum: NiceAuthRequestPurpose, example: NiceAuthRequestPurpose.Register })
    @IsNotEmpty()
    @IsEnum(NiceAuthRequestPurpose)
    purpose: NiceAuthRequestPurpose = NiceAuthRequestPurpose.Register;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class StoreCreateDto {
    @ApiProperty({ description: '가게 이름' })
    @IsString()
    name: string;

    @ApiProperty({ description: '가게 전화번호' })
    @IsString()
    phone: string;

    @ApiProperty({ description: '가게 이메일' })
    @IsString()
    email: string;

    
}

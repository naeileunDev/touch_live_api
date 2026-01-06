import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class OrderCreateDto {

    @ApiProperty({ description: '주문 번호', example: '1234567890' })
    @IsString()
    orderNo: string;

    @ApiProperty({ description: '사용자 숨김 여부', example: true })
    @IsBoolean()
    @IsOptional()
    isUserHidden?: boolean = true;

}
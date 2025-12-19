import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsDefined, IsInstance, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { TagCommonDto } from "src/tag/dto/tag-common.dto";
import { Tag } from "src/tag/entity/tag.entity";

export class StoreCreateDto {

    @ApiProperty({ description: '가게 이름', example: '가게 이름' })
    @IsRequiredString()
    name: string;

    @ApiProperty({ description: '가게 전화번호', example: '01012345678' })
    @IsRequiredString()
    phone: string;

    @ApiProperty({ description: '가게 이메일', example: 'test@test.com' })
    @IsRequiredString()
    email: string;

    @ApiProperty({ description: '사업자 등록번호', example: '1234567890123' })
    @IsRequiredString()
    businessRegistrationNumber: string;

    @ApiProperty({ description: '대표자 이름', example: '홍길동' })
    @IsRequiredString()
    ceoName: string;

    @ApiProperty({ description: '업태', example: '업태' })
    @IsRequiredString()
    businessType: string;

    @ApiProperty({ description: '업종', example: '업종' })
    @IsRequiredString()
    businessCategory: string;

    @ApiProperty({ description: '통신판매업 신고번호', example: '1234567890123' })
    @IsRequiredString()
    eCommerceLicenseNumber: string;

    @ApiProperty({ description: '사업자 은행명', example: '은행명' })
    @IsRequiredString()
    bankName: string;
    
    @ApiProperty({ description: '사업자 계좌번호', example: '1234567890123' })
    @IsRequiredString()
    accountNumber: string;

    @ApiProperty({ description: '사업자 예금주', example: '홍길동' })
    @IsRequiredString()
    accountOwner: string;

    @ApiProperty({ description: '메인태그 리스트', example: [{id: 1, name: '태그1'}, {id: 2, name: '태그2'}, {id: 3, name: '태그3'}], type: [TagCommonDto] })
    @Transform(({ value }) => {
    if (!value) return [];
    
    // 1. 이미 배열인 경우
    if (Array.isArray(value)) return value;
    
    // 2. JSON 문자열인 경우: '[{"id":1,"name":"태그1"}]'
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            return [];
        }
    }
    
    // 3. 객체인 경우 배열로 변환
    if (typeof value === 'object') {
        return Object.entries(value).map(([key, val]) => ({
            id: Number(key),
            name: String(val),
        }));
    }
    
    return [];
    })
    @IsArray()
    // @ValidateNested({ each: true })
    @Type(() => TagCommonDto)
    mainTag: TagCommonDto[];

    @ApiProperty({ description: '메인태그 리스트', example: [{id: 1, name: '태그1'}, {id: 2, name: '태그2'}, {id: 3, name: '태그3'}], type: [TagCommonDto] })
    @Transform(({ value }) => {
        if (!value) return [];
        
        // 1. 이미 배열인 경우
        if (Array.isArray(value)) return value;
        
        // 2. JSON 문자열인 경우: '[{"id":1,"name":"태그1"}]'
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                return [];
            }
        }
        
        // 3. 객체인 경우 배열로 변환
        if (typeof value === 'object') {
            return Object.entries(value).map(([key, val]) => ({
                id: Number(key),
                name: String(val),
            }));
        }
        if (typeof value) {
            return [value];
        }
        return [];
    })
    @IsArray()
    @Type(() => TagCommonDto) // ✅ @ValidateNested 전에 위치
    // @ValidateNested({ each: true })
    subTag: TagCommonDto[];

}

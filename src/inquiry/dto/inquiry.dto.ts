import { IsBoolean, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductInquiryDto {
    @ApiProperty({ description: '상품 ID' })
    @IsInt()
    productId: number;

    @ApiProperty({ description: '문의 제목' })
    @IsString()
    @MaxLength(100)
    title: string;

    @ApiProperty({ description: '문의 내용' })
    @IsString()
    @MaxLength(1000)
    content: string;

    @ApiPropertyOptional({ description: '비밀글 여부', default: false })
    @IsOptional()
    @IsBoolean()
    isSecret?: boolean;
}

export class UpdateProductInquiryDto {
    @ApiPropertyOptional({ description: '문의 제목' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @ApiPropertyOptional({ description: '문의 내용' })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    content?: string;
}

export class CreateInquiryAnswerDto {
    @ApiProperty({ description: '답변 내용' })
    @IsString()
    @MaxLength(1000)
    content: string;
}

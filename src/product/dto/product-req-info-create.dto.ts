import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class ProductReqInfoCreateDto {
    @ApiProperty({ description: '상품 분류 이름', example: '디지털 콘텐츠 (게임, 스팀키, 온라인 강의 등)' })
    @IsRequiredString()
    title: string;

    @ApiProperty({ description: '상품 분류 속성 리스트',
        example: ['제작자 및 공급자: 게임 제작사/유통사',
            '이용조건: 이용 가능 기기(OS, 사양), 유효기간, 필수 소프트웨어(Steam 등)',
            '상품 이용에 필요한 최소 시스템 사양: CPU, RAM, 그래픽카드 등',
            '청약철회(환불) 조건: "코드 노출 시 환불 불가" 등 구체적인 제한 사항',
            '상담 관련 전화번호: AS 또는 고객센터 번호'
        ]
    })
    @IsArray()
    @IsString({ each: true })
    itemList: string[];
}

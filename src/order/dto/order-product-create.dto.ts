import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { OrderProductStatus } from "../enum/order-product-status.enum";
import { DecisionStatus } from "../enum/decision-status.enum";

export class OrderProductCreateDto {

    @ApiProperty({ description: '주문 ID', example: 1  })
    @IsInt()
    orderId: number;

    @ApiProperty({ description: '상품 ID', example: 1  })
    @IsInt()
    productId: number;
ㅌ
    @ApiProperty({ description: '수량', example: 1  })
    @IsInt()
    quantity: number;

    @ApiProperty({ description: '상품 가격', example: 10000  })
    @IsInt()
    price: number;

    @ApiProperty({ description: '상품 이미지 URL', example: 'https://example.com/image.jpg'  })
    @IsString()
    productImageUrl: string;

    @ApiProperty({ description: '상품 버전', example: '2026-01-01T00:00:00.000Z', type:'string'  })
    @IsDate()
    @Type(() => Date)
    productVersion: Date;

    @ApiProperty({ description: '할인 가격', example: 1000  })
    @IsInt()
    discountFee: number;

    @ApiProperty({ description: '결제 가격', example: 10000  })
    @IsInt()
    paymentFee: number; 

    @ApiProperty({ description: '상품 상태', example: OrderProductStatus.Pending  })
    @IsEnum(OrderProductStatus)
    status: OrderProductStatus;

    @ApiProperty({ description: '소비자 선택 상태', example: DecisionStatus.Waiting  })
    @IsEnum(DecisionStatus)
    @IsOptional()
    decisionStatus?: DecisionStatus = DecisionStatus.Waiting;
    
}
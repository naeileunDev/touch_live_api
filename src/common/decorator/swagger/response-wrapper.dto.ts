import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class SuccessResponseWrapper<T> {
    @ApiProperty({ description: 'HTTP 상태 코드', example: 200 })
    statusCode: number;

    @ApiProperty({ description: '응답 메시지', example: 'SUCCESS' })
    message: string;

    @ApiProperty({ description: '응답 데이터' })
    data: T;

    static create<T>(dataClass: Type<T>): Type<SuccessResponseWrapper<T>> {
        class ResponseWrapper extends SuccessResponseWrapper<T> {
            @ApiProperty({ description: 'HTTP 상태 코드', example: 200 })
            statusCode: number;

            @ApiProperty({ description: '응답 메시지', example: 'SUCCESS' })
            message: string;

            @ApiProperty({ 
                type: () => dataClass,  // 화살표 함수로 래핑하여 타입 정보 보존
                description: '응답 데이터' 
            })
            data: T;
        }
        
        // 클래스 이름 설정 (디버깅용)
        Object.defineProperty(ResponseWrapper, 'name', {
            value: `ResponseWrapper_${dataClass.name}`,
        });
        
        return ResponseWrapper as Type<SuccessResponseWrapper<T>>;
    }
}
import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class SuccessResponseWrapper<T> {
    @ApiProperty({ description: 'HTTP 상태 코드', example: 200 })
    statusCode: number;

    @ApiProperty({ description: '응답 메시지', example: 'SUCCESS' })
    message: string;

    @ApiProperty({ description: '응답 데이터' })
    data: T;
    
    static create<T>(dataClass: Type<T>, isArray = false): Type<SuccessResponseWrapper<T>> {
        class ResponseWrapper extends SuccessResponseWrapper<T> {
            @ApiProperty({ description: 'HTTP 상태 코드', example: 200 })
            statusCode: number;
    
            @ApiProperty({ description: '응답 메시지', example: 'SUCCESS' })
            message: string;
    
            @ApiProperty({ 
                type: () => dataClass,
                isArray: isArray,  // 배열 여부 설정
                description: '응답 데이터' 
            })
            data: T;
        }
        
        Object.defineProperty(ResponseWrapper, 'name', {
            value: `ResponseWrapper_${dataClass.name}${isArray ? '_Array' : ''}`,
        });
        
        return ResponseWrapper as Type<SuccessResponseWrapper<T>>;
    }
}
import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { SuccessResponseWrapper } from './response-wrapper.dto';

// 200 OK
export function ApiOkSuccessResponse<T>(
    model: Type<T>,
    description = '요청 성공',
    isArray = false,  // 배열 여부 옵션 추가
) {
    const ResponseWrapper = SuccessResponseWrapper.create(model, isArray);
    
    return applyDecorators(
        ApiExtraModels(model),
        ApiResponse({
            status: 200,
            description,
            type: ResponseWrapper,
        }),
    );
}

// 201 Created
export function ApiCreatedSuccessResponse<T>(
    model: Type<T>,
    description = '생성 성공',
) {
    const ResponseWrapper = SuccessResponseWrapper.create(model);
    
    return applyDecorators(
        ApiExtraModels(model),  // 모델 등록
        ApiResponse({
            status: 201,
            description,
            type: ResponseWrapper,
        }),
    );
}

// 204 No Content
export function ApiNoContentSuccessResponse(description = '삭제 성공') {
    return applyDecorators(
        ApiResponse({
            status: 204,
            description,
            schema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number', example: 204 },
                    message: { type: 'string', example: description },
                    data: { type: 'null', example: null, nullable: true },
                },
            },
        }),
    );
}
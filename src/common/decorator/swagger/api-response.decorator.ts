import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

// 200 OK
export function ApiOkSuccessResponse<T>(
  model: Type<T>,
  description = '요청 성공',
  example?: any,
) {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description,
      schema: example
        ? {
            example, 
          }
        : undefined,
    }),
  );
}
// 201 Created
export function ApiCreatedSuccessResponse<T>(
  model: Type<T>, 
  description = '생성 성공',
  example?: any
) {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description,
      schema: example
        ? {
            example, 
          }
        : undefined,
    }),
  );
}

// 204 No Content
export function ApiNoContentSuccessResponse(description = '삭제 성공', example?: any) {
  return applyDecorators(
    ApiResponse({
      status: 204,
      description,
      schema: example
        ? {
            example, 
          }
        : undefined,
    }),
  );
}


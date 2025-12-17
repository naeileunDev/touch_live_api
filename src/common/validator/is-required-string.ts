import { ValidationOptions, IsNotEmpty, IsString } from "class-validator";

/**
 * 필수 문자열 검증 데코레이터
 * @IsString() + @IsNotEmpty()를 결합
 */
export function IsRequiredString(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        IsString(validationOptions)(object, propertyName);
        IsNotEmpty(validationOptions)(object, propertyName);
    }
}
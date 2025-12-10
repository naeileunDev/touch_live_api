import { IsNotEmpty, IsString, Matches, MaxLength, MinLength, registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
class NicknameValidator implements ValidatorConstraintInterface{
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        if (typeof value !== 'string') {
            return false;
        }
        
        const trimmed = value.trim();
        
        // 공백 문자열 체크
        if (trimmed.length === 0) {
            return false;
        }

        // 길이 체크 (4-20자)
        if (trimmed.length < 2 || trimmed.length > 8) {
            return false;
        }
        // 한글, 영문대소문자, 숫자만 허용하는 정규식
        const nicknameRegex = /^[a-zA-Z0-9가-힣]*$/;
        if (!nicknameRegex.test(trimmed)) {
            return false;
        }
        return true;
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return `닉네임은 2-8자의 한글, 영문대소문자, 숫자만 사용 가능하며 공백은 허용되지 않습니다`;
    }
}
export function IsNickname(validationOptions?: ValidationOptions){
    return function(object: Object, propertyName: string){
        // IsString 데코레이터 적용
        IsString(validationOptions)(object, propertyName);
        
        // IsNotEmpty 데코레이터 적용
        IsNotEmpty(validationOptions)(object, propertyName);
        
        // MinLength 데코레이터 적용 (4자 이상)
        MinLength(2, {
            ...validationOptions,
            message: '닉네임은 최소 2자 이상이어야 합니다',
        })(object, propertyName);
        
        // MaxLength 데코레이터 적용 (20자 이하)
        MaxLength(8, {
            ...validationOptions,
            message: '닉네임은 최대 8자까지 가능합니다',
        })(object, propertyName);

        // 영문, 숫자만 허용하는 정규식
        Matches(/^[a-zA-Z0-9가-힣]*$/, {
            ...validationOptions,
            message: '닉네임은 한글, 영문대소문자, 숫자만 사용 가능합니다',
        })(object, propertyName);
        
        // IsNickname 커스텀 검증 적용
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: NicknameValidator,
        });
    }
}


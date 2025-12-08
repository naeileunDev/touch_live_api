import { 
    registerDecorator, 
    ValidationArguments, 
    ValidationOptions, 
    ValidatorConstraint, 
    ValidatorConstraintInterface,
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    Matches,
} from "class-validator";

@ValidatorConstraint()
class PasswordValidator implements ValidatorConstraintInterface{
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        if (typeof value !== 'string') {
            return false;
        }
        
        const trimmed = value.trim();
        
        // 공백 문자열 체크
        if (trimmed.length === 0) {
            return false;
        }
        
        // 길이 체크 (8-16자)
        if (trimmed.length < 8 || trimmed.length > 16) {
            return false;
        }
        
        // 공백 포함 여부 체크
        if (value.includes(' ')) {
            return false;
        }
        
        // 비밀번호 복잡도 체크: 대문자, 소문자, 숫자, 특수문자 중 최소 2가지 이상 포함
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
        
        const complexityCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
        
        if (complexityCount < 2) {
            return false;
        }
        
        return true;
    }
    
    defaultMessage(validationArguments?: ValidationArguments): string {
        return `비밀번호는 8-16자이며, 대문자/소문자/숫자/특수문자 중 최소 2가지 이상을 포함해야 하며 공백은 허용되지 않습니다`;
    }
}

export function IsPassword(validationOptions?: ValidationOptions){
    return function(object: Object, propertyName: string){
        // IsString 데코레이터 적용
        IsString(validationOptions)(object, propertyName);
        
        // IsNotEmpty 데코레이터 적용
        IsNotEmpty(validationOptions)(object, propertyName);
        
        // MinLength 데코레이터 적용 (8자 이상)
        MinLength(8, {
            ...validationOptions,
            message: '비밀번호는 최소 8자 이상이어야 합니다',
        })(object, propertyName);
        
        // MaxLength 데코레이터 적용 (16자 이하)
        MaxLength(16, {
            ...validationOptions,
            message: '비밀번호는 최대 16자까지 가능합니다',
        })(object, propertyName);
        
        // 공백 불가 정규식
        Matches(/^\S+$/, {
            ...validationOptions,
            message: '비밀번호에는 공백을 사용할 수 없습니다',
        })(object, propertyName);
        
        // IsPassword 커스텀 검증 적용
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: PasswordValidator,
        });
    }
}


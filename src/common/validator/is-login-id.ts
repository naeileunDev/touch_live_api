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
class LoginIdValidator implements ValidatorConstraintInterface{
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        if (typeof value !== 'string') {
            return false;
        }
        
        const trimmed = value.trim();
        
        // 공백 문자열 체크
        if (trimmed.length === 0) {
            return false;
        }
        
        // 길이 체크 (5-20자)
        if (trimmed.length < 5 || trimmed.length > 20) {
            return false;
        }
        
        // 첫 글자가 영문으로 시작해야 함
        const firstChar = trimmed[0];
        if (!/^[a-z]$/.test(firstChar)) {
            return false;
        }
        
        // 영문, 숫자만 허용 (대소문자 구분 있음, 소문자만 허용, 공백 불가)
        const loginIdRegex = /^[a-z0-9]$/g;
        if (!loginIdRegex.test(trimmed)) {
            return false;
        }
        
        return true;
    }
    
    defaultMessage(validationArguments?: ValidationArguments): string {
        return `로그인ID는 영문으로 시작해야 하며, 5-20자의 영문 소문자, 숫자만 사용 가능하며 공백은 허용되지 않습니다`;
    }
}

export function IsLoginId(validationOptions?: ValidationOptions){
    return function(object: Object, propertyName: string){
        // IsString 데코레이터 적용
        IsString(validationOptions)(object, propertyName);
        
        // IsNotEmpty 데코레이터 적용
        IsNotEmpty(validationOptions)(object, propertyName);
        
        // MinLength 데코레이터 적용 (4자 이상)
        MinLength(5, {
            ...validationOptions,
            message: '로그인ID는 최소 5자 이상이어야 합니다',
        })(object, propertyName);
        
        // MaxLength 데코레이터 적용 (20자 이하)
        MaxLength(20, {
            ...validationOptions,
            message: '로그인ID는 최대 20자까지 가능합니다',
        })(object, propertyName);

        // 첫 글자가 영문으로 시작해야 함
        Matches(/^[a-z]/, {
            ...validationOptions,
            message: '로그인ID는 영문 소문자로 시작해야 합니다',
        })(object, propertyName);
        
        // 영문, 숫자만 허용하는 정규식
        Matches(/^[a-z0-9]$/g, {
            ...validationOptions,
            message: '로그인ID는 영문 소문자, 숫자만 사용 가능합니다',
        })(object, propertyName);
        
        // IsLoginId 커스텀 검증 적용
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: LoginIdValidator,
        });
    }
}


import { plainToInstance } from 'class-transformer';

export function transformToDtoArray<T>(
    value: any,
    DtoClass: new () => T,
    objectMapper?: (key: string, val: any) => any
): T[] {
    if (!value) return [];
    
    let array: any[];
    
    if (Array.isArray(value)) {
        array = value;
    } else if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            array = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            return [];
        }
    } else if (typeof value === 'object' && value !== null) {
        array = Object.entries(value).map(([key, val]) => {
            if (objectMapper) {
                return objectMapper(key, val);
            }
            // 기본 매핑
            const numKey = Number(key);
            return {
                id: !isNaN(numKey) ? numKey : key,
                ...(typeof val === 'object' && val !== null ? val : { value: val })
            };
        });
    } else {
        return [];
    }
    
    return array.map(item => plainToInstance(DtoClass, item, { excludeExtraneousValues: false }));
}
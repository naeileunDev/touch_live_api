import { v4 as uuidv4 } from 'uuid';

/* 버전 관리를 하는 엔티티에 사용되는 고유ID 생성 유틸
대문자약어_랜덤UUID(-제거) 형식  */
export const createPublicId =(prefix: string): string => {
    return `${prefix.toUpperCase()}_${uuidv4().replace(/-/g, '')}`;
}
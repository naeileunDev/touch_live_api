import { MESSAGE_CODE } from './message-code.config';

export const MESSAGE_TEXT = {
    // Common
    [MESSAGE_CODE.NOT_ALLOWED_SELF]: '스스로 수정할 수 없습니다.',

    // User
    [MESSAGE_CODE.USER_NOT_FOUND]: '사용자를 찾을 수 없습니다.',
    [MESSAGE_CODE.USER_OAUTH_NOT_FOUND]: '사용자 인증 정보를 찾을 수 없습니다.',
    [MESSAGE_CODE.USER_ALREADY_EXISTS]: '사용자가 이미 존재합니다.',
    [MESSAGE_CODE.USER_LOGIN_ID_ALREADY_EXISTS]: '사용자 로그인 아이디가 이미 존재합니다.',
    [MESSAGE_CODE.USER_PASSWORD_MISMATCH]: '사용자 비밀번호가 일치하지 않습니다.',
    [MESSAGE_CODE.USER_OAUTH_ALREADY_LINKED]: '사용자 인증 정보가 이미 연결되어 있습니다.',
    [MESSAGE_CODE.USER_REMOVED_STATUS]: '사용자가 탈퇴되었습니다.',
    [MESSAGE_CODE.USER_PASSWORD_SAME]: '직전 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.',
    [MESSAGE_CODE.USER_LOGIN_ID_MISMATCHED]: '로그인 아이디가 일치하지 않습니다.',
    [MESSAGE_CODE.USER_ADDRESS_NOT_FOUND]: '배송지 주소를 찾을 수 없습니다.',
    [MESSAGE_CODE.USER_ADDRESS_UPDATE_NOT_ALLOWED]: '배송지 주소 수정 권한이 없습니다.',
    [MESSAGE_CODE.USER_OPERATION_ALREADY_EXISTS]: '사용자 권한이 이미 설정되어 있습니다.',

    // Auth
    [MESSAGE_CODE.NICE_SESSION_KEY_EXPIRED]: 'Nice session key expired',
    [MESSAGE_CODE.NICE_SESSION_DATA_MISSING]: 'NICE 세션 데이터를 찾을 수 없습니다.',
    [MESSAGE_CODE.NICE_ENCRYPTION_KEYS_MISSING]: 'NICE 암호화 키를 찾을 수 없습니다.',
    [MESSAGE_CODE.NICE_SESSION_MISMATCH]: 'NICE 세션 정보가 일치하지 않습니다.',
    [MESSAGE_CODE.NICE_INTEGRITY_MISMATCH]: 'NICE 정보 무결성이 일치하지 않습니다.',
    [MESSAGE_CODE.NICE_AUTH_FAILURE]: 'NICE 인증 실패',
    [MESSAGE_CODE.NICE_ACCESS_TOKEN_ISSUANCE_FAILED]: 'NICE 액세스 토큰 발급 실패',
    [MESSAGE_CODE.NICE_ENCRYPTION_TOKEN_ISSUANCE_FAILED]: 'NICE 암호화 토큰 발급 실패',
    [MESSAGE_CODE.AUTH_LOGIN_FAILED_LIMIT]: '로그인 실패 회수 초과',
    [MESSAGE_CODE.SNS_SESSION_KEY_EXPIRED]: 'SNS 세션 키 만료',
    [MESSAGE_CODE.SNS_SESSION_DATA_MISSING]: 'SNS 세션 데이터 누락',
    [MESSAGE_CODE.APPLE_TOKEN_EXCHANGE_FAILED]: 'Apple token exchange 실패',
    [MESSAGE_CODE.APPLE_ID_TOKEN_INVALID_FORMAT]: 'Apple id token 형식이 올바르지 않습니다.',
    [MESSAGE_CODE.APPLE_ID_TOKEN_INVALID_OR_EXPIRED]: 'Apple id token 만료',

    // File
    [MESSAGE_CODE.FILE_METADATA_ANALYSIS_FAILED]: '영상 파일 메타데이터 분석에 실패했습니다.',
    [MESSAGE_CODE.FILE_TEMP_CREATE_FAILED]: '임시 파일 생성에 실패했습니다.',
    [MESSAGE_CODE.FILE_NOT_FOUND]: '파일을 찾을 수 없습니다.',
    [MESSAGE_CODE.FILE_INVALID_MIME_TYPE]: '파일 형식이 올바르지 않습니다.',
    [MESSAGE_CODE.FILE_INVALID_MEDIA_DURATION]: '영상 길이가 올바르지 않습니다.',
    [MESSAGE_CODE.FILE_REQUIRED_NOT_FOUND]: '필수 파일이 누락되었습니다.',

    // Tag
    [MESSAGE_CODE.TAG_NAME_ALREADY_EXISTS]: '태그 이름이 이미 존재합니다.',
};

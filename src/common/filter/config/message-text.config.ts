import { MESSAGE_CODE } from './message-code.config';

export const MESSAGE_TEXT = {
    // Common
    [MESSAGE_CODE.NOT_ALLOWED_SELF]: 'You are not allowed to perform this action on yourself',

    // User
    [MESSAGE_CODE.USER_NOT_FOUND]: 'User not found',
    [MESSAGE_CODE.USER_OAUTH_NOT_FOUND]: 'User oauth not found',
    [MESSAGE_CODE.USER_ALREADY_EXISTS]: 'User already exists',
    [MESSAGE_CODE.USER_LOGIN_ID_ALREADY_EXISTS]: 'User login id already exists',
    [MESSAGE_CODE.USER_PASSWORD_MISMATCH]: 'User password mismatch',
    [MESSAGE_CODE.USER_OAUTH_ALREADY_LINKED]: 'User oauth already linked',
    [MESSAGE_CODE.USER_REMOVED_STATUS]: 'User removed status',

    // Auth
    [MESSAGE_CODE.NICE_SESSION_KEY_EXPIRED]: 'Nice session key expired',
    [MESSAGE_CODE.NICE_SESSION_DATA_MISSING]: 'Nice session data missing',
    [MESSAGE_CODE.NICE_ENCRYPTION_KEYS_MISSING]: 'Nice encryption keys missing',
    [MESSAGE_CODE.NICE_SESSION_MISMATCH]: 'Nice session mismatch',
    [MESSAGE_CODE.NICE_INTEGRITY_MISMATCH]: 'Nice integrity mismatch',
    [MESSAGE_CODE.NICE_AUTH_FAILURE]: 'Nice auth failure',
    [MESSAGE_CODE.NICE_ACCESS_TOKEN_ISSUANCE_FAILED]: 'Nice access token issuance failed',
    [MESSAGE_CODE.NICE_ENCRYPTION_TOKEN_ISSUANCE_FAILED]: 'Nice encryption token issuance failed',
    [MESSAGE_CODE.AUTH_LOGIN_FAILED_LIMIT]: 'Auth login failed limit',
    [MESSAGE_CODE.SNS_SESSION_KEY_EXPIRED]: 'Sns session key expired',
    [MESSAGE_CODE.SNS_SESSION_DATA_MISSING]: 'Sns session data missing',
    [MESSAGE_CODE.APPLE_TOKEN_EXCHANGE_FAILED]: 'Apple token exchange failed',
    [MESSAGE_CODE.APPLE_ID_TOKEN_INVALID_FORMAT]: 'Apple id token invalid format',
    [MESSAGE_CODE.APPLE_ID_TOKEN_INVALID_OR_EXPIRED]: 'Apple id token invalid or expired',
};

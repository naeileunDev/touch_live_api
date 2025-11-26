import { AuthRequestHistoryPurposeType } from "../enum/auth-request-history-purpose-type.enum";

export class NiceTokenVersionDataDto {
    key: string;
    iv: string;
    hmacKey: string;
    reqNo: string;
    purposeType: AuthRequestHistoryPurposeType;
}
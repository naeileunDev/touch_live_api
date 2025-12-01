import { NiceAuthRequestPurpose } from "../enum/nice-auth-request-history-purpose.enum";

export class NiceTokenVersionDataDto {
    key: string;
    iv: string;
    hmacKey: string;
    reqNo: string;
    purpose: NiceAuthRequestPurpose;
}
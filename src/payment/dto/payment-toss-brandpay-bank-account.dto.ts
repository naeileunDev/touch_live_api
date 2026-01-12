import { ApiProperty } from "@nestjs/swagger";

export class PaymentTossBrandpayBankAccountDto {
    @ApiProperty({ description: '결제수단 ID' })
    id: string;

    @ApiProperty({ description: '별칭' })
    alias: string;

    @ApiProperty({ description: '계좌이름' })
    accountName: string;

    @ApiProperty({ description: '계좌번호' })
    accountNumber: string;

    @ApiProperty({ description: '은행코드' })
    bankCode: string;

    @ApiProperty({ description: '등록일' })
    registeredAt: Date;

    @ApiProperty({ description: '아이콘' })
    icon: string;

    @ApiProperty({ description: '아이콘 URL' })
    iconUrl: string;

    @ApiProperty({ description: '색상' })
    color: any;

    constructor(account: any) {
        this.id = account.id;
        this.alias = account.alias;
        this.accountName = account.accountName;
        this.accountNumber = account.accountNumber;
        this.bankCode = account.bankCode;
        this.registeredAt = account.registeredAt;
        this.icon = account.icon;
        this.iconUrl = account.iconUrl;
        this.color = account.color;
    }
}
import { ApiProperty } from "@nestjs/swagger";

export class PaymentTossBrandpayCardDto {
    @ApiProperty({ description: '결제수단 ID' })
    id: string;

    @ApiProperty({ description: '별칭' })
    alias: string;

    @ApiProperty({ description: '카드이름' })
    cardName: string;

    @ApiProperty({ description: '카드번호' })
    cardNumber: string;

    @ApiProperty({ description: '발급사코드' })
    issuerCode: string;

    @ApiProperty({ description: '소유주유형 (개인, 법인)' })
    ownerType: string;

    @ApiProperty({ description: '카드타입 (신용, 체크, 기프트)' })
    cardType: string;

    @ApiProperty({ description: '최소 할부금액' })
    installmentMinimumAmount: number;

    @ApiProperty({ description: '등록일' })
    registeredAt: string;

    @ApiProperty({ description: '아이콘' })
    icon: string;

    @ApiProperty({ description: '아이콘 URL' })
    iconUrl: string;

    @ApiProperty({ description: '색상' })
    color: any;

    constructor(card: any) {
        this.id = card.id;
        this.alias = card.alias;
        this.cardName = card.cardName;
        this.cardNumber = card.cardNumber;
        this.issuerCode = card.issuerCode;
        this.ownerType = card.ownerType;
        this.cardType = card.cardType;
        this.installmentMinimumAmount = card.installmentMinimumAmount;
        this.registeredAt = card.registeredAt;
        this.icon = card.icon;
        this.iconUrl = card.iconUrl;
        this.color = card.color;
    }
}
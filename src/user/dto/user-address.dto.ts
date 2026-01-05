import { ApiProperty } from "@nestjs/swagger";
import { UserAddress } from "../entity/user-address.entity";

export class UserAddressDto {
    @ApiProperty({ description: '주소 식별자', example: 1 })
    id: number;
    @ApiProperty({ description: '기본주소', example: '서울특별시 종로구 통일로 123' })
    basicAddress: string;
    @ApiProperty({ description: '상세주소', example: '101동 101호' })
    detailAddress: string;
    @ApiProperty({ description: '우편번호', example: '12345' })
    zipCode: string;
    @ApiProperty({ description: '전화번호', example: '01012345678' })
    phone: string;
    @ApiProperty({ description: '이름', example: '홍길동' })
    name: string;
    @ApiProperty({ description: '사용자 식별자', example: 1 })
    userId: number;

    constructor(userAddress: UserAddress) {
        this.id = userAddress.id;
        this.basicAddress = userAddress.basicAddress;
        this.detailAddress = userAddress.detailAddress;
        this.zipCode = userAddress.zipCode;
        this.phone = userAddress.phone;
        this.name = userAddress.name;
        this.userId = userAddress.user.id;
    }
}
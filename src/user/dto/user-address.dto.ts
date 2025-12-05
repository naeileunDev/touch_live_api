import { UserAddress } from "../entity/user-address.entity";
import { UserDto } from "./user.dto";

export class UserAddressDto {
    
    id: number;
    basicAddress: string;
    detailAddress: string;
    zipCode: string;
    phone: string;
    email: string;
    name: string;
    userId: number;

    constructor(userAddress: UserAddress) {
        this.id = userAddress.id;
        this.basicAddress = userAddress.basicAddress;
        this.detailAddress = userAddress.detailAddress;
        this.zipCode = userAddress.zipCode;
        this.phone = userAddress.phone;
        this.email = userAddress.email;
        this.name = userAddress.name;
        this.userId = userAddress.user.id;
    }
}
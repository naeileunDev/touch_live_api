import { PartialType } from "@nestjs/swagger";
import { UserAddressCreateDto } from "./user-address-create.dto";

export class UserAddressUpdateDto extends PartialType(UserAddressCreateDto) {

}
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PaymentMethodService } from "./payment-method.service";
import { Controller, Get } from "@nestjs/common";
import { Role } from "src/common/decorator/role.decorator";
import { ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { ALL_PERMISSION } from "src/common/permission/permission";
import { GetUser } from "src/common/decorator/get-user.decorator";
import { UserDto } from "src/user/dto";
import { PaymentMethodDto } from "./dto/payment-method.dto";

@ApiTags('PaymentMethod')
@Controller('payment-method')
@ApiBearerAuth('access-token')
export class PaymentMethodController {
    constructor(private readonly paymentMethodService: PaymentMethodService) {
    }

    @Get('list')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '결제 수단 목록 조회' })
    @ApiOkSuccessResponse(PaymentMethodDto, '결제 수단 목록 조회 성공', true)
    findPaymentMethodAllByUserId(@GetUser() userDto: UserDto): Promise<PaymentMethodDto[]> {
        return this.paymentMethodService.findPaymentMethodAllByUserId(userDto.id);
    }
}
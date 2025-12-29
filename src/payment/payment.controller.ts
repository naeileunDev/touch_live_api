import { Controller, Get, ParseEnumPipe, Query } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Role } from "src/common/decorator/role.decorator";
import { USER_PERMISSION } from "src/common/permission/permission";
import { ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { GetUser } from "src/common/decorator/get-user.decorator";
import { User } from "src/user/entity/user.entity";
import { PaymentScope } from "./enum/payment-scope.enum";
import { PaymentTermDto } from "./dto/payment-term.dto";
import { PaymentCheckTermsDto } from "./dto/payment-check-terms.dto";

@Controller('payment')
@ApiTags('Payment')
@ApiBearerAuth('access-token')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {
    }

    @Get('check/terms-not-agreed')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '[유저 role] 결제 약관 미동의 약관 조회' })
    @ApiOkSuccessResponse(PaymentTermDto, '약관 미동의 약관 조회 성공', true)
    async checkTerms(@GetUser() user: User, @Query() dto: PaymentCheckTermsDto) {
        return await this.paymentService.checkTermsNotAgreed(user, dto);
    }
}
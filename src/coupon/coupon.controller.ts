import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { CouponDto } from "./dto/coupon.dto";
import { CouponCreateDto } from "./dto/coupon-create.dto";
import { Role } from "src/common/decorator/role.decorator";
import { ALL_PERMISSION, ANY_PERMISSION, OPERATOR_PERMISSION } from "src/common/permission/permission";
import { CouponUpdateDto } from "./dto/coupon-update.dto";

@ApiTags('Coupon')
@Controller('coupon')
@ApiBearerAuth('access-token')
export class CouponController {
    constructor(
        private readonly couponService: CouponService,
    ) {
    }

    @Post()
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[operator role] 쿠폰 생성' })
    @ApiOkSuccessResponse(CouponDto, '쿠폰 생성 성공')
    create(@Body() couponCreateDto: CouponCreateDto): Promise<CouponDto> {
        return this.couponService.create(couponCreateDto);
    }

    // 나중에 쿼리문으로 특정 기준으로 조회할 수 있게 추가 예정
    @Get()
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 만료기간이 지나지 않은 모든 쿠폰 목록 조회' })
    @ApiOkSuccessResponse(CouponDto, '쿠폰 목록 조회 성공', true)
    findAllNotExpired(): Promise<CouponDto[]> {
        return this.couponService.findAllNotExpired();
    }

    @Get(':id')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 쿠폰 상세 조회' })
    @ApiOkSuccessResponse(CouponDto, '쿠폰 상세 조회 성공')
    findById(@Param('id', ParseIntPipe) id: number): Promise<CouponDto> {
        return this.couponService.findById(id);
    }

    @Delete(':id')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[operator role] 쿠폰 삭제' })
    @ApiOkSuccessResponse(Boolean, '쿠폰 삭제 성공')
    deleteById(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        return this.couponService.deleteById(id);
    }
    
    @Put(':id')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[operator role] 쿠폰 수정' })
    @ApiOkSuccessResponse(CouponDto, '쿠폰 수정 성공')
    updateById(@Param('id', ParseIntPipe) id: number, @Body() couponUpdateDto: CouponUpdateDto): Promise<CouponDto> {
        return this.couponService.save(id, couponUpdateDto);
    }
}
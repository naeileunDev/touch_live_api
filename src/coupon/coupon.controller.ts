import { Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { CouponService } from "./service/coupon.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { CouponDto } from "./dto/coupon.dto";
import { CouponCreateDto } from "./dto/coupon-create.dto";
import { Role } from "src/common/decorator/role.decorator";
import { ALL_PERMISSION, ANY_PERMISSION, OPERATOR_PERMISSION, USER_PERMISSION } from "src/common/permission/permission";
import { CouponUpdateDto } from "./dto/coupon-update.dto";
import { UserCouponService } from "./service/user-coupon.service";
import { GetUser } from "src/common/decorator/get-user.decorator";
import { UserDto } from "src/user/dto";
import { UserCouponDto } from "./dto/user-coupon.dto";

@ApiTags('Coupon')
@Controller('coupon')
@ApiBearerAuth('access-token')
export class CouponController {
    constructor(
        private readonly couponService: CouponService,
        private readonly userCouponService: UserCouponService,
    ) {
    }

    @Post()
    @Role(ANY_PERMISSION)
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

    @Post('issue/:couponId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '[유저 role] 쿠폰 발급' })
    @ApiOkSuccessResponse(CouponDto, '쿠폰 발급 성공')
    issueCoupon(@Param('couponNo') couponNo: string, @GetUser() userDto: UserDto): Promise<any> {
        return this.userCouponService.create(couponNo, userDto.id);
    }

    @Get('users/:userId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '[유저 role] 내 쿠폰 목록 조회 (사용 여부 필터링 가능)' })
    @ApiQuery({ name: 'isUsed', required: false, type: Boolean, description: '사용 여부 필터 (true: 사용한 쿠폰, false: 사용하지 않은 쿠폰, 미지정: 전체)' })
    @ApiOkSuccessResponse(UserCouponDto, '내 쿠폰 목록 조회 성공', true)
    findMyCoupons(
        @Param('userId') userId: string,
        @Query('isUsed', ParseBoolPipe) isUsed?: boolean
    ): Promise<UserCouponDto[]> {
        return this.userCouponService.findByUserId(userId, isUsed);
    }
    @Get(':couponNo')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '쿠폰 번호로 조회, 비회원이 외부에서 유입될 경우의 쿠폰 조회를 위해 모든 타입의 role 접근 가능' })
    @ApiOkSuccessResponse(CouponDto, '쿠폰 번호로 조회 성공')
    getCouponByCouponNo(@Param('couponNo') couponNo: string): Promise<CouponDto> {
        return this.couponService.findByCouponNo(couponNo);
    }
}
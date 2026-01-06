import { Module } from "@nestjs/common";
import { CouponController } from "./coupon.controller";
import { CouponService } from "./coupon.service";
import { CouponRepository } from "./repository/coupon.repository";

@Module({
    controllers: [CouponController],
    providers: [CouponService, CouponRepository],
    exports: [CouponService],
})
export class CouponModule {}
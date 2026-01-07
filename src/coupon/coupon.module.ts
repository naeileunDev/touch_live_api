import { Logger, Module } from "@nestjs/common";
import { CouponController } from "./coupon.controller";
import { CouponService } from "./service/coupon.service";
import { CouponRepository } from "./repository/coupon.repository";
import { UserCouponRepository } from "./repository/user-coupon.repository";
import { UserModule } from "src/user/user.module";
import { UserCouponService } from "./service/user-coupon.service";

@Module({
    imports: [UserModule],
    controllers: [CouponController],
    providers: [Logger, CouponService, CouponRepository, UserCouponRepository, UserCouponService],
    exports: [CouponService, UserCouponService],
})
export class CouponModule {}
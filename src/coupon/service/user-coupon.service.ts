import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserCouponRepository } from "../repository/user-coupon.repository";
import { CouponService } from "./coupon.service";
import { UserService } from "src/user/service/user.service";
import { UserCouponCreateDto } from "../dto/user-coupon-create.dto";
import { UserCouponDto } from "../dto/user-coupon.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class UserCouponService {
    constructor(
        @Inject(Logger) private readonly logger: LoggerService,
        private readonly userCouponRepository: UserCouponRepository,
        private readonly couponService: CouponService,
        private readonly userService: UserService,
    ) {
    }
    
    @Transactional()
    async create(couponNo: string, userPublicId: string): Promise<UserCouponDto> {
        const coupon = await this.couponService.findEntityByCouponNo(couponNo);
        const user = await this.userService.findEntityByPublicId(userPublicId);
        
        // 중복 발급 확인
        const userCoupons = await this.userCouponRepository.findByUserId(user.publicId);
        const alreadyIssued = userCoupons.some(userCoupon => userCoupon.couponId === coupon.id);
        if (alreadyIssued) {
            throw new ServiceException(MESSAGE_CODE.USER_COUPON_ALREADY_ISSUED);
        }
        
        // 원자적 재고 감소 (재고 부족 시 예외 발생)
        await this.couponService.decreaseStock(coupon.id);
        
        // UserCoupon 생성
        const userCoupon = new UserCouponCreateDto(coupon, user);
        const savedUserCoupon = await this.userCouponRepository.createUserCoupon(userCoupon);
        
        // DB에 저장된 createdAt 시간을 기준으로 만료일 계산 (DB 타임존 유지)
        if (coupon.validDays && savedUserCoupon.createdAt) {
            savedUserCoupon.expiresAt = new Date(
                savedUserCoupon.createdAt.getTime() + coupon.validDays * 24 * 60 * 60 * 1000
            );
            await this.userCouponRepository.save(savedUserCoupon);
        }
        
        return new UserCouponDto(savedUserCoupon);
    }

    async findById(id: number): Promise<UserCouponDto> {
        const userCoupon = await this.userCouponRepository.findById(id);
        return new UserCouponDto(userCoupon);
    }

    async findByUserId(publicId: string, isUsed?: boolean): Promise<UserCouponDto[]> {
        const isUsedFilter = typeof(isUsed) === 'boolean' ? isUsed : undefined;
        const userCoupons = await this.userCouponRepository.findByUserId(publicId, isUsedFilter);
        return userCoupons.map(userCoupon => new UserCouponDto(userCoupon));
    }

    /**
     * 쿠폰 사용 처리 (결제 프로세스에서 내부적으로 호출)
     * @param id 사용자 쿠폰 ID
     * @returns 사용 처리된 쿠폰 DTO
     * @throws {ServiceException} 만료되었거나 이미 사용된 쿠폰인 경우 예외 발생
     */
    async useCoupon(id: number): Promise<UserCouponDto> {
        const userCoupon = await this.userCouponRepository.findById(id);
        
        // 만료 여부 확인 (expiresAt이 있는 경우에만 체크)
        if (userCoupon.expiresAt && userCoupon.expiresAt < new Date()) {
            throw new ServiceException(MESSAGE_CODE.USER_COUPON_EXPIRED);
        }
        
        // 이미 사용된 쿠폰인지 확인
        if (userCoupon.isUsed) {
            throw new ServiceException(MESSAGE_CODE.USER_COUPON_ALREADY_USED);
        }
        
        userCoupon.isUsed = true;
        const savedUserCoupon = await this.userCouponRepository.save(userCoupon);
        return new UserCouponDto(savedUserCoupon);
    }

    /**
     * 만료일 기준 일주일 지난 쿠폰 삭제 (사용된 쿠폰은 제외) 주기적으로 실행 (배치 작업)
     * 매일 자정에 실행 
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
        timeZone: 'Asia/Seoul', // 한국 시간 기준
    })
    async deleteExpired(): Promise<void> {
        const startTime = new Date();
        this.logger.log('만료된 쿠폰 삭제 배치 작업 시작');

        try {
            // 만료일 기준 일주일 지난 쿠폰만 삭제 (유예 기간 7일)
            const oneWeekAgo = new Date(startTime.getTime() - 7 * 24 * 60 * 60 * 1000);
            // DB에서 직접 조건에 맞는 쿠폰만 삭제 (모든 쿠폰을 메모리로 로드하지 않음)
            const deletedCount = await this.userCouponRepository.deleteExpired(oneWeekAgo);
            
            const duration = Date.now() - startTime.getTime();
            this.logger.log(
                `만료된 쿠폰 삭제 완료: ${deletedCount}개 삭제됨 (소요시간: ${duration}ms)`
            );
        } catch (error) {
            const duration = Date.now() - startTime.getTime();
            this.logger.error(
                `만료된 쿠폰 삭제 실패 (소요시간: ${duration}ms): ${error.message}`,
                error.stack,
                'deleteExpired'
            );
            // 배치 작업은 에러가 발생해도 다음 실행에 영향을 주지 않도록 throw하지 않음
        }
    }

}
import { Injectable } from "@nestjs/common";
import { CouponCreateDto } from "./dto/coupon-create.dto";
import { CouponDto } from "./dto/coupon.dto";
import { CouponRepository } from "./repository/coupon.repository";
import { CouponUpdateDto } from "./dto/coupon-update.dto";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { DiscountType } from "./enum/coupon.enum";
import { ServiceException } from "src/common/filter/exception/service.exception";

@Injectable()
export class CouponService {
    constructor(
        private readonly couponRepository: CouponRepository,
    ) {
    }

    async create(couponCreateDto: CouponCreateDto): Promise<CouponDto> {
        this.validateIssuableUntil(couponCreateDto.issuableUntil);
        this.validateAmount(couponCreateDto.discountType, couponCreateDto.amount);
        this.validateMaxDiscountAmount(couponCreateDto.maxDiscountAmount, couponCreateDto.discountType);
        const coupon = await this.couponRepository.createCoupon(couponCreateDto);
        return new CouponDto(coupon);
    }

    async findById(id: number): Promise<CouponDto> {
        const coupon = await this.couponRepository.findById(id);
        return new CouponDto(coupon);
    }

    async findAllNotExpired(): Promise<CouponDto[]> {
        const coupons = await this.couponRepository.findAllNotExpired();
        return coupons.map(coupon => new CouponDto(coupon));
    }

    async deleteById(id: number): Promise<boolean> {
        return await this.couponRepository.deleteById(id);
    }
    
    // 업데이트 시 재고와 discountType 변경 불가
    async save(id: number, dto: CouponUpdateDto): Promise<CouponDto> {
        const coupon = await this.couponRepository.findById(id);
        this.validateIssuableUntil(dto.issuableUntil, coupon.createdAt);
        this.validateAmount(coupon.discountType, dto.amount);       
        Object.keys(dto).forEach(key => {
            if (dto[key] !== undefined) {
                coupon[key] = dto[key];
            }
        });
        
        return new CouponDto(await this.couponRepository.save(coupon));
    }
    // 만료일시 유효검사 
    private validateIssuableUntil(issuableUntil: Date | undefined, createdAt?: Date): void {
        if (!issuableUntil) return;
        
        if (issuableUntil < new Date()) {
            throw new ServiceException(MESSAGE_CODE.COUPON_EXPIRED_TIME_INVALID);
        }
        if (createdAt && issuableUntil < createdAt) {
            throw new ServiceException(MESSAGE_CODE.COUPON_EXPIRED_TIME_INVALID);
        }
    }

    // 할인 금액/퍼센트 유효검사
    private validateAmount(discountType: DiscountType, amount: number | undefined): void {
        if (amount === undefined) return;

        if (discountType === DiscountType.Amount && (amount < 1000 || amount === 0)) {
            throw new ServiceException(MESSAGE_CODE.COUPON_AMOUNT_INVALID);
        }
        if (discountType === DiscountType.Percentage && (amount > 100 || amount === 0)) {
            throw new ServiceException(MESSAGE_CODE.COUPON_PERCENTAGE_INVALID);
        }
    }

    private validateMaxDiscountAmount(maxDiscountAmount: number | undefined, discountType: DiscountType): void {
        if (maxDiscountAmount === undefined) return;
        if (discountType === DiscountType.Percentage) return;
        //amount 가 따로있으므로 할인 금액 최대 금액 검사 필요 없음
        if (discountType === DiscountType.Amount && maxDiscountAmount) {
            throw new ServiceException(MESSAGE_CODE.COUPON_MAX_DISCOUNT_AMOUNT_NOT_ALLOWED);
        }
    }
}
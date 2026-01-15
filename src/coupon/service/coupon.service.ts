import { Injectable } from "@nestjs/common";
import { CouponCreateDto } from "../dto/coupon-create.dto";
import { CouponDto } from "../dto/coupon.dto";
import { CouponRepository } from "../repository/coupon.repository";
import { CouponUpdateDto } from "../dto/coupon-update.dto";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { DiscountType } from "../enum/coupon.enum";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { Coupon } from "../entity/coupon.entity";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";

@Injectable()
export class CouponService {
    constructor(
        private readonly couponRepository: CouponRepository,
    ) {
    }
    //* 쿠폰 생성 시 유효성 검사 및 쿠폰 번호 생성 *//
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

    async findEntityById(id: number): Promise<Coupon> {
        const coupon = await this.couponRepository.findById(id);
        return coupon;
    }

    async findAllNotExpired(pagination: PaginationDto): Promise<{coupons: CouponDto[], total: number}> {
        const { coupons, total } = await this.couponRepository.findAllNotExpired(pagination);
        return { coupons: coupons.map(coupon => new CouponDto(coupon)), total };
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
    /**
     * 재고를 원자적으로 감소시킴 (동시성 문제 방지)
     * @param couponId 쿠폰 ID
     * @throws {ServiceException} 재고가 부족한 경우 예외 발생
     */
    async decreaseStock(couponId: number): Promise<void> {
        const success = await this.couponRepository.decreaseStockAtomically(couponId);
        if (!success) {
            throw new ServiceException(MESSAGE_CODE.COUPON_OUT_OF_STOCK);
        }
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
    //* 최대 할인 금액 유효성 검사 *//
    private validateMaxDiscountAmount(maxDiscountAmount: number | undefined, discountType: DiscountType): void {
        if (maxDiscountAmount === undefined) return;
        if (discountType === DiscountType.Percentage) return;
        //amount 가 따로있으므로 할인 금액 최대 금액 검사 필요 없음
        if (discountType === DiscountType.Amount && maxDiscountAmount) {
            throw new ServiceException(MESSAGE_CODE.COUPON_MAX_DISCOUNT_AMOUNT_NOT_ALLOWED);
        }
    }

    async findByCouponNo(couponNo: string): Promise<CouponDto> {
        const coupon = await this.couponRepository.findByCouponNo(couponNo);
        if (!coupon) {
            throw new ServiceException(MESSAGE_CODE.COUPON_NOT_FOUND);
        }
        return new CouponDto(coupon);
    }
    
    async findEntityByCouponNo(couponNo: string): Promise<Coupon> {
        const coupon = await this.couponRepository.findByCouponNo(couponNo);
        if (!coupon) {
            throw new ServiceException(MESSAGE_CODE.COUPON_NOT_FOUND);
        }
        return coupon;
    }
}

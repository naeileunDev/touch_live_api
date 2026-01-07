import { DataSource, DeleteResult, MoreThan, Repository } from "typeorm";
import { Coupon } from "../entity/coupon.entity";
import { CouponCreateDto } from "../dto/coupon-create.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CouponRepository extends Repository<Coupon> {
    constructor(private dataSource: DataSource) {
        super(Coupon, dataSource.createEntityManager());
    }

    async createCoupon(couponCreateDto: CouponCreateDto): Promise<Coupon> {
        const coupon = this.create(couponCreateDto);
        return await this.save(coupon);
    }

    async findById(id: number): Promise<Coupon> {
        const coupon = await this.findOne({ where: { id } });
        if (!coupon) {
            throw new ServiceException(MESSAGE_CODE.COUPON_NOT_FOUND);
        }
        return coupon;
    }

    async findAllNotExpired(): Promise<Coupon[]> {
        return await this.find(
            {
                where: {
                    issuableUntil: MoreThan(new Date()),
                },
                order: {
                    createdAt: 'DESC',
                },
            }
        );
    }

    async deleteById(id: number): Promise<boolean> {
        await this.findById(id);
        const rtn: DeleteResult = await this.softDelete({ 
            id,
        });
        return rtn.affected > 0;
    }
}     
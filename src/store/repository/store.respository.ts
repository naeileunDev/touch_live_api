import { DataSource, DeleteResult, Repository } from "typeorm";
import { Store } from "../entities/store.entity";
import { Injectable } from "@nestjs/common";
import { StoreRegisterLogDto } from "../dto/store-register-log.dto";
import { User } from "src/user/entities/user.entity";
import { StoreStatusType } from "../enum/store-status-type.enum";
import { StoreRegisterStatus } from "../enum/store-register-status.enum";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class StoreRepository extends Repository<Store> {
    constructor(private dataSource: DataSource) {
        super(Store, dataSource.createEntityManager());
    }
    
    async createStore(createDto: StoreRegisterLogDto, user: User, fee: number): Promise<Store> {
        const store = await this.create({
            name: createDto.name,
            phone: createDto.phone,
            email: createDto.email,
            storeInfo: createDto.storeInfo,
            businessRegistrationNumber: createDto.businessRegistrationNumber,
            businessRegistrationImageId: createDto.businessRegistrationImageId,
            ceoName: createDto.ceoName,
            businessType: createDto.businessType,
            businessCategory: createDto.businessCategory,
            eCommerceLicenseNumber: createDto.eCommerceLicenseNumber,
            eCommerceLicenseImageId: createDto.eCommerceLicenseImageId,
            bankName: createDto.bankName,
            accountNumber: createDto.accountNumber,
            accountOwner: createDto.accountOwner,
            accountImageId: createDto.accountImageId,
            category: createDto.category,
            mainTags: createDto.mainTags,
            subTags: createDto.subTags,
            storeBannerImageId: createDto.storeBannerImageId ?? null,
            storeProfileImageId: createDto.storeProfileImageId ?? null,
            saleChageRate: fee,
            status: createDto.status === StoreRegisterStatus.Approved 
                ? StoreStatusType.Active 
                : StoreStatusType.Inactive,
            user: user,
            isVisible: createDto.status === StoreRegisterStatus.Approved,
        });
        return await this.save(store);
    }
    async findById(id: number): Promise<Store> {
        const store = await this.findOne({
            where: {
                id,
            },
            relations: ['user'],
        });
        return store;
    }
    async deleteById(id: number): Promise<boolean> {
        const store = await this.findById(id);
        if (!store) {
            throw new ServiceException(MESSAGE_CODE.STORE_NOT_FOUND);
        }
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected > 0;
    }
}
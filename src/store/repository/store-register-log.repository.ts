import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StoreRegisterLog } from "../entity/store-register-log.entity";
import { StoreCreateDto } from "../dto/store-create.dto";
import { User } from "src/user/entity/user.entity";
import { StoreFilesDto } from "../dto/store-files.dto";
import { StoreRegisterStatus } from "../enum/store-register-status.enum";
import { FileCommonDto } from "src/file/dto/file-common-dto";

@Injectable()
export class StoreRegisterLogRepository extends Repository<StoreRegisterLog> {
    constructor(private readonly dataSource: DataSource) {
        super(StoreRegisterLog, dataSource.createEntityManager());
    }

    async saveStoreRegisterLog(storeCreateDto: StoreCreateDto, user: User, filesDto: StoreFilesDto): Promise<StoreRegisterLog> {
        const storeRegisterLog = new StoreRegisterLog();
        storeRegisterLog.user = user;
        storeRegisterLog.name = storeCreateDto.name;
        storeRegisterLog.phone = storeCreateDto.phone;
        storeRegisterLog.email = storeCreateDto.email;
        storeRegisterLog.businessRegistrationNumber = storeCreateDto.businessRegistrationNumber;
        storeRegisterLog.businessRegistrationImageId = filesDto.businessRegistrationImageId;
        storeRegisterLog.ceoName = storeCreateDto.ceoName;
        storeRegisterLog.businessType = storeCreateDto.businessType;
        storeRegisterLog.businessCategory = storeCreateDto.businessCategory;
        storeRegisterLog.eCommerceLicenseNumber = storeCreateDto.eCommerceLicenseNumber;
        storeRegisterLog.eCommerceLicenseImageId = filesDto.eCommerceLicenseImageId;
        storeRegisterLog.bankName = storeCreateDto.bankName;
        storeRegisterLog.accountNumber = storeCreateDto.accountNumber;
        storeRegisterLog.accountOwner = storeCreateDto.accountOwner;
        storeRegisterLog.accountImageId = filesDto.accountImageId;
        storeRegisterLog.status = StoreRegisterStatus.Pending;
        storeRegisterLog.registerAt = null;
        storeRegisterLog.registerFailedAt = null;
        storeRegisterLog.storeProfileImageId = filesDto.profileImageId ?? null;
        storeRegisterLog.storeBannerImageId = filesDto.bannerImageId ?? null;
        storeRegisterLog.mainTagIds = storeCreateDto.mainTag.map(tag => tag.id);
        storeRegisterLog.subTagIds = storeCreateDto.subTag.map(tag => tag.id);
        return await this.save(storeRegisterLog);
    }
}
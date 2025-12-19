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
        storeRegisterLog.businessRegistrationImage = filesDto.businessRegistrationImage;
        storeRegisterLog.ceoName = storeCreateDto.ceoName;
        storeRegisterLog.businessType = storeCreateDto.businessType;
        storeRegisterLog.businessCategory = storeCreateDto.businessCategory;
        storeRegisterLog.eCommerceLicenseNumber = storeCreateDto.eCommerceLicenseNumber;
        storeRegisterLog.eCommerceLicenseImage = {id: filesDto.eCommerceLicenseImage.id, fileUrl: filesDto.eCommerceLicenseImage.fileUrl};
        storeRegisterLog.bankName = storeCreateDto.bankName;
        storeRegisterLog.accountNumber = storeCreateDto.accountNumber;
        storeRegisterLog.accountOwner = storeCreateDto.accountOwner;
        storeRegisterLog.accountImage = {id: filesDto.accountImage.id, fileUrl: filesDto.accountImage.fileUrl};
        storeRegisterLog.status = StoreRegisterStatus.Pending;
        storeRegisterLog.registerAt = null;
        storeRegisterLog.registerFailedAt = null;
        storeRegisterLog.storeProfileImage = filesDto.profileImage ? {id: filesDto.profileImage.id, fileUrl: filesDto.profileImage.fileUrl} : null;
        storeRegisterLog.storeBannerImage = filesDto.bannerImage ? {id: filesDto.bannerImage.id, fileUrl: filesDto.bannerImage.fileUrl} : null;
        storeRegisterLog.mainTag = storeCreateDto.mainTag;
        storeRegisterLog.subTag = storeCreateDto.subTag;
        return await this.save(storeRegisterLog);
    }
}
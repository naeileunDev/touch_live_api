import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StoreRegisterLog } from "../entity/store-register-log.entity";
import { StoreCreateDto } from "../dto/store-create.dto";
import { User } from "src/user/entity/user.entity";
import { StoreFilesDto } from "../dto/store-files.dto";
import { StoreRegisterStatus } from "../enum/store-register-status.enum";
import { FileCommonDto } from "src/file/dto/file-common-dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class StoreRegisterLogRepository extends Repository<StoreRegisterLog> {
    constructor(private readonly dataSource: DataSource) {
        super(StoreRegisterLog, dataSource.createEntityManager());
    }

    async saveStoreRegisterLog(storeCreateDto: StoreCreateDto, user: User, filesDto: StoreFilesDto): Promise<StoreRegisterLog> {
        const { mainTag, subTag, fcmToken, ...storeData } = storeCreateDto;
        return await this.save(
            this.create({
                ...storeData, 
                user,
                businessRegistrationImageId: filesDto.businessRegistrationImage.id,
                eCommerceLicenseImageId: filesDto.eCommerceLicenseImage.id,
                accountImageId: filesDto.accountImage.id,
                storeProfileImageId: filesDto.profileImage?.id ?? null,
                storeBannerImageId: filesDto.bannerImage?.id ?? null,
                mainTagIds: mainTag.map(tag => tag.id),
                subTagIds: subTag.map(tag => tag.id),
            })
        );
    }

    async findEntityById(id: number): Promise<StoreRegisterLog> {
        const log = await this.findOne({
            where:{ 
                id,
            },
            relations: ['user'],
        });
        if (!log) {
            throw new ServiceException(MESSAGE_CODE.STORE_REGISTER_LOG_NOT_FOUND);
        }
        return log;
    }
}
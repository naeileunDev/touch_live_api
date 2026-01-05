import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { StoreRegisterLog } from "../entities/store-register-log.entity";
import { StoreRegisterLogCreateDto } from "../dto/store-register-log-create.dto";
import { User } from "src/user/entities/user.entity";
import { StoreFilesDto } from "../dto/store-files.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class StoreRegisterLogRepository extends Repository<StoreRegisterLog> {
    constructor(private readonly dataSource: DataSource) {
        super(StoreRegisterLog, dataSource.createEntityManager());
    }

    async saveStoreRegisterLog(createDto: StoreRegisterLogCreateDto, user: User, filesDto: StoreFilesDto): Promise<StoreRegisterLog> {
        const {  fcmToken, ...storeData } = createDto;
        return await this.save(
            this.create({
                ...storeData, 
                user,
                businessRegistrationImageId: filesDto.businessRegistrationImage.id,
                eCommerceLicenseImageId: filesDto.eCommerceLicenseImage.id,
                accountImageId: filesDto.accountImage.id,
                storeProfileImageId: filesDto.profileImage?.id ?? null,
                storeBannerImageId: filesDto.bannerImage?.id ?? null,
                mainTags: createDto.mainTags,
                subTags: createDto.subTags,
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
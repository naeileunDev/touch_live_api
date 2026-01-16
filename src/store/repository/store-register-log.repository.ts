import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { StoreRegisterLog } from "../entity/store-register-log.entity";
import { StoreRegisterLogCreateDto } from "../dto/store-register-log-create.dto";
import { User } from "src/user/entity/user.entity";
import { StoreFilesDto } from "../dto/store-files.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";

@Injectable()
export class StoreRegisterLogRepository extends Repository<StoreRegisterLog> {
    constructor(private readonly dataSource: DataSource) {
        super(StoreRegisterLog, dataSource.createEntityManager());
    }

    async createStoreRegisterLog(createDto: StoreRegisterLogCreateDto, files: StoreFilesDto, user: User): Promise<StoreRegisterLog> {
        const {  fcmToken, ...storeData } = createDto;
        const fileDtos = [files.businessRegistrationImage.id, files.eCommerceLicenseImage.id, files.accountImage.id, files.profileImage.id, files.bannerImage.id];
        const entity = this.create({
            ...storeData,
            businessRegistrationImageId: fileDtos[0],
            eCommerceLicenseImageId: fileDtos[1],
            accountImageId: fileDtos[2],
            storeProfileImageId: fileDtos[3],
            storeBannerImageId: fileDtos[4],
            user,
        });
        await this.save(entity)
        return entity;
    }

    async findById(id: number): Promise<StoreRegisterLog> {
        const entity = await this.findOne({
            where: { 
                id,
            },
            relations: ['user'],
            order: {
                createdAt: 'DESC',
            },
        });
        if (!entity) {
            throw new ServiceException(MESSAGE_CODE.STORE_REGISTER_LOG_NOT_FOUND);
        }
        return entity;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected > 0;
    }

    async findAllByUserId(publicId: string, pagination?: PaginationDto): Promise<{logs: StoreRegisterLog[], total: number}> {
        const { page, limit } = pagination;
        const [logs, total] = await this.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            where: {
                user: {
                    publicId,
                },
            },
            relations: ['user'],
            order: {
                createdAt: 'DESC',
            },
        });
        return { logs, total };
    }
}
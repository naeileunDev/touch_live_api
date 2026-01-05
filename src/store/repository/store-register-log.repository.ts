import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { StoreRegisterLog } from "../entities/store-register-log.entity";
import { StoreRegisterLogCreateDto } from "../dto/store-register-log-create.dto";
import { User } from "src/user/entities/user.entity";
import { StoreFilesDto } from "../dto/store-files.dto";

@Injectable()
export class StoreRegisterLogRepository extends Repository<StoreRegisterLog> {
    constructor(private readonly dataSource: DataSource) {
        super(StoreRegisterLog, dataSource.createEntityManager());
    }

    async createStoreRegisterLog(createDto: StoreRegisterLogCreateDto, user: User, filesDto: StoreFilesDto): Promise<StoreRegisterLog> {
        const {  fcmToken, ...storeData } = createDto;
        
        const entity = this.create({
            ...storeData, 
            user,
            businessRegistrationImageId: filesDto.businessRegistrationImage.id,
            eCommerceLicenseImageId: filesDto.eCommerceLicenseImage.id,
            accountImageId: filesDto.accountImage.id,
            storeProfileImageId: filesDto.profileImage?.id ?? null,
            storeBannerImageId: filesDto.bannerImage?.id ?? null,
        });
        await this.save(entity)
        return entity;
    }

    async findById(id: number): Promise<StoreRegisterLog | null> {
        const entity = await this.findOne({
            where:{ 
                id,
            },
            relations: ['user'],
        });
        return entity;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected > 0;
    }

    async findAllByUserId(publicId: string): Promise<[StoreRegisterLog[], number]> {
        const logs = await this.findAndCount({
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
        return logs;
    }
}
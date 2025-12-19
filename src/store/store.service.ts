import { Injectable } from '@nestjs/common';
import { StoreCreateDto } from './dto/store-create.dto';
import { User } from 'src/user/entity/user.entity';
import { StoreRepository } from './repository/store.respository';
import { StoreRegisterLogRepository } from './repository/store-register-log.repository';
import { FileService } from 'src/file/file.service';
import { ContentCategory, UsageType } from 'src/file/enum/file-category.enum';
import { FileCommonDto } from 'src/file/dto/file-common-dto';
import { StoreRegisterLog } from './entity/store-register-log.entity';
import { StoreFilesDto } from './dto/store-files.dto';
import { FileDto } from 'src/file/dto/file.dto';
import { StoreRegisterLogDto } from './dto/store-register-log.dto';
import { TagCommonDto } from 'src/tag/dto/tag-common.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storeRegisterLogRepository: StoreRegisterLogRepository,
    private readonly FileService: FileService,
  ) {
  }
  @Transactional()
  async create(storeCreateDto: StoreCreateDto, user: User, files: any) {
    console.log(storeCreateDto, user.id);
    console.log(storeCreateDto.mainTag, storeCreateDto.subTag);
    const filesDto: Record<string, FileDto> = {};
    
    // ✅ 파일 필드와 UsageType 매핑
    const fileMappings = [
        { field: 'businessRegistrationImage', usageType: UsageType.BusinessRegistrationImage },
        { field: 'eCommerceLicenseImage', usageType: UsageType.eCommerceLicenseImage },
        { field: 'accountImage', usageType: UsageType.AccountImage },
        { field: 'profileImage', usageType: UsageType.Profile },
        { field: 'bannerImage', usageType: UsageType.Banner },
    ];
    
    for (const mapping of fileMappings) {
        const fileArray = files[mapping.field];
        if (fileArray?.[0]) {
            filesDto[mapping.field] = await this.FileService.saveLocalToUploads(
                fileArray[0],
                {
                    contentCategory: ContentCategory.User,
                    usageType: mapping.usageType,
                    contentId: user.id,
                }
            );
        }
    }
    
    storeCreateDto.mainTag = storeCreateDto.mainTag.map(tag => {
        const dto = new TagCommonDto();
        dto.id = tag.id;
        dto.name = tag.name;
        return dto;
    });
    storeCreateDto.subTag = storeCreateDto.subTag.map(tag => {
        const dto = new TagCommonDto();
        dto.id = tag.id;
        dto.name = tag.name;
        return dto;
    });
    console.log(filesDto);
    const storeRegisterLog = await this.storeRegisterLogRepository.saveStoreRegisterLog(storeCreateDto, user, new StoreFilesDto(filesDto));
    return storeRegisterLog;
  }
}

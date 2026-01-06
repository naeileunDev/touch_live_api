import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { File } from "../entity/file.entity";
import { FileDto } from "../dto/file.dto";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { ServiceException } from "src/common/filter/exception/service.exception";

@Injectable()
export class FileRepository extends Repository<File> {
    constructor(private dataSource: DataSource) {
        super(File, dataSource.createEntityManager());
    }

    async createFile(file: FileDto): Promise<File> {
        const fileEntity = this.create({
            contentCategory: file.contentCategory,
            mediaType: file.mediaType,
            mimeType: file.mimeType,
            usageType: file.usageType,
            originalName: file.originalName,
            fileUrl: file.fileUrl,
            duration: file.duration,
            contentId: file.contentId,
        });
        return await this.save(fileEntity);
    }

    async findById(id: number): Promise<File> {
        const file = await this.findOneBy({id});
        if (!file) {
            throw new ServiceException(MESSAGE_CODE.FILE_NOT_FOUND);
        }
        return file;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected > 0;
    }
}
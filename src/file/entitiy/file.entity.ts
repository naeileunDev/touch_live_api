import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";
import { ResolutionGradeType } from "../enum/resolution-grade-type.enum";

@Entity()
export class File extends BaseEntity {
    @Column({ type: 'varchar', length: 255, comment: '파일 이름' })
    fileName: string;

    @Column({ type: 'varchar', length: 255, comment: '파일 경로' })
    filePath: string;

    @Column({ type: 'varchar', length: 255, comment: '파일 타입' })
    fileType: string;

    @Column({ type: 'varchar', length: 255, comment: '파일 크기' })
    fileSize: number;

    @Column({ type: 'varchar', length: 255, comment: '영상 길이' })
    duration: number;

    @Column({ type: 'varchar', length: 255, comment: '영상 너비' })
    width: number;

    @Column({ type: 'varchar', length: 255, comment: '영상 높이' })
    height: number;

    @Column({ type: 'varchar', length: 255, comment: '영상 해상도 등급' })
    resolutionGrade: ResolutionGradeType;
}

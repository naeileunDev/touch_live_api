import * as path from "path";
import { ConvertHtmlToMarkdownDto } from "./dto/convert-html-to-markdown.dto";
import { TermTemplateCreateDto } from "./dto/term-template-create.dto";
import { TermsTemplate } from "./entity/terms-template.entity";
import { TermsType } from "./enum/term-type.enum";
import { TermsTemplateRepository } from "./repository/terms-template.repository";
import { BadRequestException, Injectable } from "@nestjs/common";
import * as TurndownService from 'turndown';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TermService {
    private readonly turndownService: TurndownService;
    constructor(
        private readonly termsTemplateRepository: TermsTemplateRepository,
        private readonly configService: ConfigService
    ) {
        this.turndownService = new TurndownService();
    }


    convertHtmlToMarkdown(dto: ConvertHtmlToMarkdownDto): string {
        return this.turndownService.turndown(dto.html);
    }

        /**
     * 파일 경로에서 HTML을 읽어서 Markdown으로 변환
     * @param filePath 파일 경로
     * @returns Markdown 문자열
     */
    async convertHtmlFileToMarkdown(dto: ConvertHtmlToMarkdownDto): Promise<string> {
        if (!dto.filePath) {
            throw new BadRequestException('filePath는 필수입니다.');
        }
        const basePath = this.configService.get<string>('TERM_HTML_FILE_BASE_PATH');
        // file:// 또는 file:/ 프로토콜 제거
        let cleanFilePath = dto.filePath.trim();
        if (cleanFilePath.startsWith('file://')) {
            cleanFilePath = cleanFilePath.replace(/^file:\/\//, '');
        } else if (cleanFilePath.startsWith('file:/')) {
            cleanFilePath = cleanFilePath.replace(/^file:\//, '');
        }
        
        // 프로젝트 루트 기준으로 basePath를 절대 경로로 변환
        const projectRoot = process.cwd();
        const resolvedBasePath = path.isAbsolute(basePath) 
            ? path.normalize(basePath)
            : path.join(projectRoot, path.normalize(basePath));
        
        const normalizedBasePath = path.normalize(resolvedBasePath);
        const normalizedFilePath = path.normalize(cleanFilePath);
        
        let normalizedFullPath: string;
        
        // 절대 경로인 경우와 상대 경로인 경우 구분
        if (path.isAbsolute(normalizedFilePath)) {
            // 절대 경로인 경우: basePath 내에 있는지 확인만
            normalizedFullPath = normalizedFilePath;
            
            // 보안: 허용된 basePath 내에 있는지 확인
            if (!normalizedFullPath.startsWith(normalizedBasePath)) {
                throw new BadRequestException('허용되지 않은 파일 경로입니다.');
            }
        } else {
            // 상대 경로인 경우: basePath와 결합
            const fullPath = path.join(normalizedBasePath, normalizedFilePath);
            normalizedFullPath = path.normalize(fullPath);
            
            // 보안: 허용된 basePath 내에 있는지 확인
            if (!normalizedFullPath.startsWith(normalizedBasePath)) {
                throw new BadRequestException('허용되지 않은 파일 경로입니다.');
            }
        }
        
        // 파일 확장자 검증
        if (!normalizedFullPath.endsWith('.html') && !normalizedFullPath.endsWith('.htm')) {
            throw new BadRequestException('HTML 파일만 허용됩니다.');
        }
    
        try {
            // 파일 읽기
            const htmlContent = await fs.readFile(normalizedFullPath, 'utf-8');
    
            // HTML에서 body 내용만 추출 (선택사항)
            const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            const htmlToConvert = bodyMatch ? bodyMatch[1] : htmlContent;
            
            return this.convertHtmlToMarkdown({ html: htmlToConvert });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`파일을 읽을 수 없습니다: ${error.message}`);
        }
    }




    async findTermsTemplateByType(type: TermsType): Promise<TermsTemplate | null> {
        return await this.termsTemplateRepository.findOne({ where: { type } });
    }

    async createTermsTemplate(dto: TermTemplateCreateDto): Promise<TermsTemplate> {
        // 1) 최신 버전 조회
        const latest = await this.termsTemplateRepository.findOne({
          where: { type: dto.type },
          order: { createdAt: 'DESC' },
        });
      
        // 2) 버전 증가 로직
        const newVersion = latest
          ? (parseFloat(latest.version) + 0.1).toFixed(1)
          : '1.0';
      
        // 3) 기존 버전 비활성화
        if (latest) {
          await this.termsTemplateRepository.update(
            { type: dto.type, isActive: true },
            { isActive: false }
          );
        }
        let content: string;
        if (dto.cotent?.html) {
            content = this.convertHtmlToMarkdown({ html: dto.cotent.html });
        } else if (dto.cotent?.filePath) {
            content = await this.convertHtmlFileToMarkdown({ filePath: dto.cotent.filePath });
        } else {
            throw new BadRequestException('html 또는 filePath 중 하나는 필수입니다.');
        }
      
        // 4) 새 버전 생성
        const newTerms = this.termsTemplateRepository.create({
          type: dto.type,
          content: content,
          version: newVersion,
          isRequired: dto.isRequired,
          isActive: true,
        });
      
        return this.termsTemplateRepository.save(newTerms);
      }
}
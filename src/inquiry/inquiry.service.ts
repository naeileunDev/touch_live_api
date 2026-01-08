import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductInquiry } from './entity/product-inquiry.entity';
import { ProductInquiryAnswer } from './entity/product-inquiry-answer.entity';
import { CreateProductInquiryDto, UpdateProductInquiryDto, CreateInquiryAnswerDto } from './dto/inquiry.dto';

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(ProductInquiry)
        private readonly inquiryRepository: Repository<ProductInquiry>,
        @InjectRepository(ProductInquiryAnswer)
        private readonly answerRepository: Repository<ProductInquiryAnswer>,
    ) {}

    async createInquiry(userId: number, dto: CreateProductInquiryDto): Promise<ProductInquiry> {
        const inquiry = this.inquiryRepository.create({
            userId,
            ...dto,
        });
        return this.inquiryRepository.save(inquiry);
    }

    async getInquiries(productId: number, page = 1, limit = 20) {
        const [items, total] = await this.inquiryRepository.findAndCount({
            where: { productId, deletedAt: null },
            relations: ['user', 'answer'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { items, total, page, limit };
    }

    async getMyInquiries(userId: number, page = 1, limit = 20) {
        const [items, total] = await this.inquiryRepository.findAndCount({
            where: { userId, deletedAt: null },
            relations: ['product', 'answer'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { items, total, page, limit };
    }

    async getInquiry(id: number, userId?: number): Promise<ProductInquiry> {
        const inquiry = await this.inquiryRepository.findOne({
            where: { id, deletedAt: null },
            relations: ['user', 'product', 'answer'],
        });

        if (!inquiry) {
            throw new NotFoundException('문의를 찾을 수 없습니다.');
        }

        // 비밀글 체크
        if (inquiry.isSecret && inquiry.userId !== userId) {
            throw new ForbiddenException('비밀글은 작성자만 볼 수 있습니다.');
        }

        return inquiry;
    }

    async updateInquiry(id: number, userId: number, dto: UpdateProductInquiryDto): Promise<ProductInquiry> {
        const inquiry = await this.inquiryRepository.findOne({
            where: { id, userId, deletedAt: null },
        });

        if (!inquiry) {
            throw new NotFoundException('문의를 찾을 수 없습니다.');
        }

        if (inquiry.isAnswered) {
            throw new ForbiddenException('답변이 등록된 문의는 수정할 수 없습니다.');
        }

        Object.assign(inquiry, dto);
        return this.inquiryRepository.save(inquiry);
    }

    async deleteInquiry(id: number, userId: number): Promise<void> {
        const inquiry = await this.inquiryRepository.findOne({
            where: { id, userId, deletedAt: null },
        });

        if (!inquiry) {
            throw new NotFoundException('문의를 찾을 수 없습니다.');
        }

        inquiry.deletedAt = new Date();
        await this.inquiryRepository.save(inquiry);
    }

    // === 답변 ===
    // async createAnswer(inquiryId: number, storeId: number, dto: CreateInquiryAnswerDto): Promise<ProductInquiryAnswer> {
    //     const inquiry = await this.inquiryRepository.findOne({
    //         where: { id: inquiryId, deletedAt: null },
    //         relations: ['product'],
    //     });

    //     if (!inquiry) {
    //         throw new NotFoundException('문의를 찾을 수 없습니다.');
    //     }

    //     if (inquiry.product.storeId !== storeId) {
    //         throw new ForbiddenException('해당 상품의 판매자만 답변할 수 있습니다.');
    //     }

    //     if (inquiry.isAnswered) {
    //         throw new ForbiddenException('이미 답변이 등록된 문의입니다.');
    //     }

    //     const answer = this.answerRepository.create({
    //         inquiryId,
    //         storeId,
    //         content: dto.content,
    //     });

    //     await this.answerRepository.save(answer);

    //     // 문의 상태 업데이트
    //     inquiry.isAnswered = true;
    //     await this.inquiryRepository.save(inquiry);

    //     return answer;
    // }
}

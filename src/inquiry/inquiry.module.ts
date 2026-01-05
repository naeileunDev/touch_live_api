import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';
import { ProductInquiry } from './entity/product-inquiry.entity';
import { ProductInquiryAnswer } from './entity/product-inquiry-answer.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductInquiry,
            ProductInquiryAnswer,
        ]),
    ],
    controllers: [InquiryController],
    providers: [InquiryService],
    exports: [InquiryService],
})
export class InquiryModule {}

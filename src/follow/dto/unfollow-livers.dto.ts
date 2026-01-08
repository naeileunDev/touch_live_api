import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ArrayMinSize } from 'class-validator';

export class UnfollowLiversDto {
    @ApiProperty({ 
        description: '팔로잉 유저 ID 배열', 
        type: [Number],
        example: [1, 2, 3],
        isArray: true
    })
    @IsArray()
    @IsInt({ each: true })
    @ArrayMinSize(1)
    livers: number[];
}

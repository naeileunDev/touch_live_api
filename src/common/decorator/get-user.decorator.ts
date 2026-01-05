import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/user.entity';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserDto | null => {
        const req = ctx.switchToHttp().getRequest();
        const user = req?.user as User;
        
        if (!user) {
            return null;
        }
        
        return new UserDto(user);
    },
);

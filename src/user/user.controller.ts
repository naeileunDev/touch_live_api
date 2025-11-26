import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth('access-token')
export class UserController {
    constructor(private readonly userService: UserService) { }


}

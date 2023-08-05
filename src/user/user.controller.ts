import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserResponseDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { Authenticate } from './guards/Authenticate.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Serialize(UserResponseDto)
@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signup(@Body() data: CreateUserDto) {
    return this.authService.signup(data);
  }

  @Post('signin')
  async signin(@Body() data: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(data);
    session.userId = user.id;
    return user;
  }

  @Get('whoami')
  @Authenticate()
  whoami(@CurrentUser() user: any) {
    console.log(user);
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({
      id: parseInt(id),
    });
  }

  @Get()
  @Authenticate()
  find(@Query('email') email: string) {
    return this.userService.find({
      email,
    });
  }

  @Patch(':id')
  @Authenticate()
  update(@Param('id') id: string, @Body() dataUpdate: UpdateUserDto) {
    return this.userService.update(parseInt(id), dataUpdate);
  }

  @Delete(':id')
  @Authenticate()
  delete(@Param('id') id: string) {
    return this.userService.delete(parseInt(id));
  }
}

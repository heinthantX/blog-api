import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './models/create-user.dto';
import { UpdateUserDto } from './models/update-user.dto';
import { LoginUserDto } from './models/login-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.gurad';
import { RolesGuard } from 'src/auth/guards/roles.gurad';
import { Roles } from 'src/auth/decorators/role.decorator';
import { userRole } from './models/user.role';
import { updateUserRoleDto } from './models/update-user-role.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginData: LoginUserDto) {
    return this.userService.login(loginData);
  }

  @Roles(userRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    delete updateUserDto['role'];
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(userRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id') id: string, @Body() user: updateUserRoleDto) {
    return this.userService.update(Number(id), user);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}

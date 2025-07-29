import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { toUserResponseDto } from './user.mapper';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    const { users, total, currentPage, totalPages } =
      await this.userService.findAll(page, limit);
    return {
      users,
      total,
      currentPage,
      totalPages,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return toUserResponseDto(user);
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const created = await this.userService.createUser(dto);
    return toUserResponseDto(created);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updated = await this.userService.updateUser(id, dto);
    return toUserResponseDto(updated);
  }
}

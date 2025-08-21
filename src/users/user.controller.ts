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
  DefaultValuePipe,
  Req,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { toUserResponseDto } from './user.mapper';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  private getInstitutionFromHeader(req: Request): number | undefined {
    const raw = req.headers['x-institution-id'];
    // Puede venir como string | string[]
    return Array.isArray(raw) ? Number(raw[0]) : Number(raw);
  }

  @Get()
  async getUsers(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const instId = this.getInstitutionFromHeader(req);
    const { users, total, currentPage, totalPages } =
      await this.userService.findAllByInstitution(instId, page, limit);

    // Responder con DTOs
    return {
      users: users.map(toUserResponseDto),
      total,
      currentPage,
      totalPages,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    const instId = this.getInstitutionFromHeader(req);
    const user = await this.userService.findOneInInstitution(id, instId);
    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return toUserResponseDto(user);
  }

  @Post()
  async create(
    @Body() dto: CreateUserDto,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    const instId = this.getInstitutionFromHeader(req);
    const created = await this.userService.createUser(dto, instId);
    return toUserResponseDto(created);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    const instId = this.getInstitutionFromHeader(req);
    const updated = await this.userService.updateUserInInstitution(
      id,
      dto,
      instId,
    );
    return toUserResponseDto(updated);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const instId = this.getInstitutionFromHeader(req);
    await this.userService.removeInInstitution(id, instId);
    return { ok: true };
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
  Query,
  UseGuards
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UserQuery, UsersDTO } from './users.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  
  @Get()
  @UseGuards(AuthGuard("jwt"))
  async showAllUsers(@Query() query: UserQuery) {
    const page = Number(query.page) || 1;
    const take = Number(query.take) || 5;
    const name = query.search || '';
    try {
      const [users, totalItems] = await this.usersService.paginated(
        page,
        take,
        name,
      );
      if (users.length > 0) {
        let totalPag: number = totalItems / take;
        if (totalPag % 1 !== 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : page + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          statusCode: HttpStatus.OK,
          message: 'Users fetched successfully',
          users,
          pagination: {
            totalItems,
            totalPag,
            curentPag: page,
            nextPag,
            prevPag,
          },
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'No records found',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred',
      };
    }
  }

  @Post()
  async createUsers(@Body() data: UsersDTO) {
    const user = await this.usersService.create(data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      user,
    };
  }

  @Get(':id')
  async readUser(@Param('id') id: number) {
    const data = await this.usersService.read(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      data,
    };
  }

  @Patch(':id')
  async uppdateUser(@Param('id') id: number, @Body() data: Partial<UsersDTO>) {
    await this.usersService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.usersService.destroy(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }
  
}

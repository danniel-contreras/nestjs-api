import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QueryParams, TaskCreate } from './task.interface';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  //get all tasks
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getTasks() {
    try {
      const tasks = await this.taskService.showAll();
      if (tasks.length <= 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'No records found',
        };
      }
      return {
        tasks,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred',
      };
    }
  }

  //get paginated tasks
  @Get('/paginated')
  @UseGuards(AuthGuard('jwt'))
  async getPaginatedTask(@Query() query: QueryParams) {
    let page = Number(query.page) || 1;
    let take = Number(query.take) || 5;
    try {
      const [tasks, total] = await this.taskService.showPaginated(page, take);
      if (tasks.length > 0) {
        let totalPag: number = total / take;
        if (totalPag % 1 !== 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : page + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          statusCode: HttpStatus.OK,
          message: 'Tasks fetched successfully',
          tasks,
          pagination: {
            total,
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

  //save task
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async saveTask(@Body() body: TaskCreate, @Req() req) {
    const data = {
      name: body.name,
      user: { id: Number(req.user.id) },
      created_at: new Date().toLocaleDateString(),
    };
    try {
      const task = await this.taskService.create(data);
      return {
        message: 'task created successfully',
        task,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred',
      };
    }
  }

  //get task by id
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async readById(@Req() req) {
    let id = Number(req.params.id);
    try {
      const task = await this.taskService.getById(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Task fetched successfully',
        task,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred',
        error,
      };
    }
  }

  //update task
  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateTask(@Req() req, @Body() body) {
    let id = Number(req.params.id);
    try {
      const task = await this.taskService.update(id, body);
      return {
        statusCode: HttpStatus.OK,
        message: 'Task updated successfully',
        task,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred',
        error,
      };
    }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTask(@Req() req) {
    let id = Number(req.params.id);
    try {
      await this.taskService.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Cannot delete an unexpected error has occurred',
        error,
      };
    }
  }
}

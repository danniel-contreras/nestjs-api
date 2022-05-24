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
import { SaveActivity } from './activities.interface';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createActivite(@Body() body: Partial<SaveActivity>) {
    const data = { ...body, task: { id: body.taskId } };
    try {
      const activity = await this.activitiesService.create(data);
      return {
        httpStatus: HttpStatus.OK,
        message: 'Activity created successfully',
        activity,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred',
      };
    }
  }

  @Get('/task')
  @UseGuards(AuthGuard('jwt'))
  async getByTask(@Query() query) {
    let task = Number(query.task);
    try {
      const activities = await this.activitiesService.getByTask(task);
      if (activities.length <= 0) {
        return {
          httpStatus: HttpStatus.OK,
          message: 'No records found with the task id ' + task,
        };
      }
      return {
        httpStatus: HttpStatus.OK,
        message: 'Activities fetched successfully',
        activities,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred',
      };
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    try {
      const activities = await this.activitiesService.getAll();
      if (activities.length <= 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'No record founds',
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Activities fetched successfully',
        activities,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred',
      };
    }
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateActivity(@Req() req, @Body() body) {
    let id = Number(req.params.id);
    try {
      const activity = await this.activitiesService.update(body, id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Activity updated successfully',
        activity,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred',
      };
    }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteActivity(@Req() req) {
    let id = Number(req.params.id);
    try {
      await this.activitiesService.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Activity delete successfully',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error has occurred',
      };
    }
  }
}

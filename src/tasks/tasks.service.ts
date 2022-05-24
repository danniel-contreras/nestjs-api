import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskCreate } from './task.interface';
import { TasksEntity } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksEntity)
    private taskRepository: Repository<TasksEntity>,
  ) {}
  showAll = async () => {
    return await this.taskRepository.find();
  };
  showPaginated = async (page: number = 1, take: number = 1) => {
    return await this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoin('tasks.user', 'user')
      .addSelect(['user.name', 'user.id'])
      .skip((page - 1) * take)
      .take(take)
      .getManyAndCount();
  };
  create = async (data: TaskCreate) => {
    return await this.taskRepository.save(data);
  };

  getById = async (id: number) => {
    return await this.taskRepository.findOneOrFail({ where: { id } });
  };

  delete = async (id: number) => {
    const task = await this.getById(id);
    return this.taskRepository.delete(task);
  };
  update = async (id: number, data: Partial<TaskCreate>) => {
    await this.taskRepository.update({ id }, data);
    return await this.getById(id);
  };
}

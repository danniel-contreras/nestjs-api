import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivitiesEntity } from './activities.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivitiesEntity)
    private activitiesRepository: Repository<ActivitiesEntity>,
  ) {}

  getAll = async () => {
    return await this.activitiesRepository.find();
  };

  getByTask = async (task: number) => {
    return await this.activitiesRepository
      .createQueryBuilder('activity')
      .leftJoin('activity.task', 'task')
      .addSelect('task')
      .where('activity.taskId = :task', { task })
      .getMany();
  };

  getById = async (id: number) => {
    return await this.activitiesRepository.findOneOrFail({ where: { id } });
  };

  delete = async (id: number) => {
    const activity = await this.getById(id);
    return await this.activitiesRepository.delete(activity);
  };

  create = async (data) => {
    return await this.activitiesRepository.save(data);
  };

  update = async (data, id: number) => {
    return await this.activitiesRepository.update({ id }, data);
  };
}

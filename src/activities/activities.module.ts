import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesEntity } from './activities.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ActivitiesEntity])],
  providers: [ActivitiesService],
  controllers: [ActivitiesController],
  exports:[ActivitiesService]
})
export class ActivitiesModule {}

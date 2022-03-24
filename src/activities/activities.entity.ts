import { TasksEntity } from 'src/tasks/tasks.entity';
import { UsersEntity } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  RelationId,
  OneToMany,
  ManyToOne,
} from 'typeorm';
@Entity('activities')
export class ActivitiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  status: boolean;

  @ManyToOne(() => TasksEntity)
  tasks: TasksEntity[];
  
  @RelationId((activities: ActivitiesEntity) => activities.tasks)
  tasksId: number;
}

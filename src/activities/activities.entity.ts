import { TasksEntity } from 'src/tasks/tasks.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
@Entity('activities')
export class ActivitiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({default:false})
  status: boolean;

  @ManyToOne(() => TasksEntity,(task)=>task.activity)
  task: TasksEntity[];
}

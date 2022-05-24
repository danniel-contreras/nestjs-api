import { ActivitiesEntity } from 'src/activities/activities.entity';
import { UsersEntity } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  OneToMany,
} from 'typeorm';
@Entity('tasks')
export class TasksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  created_at: string;

  @ManyToOne(() => UsersEntity, (user) => user.task)
  @JoinTable({ name: 'userId' })
  user: UsersEntity;

  @OneToMany(()=>ActivitiesEntity,(activity)=>activity.id)
  activity:ActivitiesEntity[]
}
 
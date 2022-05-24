import { TasksEntity } from 'src/tasks/tasks.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  RelationId,
  JoinTable,
} from 'typeorm';
@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => TasksEntity, (task) => task.id)
  @JoinTable({name:"taskId"})
  task: TasksEntity;
}

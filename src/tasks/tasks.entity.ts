import { UsersEntity } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  RelationId,
  ManyToOne,
} from 'typeorm';
@Entity('tasks')
export class TasksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  created_at: string;

  @ManyToOne(() => UsersEntity)
  users: UsersEntity[];

  @RelationId((tasks: TasksEntity) => tasks.users)
  usersId: number;
}

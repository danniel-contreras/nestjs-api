import { UsersEntity } from '../users/users.entity';

export interface TaskCreate {
  name: string;
  user: User;
  created_at: string;
}

interface User {
  id: number;
}

export interface QueryParams {
  page: number;
  take: number;
}

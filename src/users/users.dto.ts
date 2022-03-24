export interface UsersDTO {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface UserQuery {
  page?: string;
  take?: string;
  search?: string;
}

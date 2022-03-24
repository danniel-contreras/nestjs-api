import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { UsersDTO } from './users.dto';
import { checkPassword, hashPassword } from '../utils/bcrypt';
import { LoginUserDto } from './interfaces/user-login.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async showAll() {
    return await this.usersRepository.find();
  }

  async paginated(page: number, take: number, name: string) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .where('users.name like :name', { name: `%${name}%` })
      .skip((page - 1) * take)
      .take(take)
      .getManyAndCount();
  }
  async create(data: UsersDTO) {
    const password =await  hashPassword(data.password);
    const user = this.usersRepository.create({ ...data, password });
    await this.usersRepository.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<UsersDTO> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async read(id: number) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<UsersDTO>) {
    await this.usersRepository.update({ id }, data);
    return await this.usersRepository.findOne({ where: { id } });
  }

  async destroy(id: number) {
    await this.usersRepository.delete({ id });
    return { deleted: true };
  }
  async findByLogin({ email, password }: LoginUserDto): Promise<UsersDTO> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await  checkPassword(password, user.password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
  async findByPayload({ email }: any): Promise<UsersDTO> {
    return await this.findByEmail(email);
  }
}

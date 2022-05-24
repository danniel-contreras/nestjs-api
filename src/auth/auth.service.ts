import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from '../users/interfaces/user-login.interface';
import { UsersDTO } from '../users/users.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    // find user in db
    const user = await this.usersService.findByLogin(loginUserDto);

    // generate and sign token
    const token = this._createToken(user);

    return {
      name: user.name,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UsersDTO> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ email, id }: UsersDTO): any {
    const expiresIn = process.env.EXPIRESIN;

    const user: JwtPayload = { email, id };
    const accessToken = this.jwtService.sign(
      { user },
      { secret: 'FUCK', expiresIn },
    );
    return {
      accessToken,
    };
  }
}

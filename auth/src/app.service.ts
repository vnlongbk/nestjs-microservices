import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { User, Role } from '@prisma/client';
import { hashSync } from 'bcrypt';

import { TokenService } from './core/services/token.service';
import { PrismaService } from './core/services/prisma.services';
import { CreateUserDto } from './core/dtos';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  public createHash(password: string): string {
    return hashSync(password, 10);
  }

  public async signup(data: CreateUserDto) {
    try {
      const { email, password, firstname, lastname } = data;
      const checkUser = await this.prisma.user.findUnique({ where: { email } });
      if (checkUser) {
        throw new HttpException('user_exists', HttpStatus.CONFLICT);
      }
      const hashPassword = this.createHash(password);

      const newUser = {} as User;
      newUser.email = data.email;
      newUser.password = hashPassword;
      newUser.firstName = firstname.trim();
      newUser.lastName = lastname.trim();
      newUser.role = Role.USER;

      const user = await this.prisma.user.create({ data: newUser });
      const createTokenResponse = await this.tokenService.createToken(user);
      delete user.password;
      return {
        ...createTokenResponse,
        user,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}

import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { User, Role, Status } from '@prisma/client';
import { hashSync, compareSync } from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';

import { TokenService } from './core/services/token.service';
import { PrismaService } from './core/services/prisma.services';
import { CreateUserDto, LoginDto } from './core/dtos';
import { IMailPayload } from './core/interfaces';

@Injectable()
export class AppService {
  constructor(
    @Inject('MAIL_SERVICE') private readonly mailClient: ClientProxy,
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {
    this.mailClient.connect();
  }

  public createHash(password: string): string {
    return hashSync(password, 10);
  }

  public compare(password: string, hash: string): boolean {
    return compareSync(hash, password);
  }

  public getUserById(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  public async getAuthors() {
    const authors = await this.prisma.user.findMany({
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
    });
    return { authors };
  }

  public async updateOrCreateAuthor(data: any) {
    try {
      const user = await this.prisma.user.upsert({
        where: {
          id: data?.id ?? 0,
        },
        update: {
          ...data,
        },
        create: {
          ...data,
        },
      });

      return {
        user,
      };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  public async signup(data: CreateUserDto) {
    try {
      const { email, password, firstName, lastName } = data;
      const checkUser = await this.prisma.user.findUnique({ where: { email } });
      if (checkUser) {
        throw new HttpException('user_exists', HttpStatus.CONFLICT);
      }
      const hashPassword = this.createHash(password);

      const newUser = {} as User;
      newUser.email = data.email;
      newUser.password = hashPassword;
      newUser.firstName = firstName?.trim();
      newUser.lastName = lastName?.trim();
      newUser.role = Role.ADMIN;
      newUser.status = Status.PUBLISHED;

      const user = await this.prisma.user.create({ data: newUser });
      const createTokenResponse = await this.tokenService.createToken(user);
      delete user.password;

      // const payload: IMailPayload = {
      //   template: 'SIGNUP',
      //   payload: {
      //     email: user.email,
      //     data: {
      //       firstName: user.firstName,
      //       lastName: user.lastName,
      //     },
      //     subject: 'Signup Successfully',
      //   },
      // };

      // this.mailClient.emit('send_email', payload);

      return {
        ...createTokenResponse,
        user,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async login(data: LoginDto) {
    try {
      const { email, password } = data;
      const checkUser = await this.prisma.user.findUnique({ where: { email } });
      if (!checkUser) {
        throw new HttpException(
          'user_not_found',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (this.compare(password, checkUser.password)) {
        throw new HttpException('invalid_password', HttpStatus.CONFLICT);
      }
      const createTokenResponse = await this.tokenService.createToken(
        checkUser.id,
      );
      delete checkUser.password;
      return {
        ...createTokenResponse,
        user: checkUser,
      };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  public async getAccessToken(data: { username: string; password: string }) {
    try {
      const { username, password } = data;
      const checkUser = await this.prisma.user.findUnique({
        where: { email: username },
      });
      if (!checkUser) {
        throw new HttpException(
          'user_not_found',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (this.compare(password, checkUser.password)) {
        throw new HttpException('invalid_password', HttpStatus.CONFLICT);
      }
      const createTokenResponse = await this.tokenService.createToken(
        checkUser.id,
      );
      delete checkUser.password;
      return createTokenResponse.accessToken;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}

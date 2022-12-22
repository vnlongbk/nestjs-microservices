import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtPayload } from 'jsonwebtoken';

import { CreateUserDto, LoginDto } from './core/dtos';
import { IAuthPayload, ITokenResponse } from './core/interfaces';
import { AppService } from './app.service';
import { AllowUnauthorizedRequest } from './core/allow.unauthorized.decorator';
import { TokenService } from './core/services/token.service';
import { PrismaService } from './core/services/prisma.services';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private tokenService: TokenService,
    private prisma: PrismaService,
  ) {}

  @MessagePattern('token_create')
  public async createToken(@Payload() data: any): Promise<ITokenResponse> {
    return this.tokenService.createToken(data.id);
  }

  @MessagePattern('token_decode')
  public async decodeToken(
    @Payload() data: string,
  ): Promise<string | JwtPayload> {
    return this.tokenService.decodeToken(data);
  }

  @MessagePattern('get_user_by_id')
  public async getUserById(@Payload() data: { userId: number }): Promise<any> {
    return this.appService.getUserById(data.userId);
  }

  @AllowUnauthorizedRequest()
  @Get('/retriveAuthors')
  retriveAuthors(): Promise<any> {
    return this.appService.retriveAuthors();
  }

  @Post('/createAuthor')
  createAuthor(@Body() data): Promise<any> {
    return this.appService.createAuthor(data);
  }

  @AllowUnauthorizedRequest()
  @Get('/health')
  public healthCheck(@Res() res: Response) {
    this.prisma
      .$connect()
      .then(() => {
        return res.status(HttpStatus.OK).json({ stauts: 'ok' });
      })
      .catch((e) => {
        return res.status(HttpStatus.OK).json({ stauts: 'down', error: e });
      });
  }

  @AllowUnauthorizedRequest()
  @Post('/signup')
  signup(@Body() data: CreateUserDto): Promise<IAuthPayload> {
    return this.appService.signup(data);
  }

  @AllowUnauthorizedRequest()
  @Post('/login')
  login(@Body() data: LoginDto): Promise<IAuthPayload> {
    return this.appService.login(data);
  }

  @AllowUnauthorizedRequest()
  @Post('/getAccessToken')
  getAccessToken(@Body() data): Promise<any> {
    return this.appService.getAccessToken(data);
  }
}

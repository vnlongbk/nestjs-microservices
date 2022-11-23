import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { CreateUserDto } from './core/dtos';
import { IAuthPayload } from './core/interfaces';
import { AppService } from './app.service';
import { PrismaService } from './core/services/prisma.services';
import { AllowUnauthorizedRequest } from './core/allow.unauthorized.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

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
}

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  public constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
    private reflector: Reflector,
  ) {
    this.client.connect();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.getArgByIndex(0);
      const allowUnauthorizedRequest = this.reflector.get<boolean>(
        'allowUnauthorizedRequest',
        context.getHandler(),
      );
      if (allowUnauthorizedRequest) {
        return true;
      }
      const Authorization = request.headers['authorization'];
      if (!Authorization) {
        throw new UnauthorizedException();
      }
      const token = Authorization.replace('Bearer ', '');
      console.log(token, '---- token ----');

      const decode = await firstValueFrom(
        this.client.send('token_decode', token),
      );
      if (!decode) {
        return false;
      }
      console.log(decode, '---- decode ----');
      request.userId = decode.userId;
      return true;
    } catch (e) {
      return false;
    }
  }
}

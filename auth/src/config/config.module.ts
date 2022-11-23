import { ConfigService } from './config.services';
import { Module } from '@nestjs/common';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

import { config } from 'dotenv';
config();
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private config: { [key: string]: any } = {};
  constructor() {
    this.config.rb_url = process.env.RABBITMQ_URL;
    this.config.token_queue = process.env.RABBITMQ_TOKEN_QUEUE;
    this.config.main_queue = process.env.RABBITMQ_MAIN_QUEUE;
    this.config.user_queue = process.env.RABBITMQ_USER_QUEUE;
    this.config.post_queue = process.env.RABBITMQ_POST_QUEUE;
    this.config.mailer_queue = process.env.RABBITMQ_MAILER_QUEUE;

    this.config.redis_host = process.env.REDIS_HOST;
    this.config.redis_port = process.env.REDIS_PORT;

    this.config.aws = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    };
    this.config.sourceEmail = process.env.SOURCE_EMAIL;

    this.config.MAIL_HOST = process.env.MAIL_HOST;
    this.config.MAIL_USER = process.env.MAIL_USER;
    this.config.MAIL_PASSWORD = process.env.MAIL_PASSWORD;
    this.config.MAIL_FROM = process.env.MAIL_FROM;
  }

  public get(key: string): any {
    return this.config[key];
  }
}

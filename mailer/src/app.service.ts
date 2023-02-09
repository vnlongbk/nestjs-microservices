// import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
// import { Queue } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AppService {
  // constructor(@InjectQueue('email-sender') private taskQueue: Queue) {}
  constructor(private mailerService: MailerService) {}

  // public async sendEmail(data): Promise<void> {
  //   this.taskQueue.add(data, { backoff: 3 });
  // }

  async sendUserConfirmation(user) {
    const url = `example.com/auth/confirm?token=token`;

    await this.mailerService.sendMail({
      to: user.payload.email,
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './signup.html', // either change to ./transactional or rename transactional.html to confirmation.html
      context: {
        name: user.payload.data.firstName + user.payload.data.lastName,
        url,
      },
    });
  }
}

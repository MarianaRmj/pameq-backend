import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { TransportOptions } from 'nodemailer';

export const mailerConfigFactory = (
  configService: ConfigService,
): MailerOptions => ({
  transport: {
    host: configService.getOrThrow<string>('MAIL_HOST'),
    port: parseInt(configService.getOrThrow<string>('MAIL_PORT')),
    auth: {
      user: configService.getOrThrow<string>('MAIL_USER'),
      pass: configService.getOrThrow<string>('MAIL_PASS'),
    },
  } as TransportOptions,
  defaults: {
    from: `"PAMEQ" <${configService.getOrThrow<string>('MAIL_FROM')}>`,
  },
});

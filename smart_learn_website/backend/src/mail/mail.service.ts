import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly frontendUrl: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost';
    const frontendPort = this.configService.get<number>('VITE_PORT') || 5173;
    this.frontendUrl = `${baseUrl}:${frontendPort}`;
  }

  async sendVerificationEmail(email: string, displayName: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify your email address',
        template: './verifyEmail', 
        context: {
          displayName: displayName,
          verifyUrl: `${this.frontendUrl}/#/verifyEmail?token=${token}`, 
        },
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Could not send verification email to ${email}: ${error.message}`);
    }
  }

  async sendDeletionWarningEmail(email: string, displayName: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Action Required: Your account will be deleted soon!',
        template: './warningDelete',
        context: {
          displayName: displayName,
          loginUrl: `${this.frontendUrl}/#/login`, 
        },
      });
      this.logger.log(`Warning email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Could not send warning email to ${email}: ${error.message}`);
    }
  }

  async sendAccountDeletedEmail(email: string, displayName: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your account has been deleted',
        template: './deleteAccount',
        context: {
          displayName: displayName,
        },
      });
      this.logger.log(`Account deletion email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Could not send deletion email to ${email}: ${error.message}`);
    }
  }
}
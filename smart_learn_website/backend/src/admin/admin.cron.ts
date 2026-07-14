import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class UserCleanupCron {
  private readonly logger = new Logger(UserCleanupCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleInactiveUsers() {
    this.logger.log('Starting cron job for cleaning up inactive users...');

    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const warningDate = new Date(now.getTime() - 358 * 24 * 60 * 60 * 1000); // 1 week before

    const usersToWarn = await this.prisma.user.findMany({
      where: {
        role: 'USER',
        lastActivityAt: { lte: warningDate, gt: oneYearAgo },
        deletionWarningSentAt: null,
      },
    });

    for (const user of usersToWarn) {
      await this.mailService.sendDeletionWarningEmail(user.email, user.displayName);
      
      await this.prisma.user.update({
        where: { id: user.id },
        data: { deletionWarningSentAt: now },
      });
    }

    if (usersToWarn.length > 0) {
      this.logger.log(`Warning email sent to ${usersToWarn.length} users.`);
    }

    const usersToDelete = await this.prisma.user.findMany({
      where: {
        role: 'USER',
        lastActivityAt: { lte: oneYearAgo },
      },
    });

    for (const user of usersToDelete) {
      await this.mailService.sendAccountDeletedEmail(user.email, user.displayName);

      await this.prisma.user.delete({
        where: { id: user.id },
      });
    }

    if (usersToDelete.length > 0) {
      this.logger.log(`Successfully deleted ${usersToDelete.length} inactive users.`);
    }

    this.logger.log('Cron job completed successfully.');
  }
}
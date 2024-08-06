import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductsService } from './products.service';
import { join, resolve } from 'path';
import { promises } from 'fs';
import { convertTimeZone } from 'src/shared/utils/convertTimeZone';
import { formatDate } from 'src/shared/utils/formatDate';

const logsDir = resolve(__dirname, '..', '..', '..', 'src', 'logs');

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private readonly logsFilePath = join(logsDir, 'cron_last_execution.txt');

  constructor(private readonly productsService: ProductsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_4PM)
  async handleCron(): Promise<void> {
    this.logger.debug(
      `Starting cron job at:`,
      formatDate(convertTimeZone(new Date()).toISOString()),
    );
    try {
      await this.productsService.insertProducts();

      this.logger.debug('Products were imported successfully');
      const logEntry = convertTimeZone(new Date()).toISOString();
      this.logger.debug(`Ending cron job at:`, formatDate(logEntry));
      await promises.writeFile(this.logsFilePath, logEntry);
    } catch (error) {
      this.logger.error('Failed to insert products', error.message);
    }
  }
}

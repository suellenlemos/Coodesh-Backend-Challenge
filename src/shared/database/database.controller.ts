import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { promises } from 'fs';
import { join, resolve } from 'path';
import { formatDate } from '../utils/formatDate';

const logsDir = resolve(__dirname, '..', '..', '..', 'src', 'logs');

@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly logsFilePath = join(logsDir, 'cron_last_execution.txt');

  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async getHealthStatus() {
    try {
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();

      await this.prismaService.$runCommandRaw({ ping: 1 });

      let lastExecution = 'Not available';
      try {
        const logContent = await promises.readFile(this.logsFilePath, 'utf-8');
        lastExecution = formatDate(logContent.trim());
      } catch (err) {
        this.logger.error('Failed to read last execution date', err.message);
      }

      return {
        status: 'Ok',
        dbConnection: 'Ok',
        uptime: `${Math.floor(uptime / 60)} minutes and ${Math.floor(uptime % 60)} seconds`,
        memoryUsage: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external,
        },
        cronLastExecution: lastExecution,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to check API health',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

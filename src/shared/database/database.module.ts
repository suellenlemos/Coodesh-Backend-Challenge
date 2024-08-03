import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ProductsRepository } from './repositories/products.repositories';
import { HealthController } from './database.controller';

@Global()
@Module({
  controllers: [HealthController],
  providers: [PrismaService, ProductsRepository],
  exports: [ProductsRepository],
})
export class DatabaseModule {}

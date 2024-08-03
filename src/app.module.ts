import { Module } from '@nestjs/common';

import { DatabaseModule } from './shared/database/database.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [ProductsModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ProductCreateArgs) {
    return this.prismaService.product.create(createDto);
  }

  findAll<T extends Prisma.ProductFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.ProductFindManyArgs>,
  ) {
    return this.prismaService.product.findMany(findManyDto);
  }

  count() {
    return this.prismaService.product.count();
  }
}

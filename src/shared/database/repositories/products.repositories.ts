import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { ProductStatus } from 'src/modules/products/entities/Product';

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

  async count(status: ProductStatus): Promise<number> {
    return this.prismaService.product.count({
      where: {
        status: status,
      },
    });
  }

  findUnique<T extends Prisma.ProductFindUniqueArgs>(
    findUniqueDto: Prisma.SelectSubset<T, Prisma.ProductFindUniqueArgs>,
  ) {
    return this.prismaService.product.findUnique(findUniqueDto);
  }
}

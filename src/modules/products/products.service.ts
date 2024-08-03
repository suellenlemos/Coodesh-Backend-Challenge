import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { toZonedTime } from 'date-fns-tz';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from './entities/Product';
import { ProductsRepository } from 'src/shared/database/repositories/products.repositories';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    const {
      code,
      status,
      importedT = new Date(),
      url,
      creator,
      createdT,
      lastModifiedT,
      productName,
      quantity,
      brands,
      categories,
      labels,
      cities,
      purchasePlaces,
      stores,
      ingredientsText,
      traces,
      servingSize,
      servingQuantity,
      nutriscoreScore,
      nutriscoreGrade,
      mainCategory,
      imageUrl,
    } = createProductDto;

    const convertTimeZone = (date: Date) => {
      return toZonedTime(date, 'Etc/GMT+6');
    };

    return this.productsRepo.create({
      data: {
        code,
        status: ProductStatus.PUBLISHED,
        importedT: convertTimeZone(importedT),
        url,
        creator,
        createdT,
        lastModifiedT,
        productName,
        quantity,
        brands,
        categories,
        labels,
        cities,
        purchasePlaces,
        stores,
        ingredientsText,
        traces,
        servingSize,
        servingQuantity,
        nutriscoreScore,
        nutriscoreGrade,
        mainCategory,
        imageUrl,
      },
    });
  }

  async findAll(page: number = 1, perPage: number = 5) {
    try {
      const skip = (page - 1) * perPage;

      const products = await this.productsRepo.findAll({
        where: {
          status: ProductStatus.PUBLISHED,
        },
        take: perPage,
        skip: skip,
        orderBy: {
          importedT: 'desc',
        },
      });

      const total = await this.productsRepo.count(ProductStatus.PUBLISHED);

      return {
        itens: products,
        total: total,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get all products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductByCode(code: number) {
    const product = await this.productsRepo.findUnique({
      where: {
        code: code,
        status: ProductStatus.PUBLISHED,
      },
    });

    if (!product) {
      throw new HttpException(
        `No product with code ${code} was found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }

  async remove(code: number) {
    const deletedProduct = await this.productsRepo.delete({
      where: {
        code: code,
      },
      data: {
        status: ProductStatus.TRASH,
      },
    });

    if (!deletedProduct) {
      throw new HttpException(
        `No product with code ${code} was found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return deletedProduct;
  }
}

import { Injectable } from '@nestjs/common';
import { toZonedTime } from 'date-fns-tz';

import { CreateProductDto } from './dto/create-product.dto';
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
        status,
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
}

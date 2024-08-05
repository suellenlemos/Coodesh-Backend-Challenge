import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { createReadStream, createWriteStream, unlink } from 'fs';
import { createInterface } from 'readline';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createGunzip } from 'zlib';
import axios from 'axios';

import { CreateProductDto } from './dto/create-product.dto';
import { IProduct, ProductStatus } from './entities/Product';
import { ProductsRepository } from 'src/shared/database/repositories/products.repositories';
import { UpdateProductDto } from './dto/update-product.dto';
import { convertTimeZone } from 'src/shared/utils/convertTimeZone';
import { env } from 'src/shared/config/env';
import { join, resolve } from 'path';

const pipelineAsync = promisify(pipeline);
const unlinkAsync = promisify(unlink);

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly productsRepo: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    const {
      code,
      status = ProductStatus.PUBLISHED,
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

  async findUnique(code: number) {
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

  async update(code: number, updateProductDto: UpdateProductDto) {
    const {
      status,
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
    } = updateProductDto;

    return this.productsRepo.update({
      where: {
        code: code,
      },
      data: {
        status,
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

  insertProducts = async () => {
    const fileNameListUrl = env.filesNames;

    const downloadDir = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'src',
      'downloads',
    );

    this.logger.debug(`Getting file name list`);

    const fileList = await axios.get(fileNameListUrl, {
      responseType: 'text',
    });

    const fileNameListPath = join(downloadDir, 'file_name_list.txt');

    await pipelineAsync(fileList.data, createWriteStream(fileNameListPath));

    const fileNameList = fileList.data
      .split('\n')
      .map((fileName: string) => fileName.split(' ')[0])
      .filter(Boolean);

    for (const fileName of fileNameList) {
      try {
        const baseUrl = env.productsBaseUrl;

        const fileUrl = `${baseUrl}/${fileName}`;

        const filePath = join(
          downloadDir,
          fileName.replace('.json.gz', '.json'),
        );

        const first100ProductsFilePath = join(
          downloadDir,
          fileName.replace('.json.gz', '_top100.json'),
        );

        this.logger.debug(`Downloading file ${fileName}`);

        const response = await axios.get(fileUrl, {
          responseType: 'stream',
        });

        this.logger.debug(`Decompressing file ${fileName}`);

        await pipelineAsync(
          response.data,
          createGunzip(),
          createWriteStream(filePath),
        );

        const rl = createInterface({
          input: createReadStream(filePath),
          crlfDelay: Infinity,
        });

        let products: IProduct[] = [];

        for await (const line of rl) {
          this.logger.debug(`Processing file ${fileName}`);
          if (products.length >= 100) break;
          try {
            const product = JSON.parse(line);
            products.push({
              ...product,
              code: Number(product.code.replace(/^\\?\"/, '')),
            });
          } catch (err) {
            this.logger.error(`Invalid JSON in ${fileName}: ${line}`);
            continue;
          }
        }

        const writeStream = createWriteStream(first100ProductsFilePath);
        writeStream.write(JSON.stringify(products, null, 2));

        this.logger.debug(`Inserting products in database`);

        for (const product of products) {
          const productToDb: CreateProductDto = {
            code: Number(product.code),
            status: ProductStatus.PUBLISHED,
            importedT: convertTimeZone(new Date()),
            url: product.url,
            creator: product.creator,
            createdT: Number(product.created_t),
            lastModifiedT: Number(product.last_modified_t),
            productName: product.product_name,
            quantity: product.quantity,
            brands: product.brands,
            categories: product.categories,
            labels: product.labels,
            cities: product.cities,
            purchasePlaces: product.purchase_places,
            stores: product.stores,
            ingredientsText: product.ingredients_text,
            traces: product.traces,
            servingSize: product.serving_size,
            servingQuantity: Number(product.serving_quantity),
            nutriscoreScore: Number(product.nutriscore_score),
            nutriscoreGrade: product.nutriscore_grade,
            mainCategory: product.main_category,
            imageUrl: product.image_url,
          };

          const existingProduct = await this.productsRepo.findUnique({
            where: {
              code: Number(product.code),
            },
          });

          if (!existingProduct) {
            await this.productsRepo.create({
              data: productToDb,
            });
          }
        }

        unlinkAsync(filePath);
        unlinkAsync(first100ProductsFilePath);
      } catch (error) {
        this.logger.error(
          `Failed to process file ${fileName}: ${error.message}`,
        );
        continue;
      }
    }
    unlinkAsync(fileNameListPath);
  };
}

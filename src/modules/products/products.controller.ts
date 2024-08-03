import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query('page') page: string, @Query('per_page') perPage: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const perPageNumber = perPage ? parseInt(perPage, 10) : 5;
    return this.productsService.findAll(pageNumber, perPageNumber);
  }

  @Get(':code')
  async findOne(
    @Param('code', ParseIntPipe)
    code: number,
  ) {
    try {
      return await this.productsService.findUnique(code);
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while fetching the product',
        error.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':code')
  update(
    @Param('code', ParseIntPipe) code: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(code, updateProductDto);
  }

  @Delete(':code')
  async remove(
    @Param('code', ParseIntPipe)
    code: number,
  ) {
    try {
      await this.productsService.remove(code);
      return { message: 'Product was deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message ||
          `An error occurred while deleting the product id code ${code}`,
        error.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

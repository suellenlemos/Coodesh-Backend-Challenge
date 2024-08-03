import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

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
}

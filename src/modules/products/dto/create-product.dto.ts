import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ProductStatus } from '../entities/Product';

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;

  status: ProductStatus;

  importedT: Date;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  creator: string;

  @IsNumber()
  @IsNotEmpty()
  createdT: number;

  @IsNumber()
  @IsNotEmpty()
  lastModifiedT: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;

  @IsString()
  @IsNotEmpty()
  brands: string;

  @IsString()
  @IsNotEmpty()
  categories: string;

  @IsString()
  @IsNotEmpty()
  labels: string;

  @IsString()
  @IsNotEmpty()
  cities: string;

  @IsString()
  @IsNotEmpty()
  purchasePlaces: string;

  @IsString()
  @IsNotEmpty()
  stores: string;

  @IsString()
  @IsNotEmpty()
  ingredientsText: string;

  @IsString()
  @IsNotEmpty()
  traces: string;

  @IsString()
  @IsNotEmpty()
  servingSize: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  servingQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  nutriscoreScore: number;

  @IsString()
  @IsNotEmpty()
  nutriscoreGrade: string;

  @IsString()
  @IsNotEmpty()
  mainCategory: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}

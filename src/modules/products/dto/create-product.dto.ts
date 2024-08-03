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
  creator: string;

  @IsNumber()
  createdT: number;

  @IsNumber()
  lastModifiedT: number;

  @IsString()
  productName: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;

  @IsString()
  brands: string;

  @IsString()
  categories: string;

  @IsString()
  labels: string;

  @IsString()
  cities: string;

  @IsString()
  purchasePlaces: string;

  @IsString()
  stores: string;

  @IsString()
  ingredientsText: string;

  @IsString()
  traces: string;

  @IsString()
  servingSize: string;

  @IsNumber()
  @IsPositive()
  servingQuantity: number;

  @IsNumber()
  nutriscoreScore: number;

  @IsString()
  nutriscoreGrade: string;

  @IsString()
  mainCategory: string;

  @IsString()
  imageUrl: string;
}

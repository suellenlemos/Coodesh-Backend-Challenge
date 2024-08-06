import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductStatus } from './entities/Product';
import { UpdateProductDto } from './dto/update-product.dto';

const mockedProducts = {
  itens: [
    {
      code: 1,
      status: ProductStatus.PUBLISHED,
      importedT: new Date(),
      url: 'http://example.com/product/1234567890123',
      creator: 'creator@example.com',
      createdT: 1617181920,
      lastModifiedT: 1617181921,
      productName: 'Mock Product',
      quantity: '500ml',
      brands: 'Mock Brand',
      categories: 'Mock Category',
      labels: 'Mock Label',
      cities: 'Mock City',
      purchasePlaces: 'Mock Place',
      stores: 'Mock Store',
      ingredientsText: 'Water, Sugar, Mock Ingredient',
      traces: 'Mock Traces',
      servingSize: '250ml',
      servingQuantity: 2,
      nutriscoreScore: 10,
      nutriscoreGrade: 'B',
      mainCategory: 'Mock Main Category',
      imageUrl: 'http://example.com/product/1234567890123/image.jpg',
    },
    {
      code: 2,
      status: ProductStatus.PUBLISHED,
      importedT: new Date(),
      url: 'http://example.com/product/1234567890123',
      creator: 'creator@example.com',
      createdT: 1617181920,
      lastModifiedT: 1617181921,
      productName: 'Mock Product',
      quantity: '500ml',
      brands: 'Mock Brand',
      categories: 'Mock Category',
      labels: 'Mock Label',
      cities: 'Mock City',
      purchasePlaces: 'Mock Place',
      stores: 'Mock Store',
      ingredientsText: 'Water, Sugar, Mock Ingredient',
      traces: 'Mock Traces',
      servingSize: '250ml',
      servingQuantity: 2,
      nutriscoreScore: 10,
      nutriscoreGrade: 'B',
      mainCategory: 'Mock Main Category',
      imageUrl: 'http://example.com/product/1234567890123/image.jpg',
    },
    {
      code: 3,
      status: ProductStatus.DRAFT,
      importedT: new Date(),
      url: 'http://example.com/product/1234567890123',
      creator: 'creator@example.com',
      createdT: 1617181920,
      lastModifiedT: 1617181921,
      productName: 'Mock Product',
      quantity: '500ml',
      brands: 'Mock Brand',
      categories: 'Mock Category',
      labels: 'Mock Label',
      cities: 'Mock City',
      purchasePlaces: 'Mock Place',
      stores: 'Mock Store',
      ingredientsText: 'Water, Sugar, Mock Ingredient',
      traces: 'Mock Traces',
      servingSize: '250ml',
      servingQuantity: 2,
      nutriscoreScore: 10,
      nutriscoreGrade: 'B',
      mainCategory: 'Mock Main Category',
      imageUrl: 'http://example.com/product/1234567890123/image.jpg',
    },
    {
      code: 4,
      status: ProductStatus.TRASH,
      importedT: new Date(),
      url: 'http://example.com/product/1234567890123',
      creator: 'creator@example.com',
      createdT: 1617181920,
      lastModifiedT: 1617181921,
      productName: 'Mock Product',
      quantity: '500ml',
      brands: 'Mock Brand',
      categories: 'Mock Category',
      labels: 'Mock Label',
      cities: 'Mock City',
      purchasePlaces: 'Mock Place',
      stores: 'Mock Store',
      ingredientsText: 'Water, Sugar, Mock Ingredient',
      traces: 'Mock Traces',
      servingSize: '250ml',
      servingQuantity: 2,
      nutriscoreScore: 10,
      nutriscoreGrade: 'B',
      mainCategory: 'Mock Main Category',
      imageUrl: 'http://example.com/product/1234567890123/image.jpg',
    },
  ],
  total: 4,
};

const publishedProducts = {
  itens: [
    {
      code: 1,
      status: ProductStatus.PUBLISHED,
      importedT: new Date(),
      url: 'http://example.com/product/1234567890123',
      creator: 'creator@example.com',
      createdT: 1617181920,
      lastModifiedT: 1617181921,
      productName: 'Mock Product',
      quantity: '500ml',
      brands: 'Mock Brand',
      categories: 'Mock Category',
      labels: 'Mock Label',
      cities: 'Mock City',
      purchasePlaces: 'Mock Place',
      stores: 'Mock Store',
      ingredientsText: 'Water, Sugar, Mock Ingredient',
      traces: 'Mock Traces',
      servingSize: '250ml',
      servingQuantity: 2,
      nutriscoreScore: 10,
      nutriscoreGrade: 'B',
      mainCategory: 'Mock Main Category',
      imageUrl: 'http://example.com/product/1234567890123/image.jpg',
    },
    {
      code: 2,
      status: ProductStatus.PUBLISHED,
      importedT: new Date(),
      url: 'http://example.com/product/1234567890123',
      creator: 'creator@example.com',
      createdT: 1617181920,
      lastModifiedT: 1617181921,
      productName: 'Mock Product',
      quantity: '500ml',
      brands: 'Mock Brand',
      categories: 'Mock Category',
      labels: 'Mock Label',
      cities: 'Mock City',
      purchasePlaces: 'Mock Place',
      stores: 'Mock Store',
      ingredientsText: 'Water, Sugar, Mock Ingredient',
      traces: 'Mock Traces',
      servingSize: '250ml',
      servingQuantity: 2,
      nutriscoreScore: 10,
      nutriscoreGrade: 'B',
      mainCategory: 'Mock Main Category',
      imageUrl: 'http://example.com/product/1234567890123/image.jpg',
    },
  ],
  total: 2,
};

const mockUpdatedProduct = {
  code: 2,
  status: ProductStatus.PUBLISHED,
  importedT: new Date(),
  url: 'http://example.com/product/1234567890123',
  creator: 'creator@example.com',
  createdT: 1617181920,
  lastModifiedT: 1617181921,
  productName: 'Changed Product Name',
  quantity: '500ml',
  brands: 'Mock Brand',
  categories: 'Mock Category',
  labels: 'Mock Label',
  cities: 'Mock City',
  purchasePlaces: 'Mock Place',
  stores: 'Mock Store',
  ingredientsText: 'Water, Sugar, Mock Ingredient',
  traces: 'Mock Traces',
  servingSize: '250ml',
  servingQuantity: 2,
  nutriscoreScore: 10,
  nutriscoreGrade: 'B',
  mainCategory: 'Mock Main Category',
  imageUrl: 'http://example.com/product/1234567890123/image.jpg',
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('should return products list with default pagination', async () => {
      jest
        .spyOn(mockProductsService, 'findAll')
        .mockReturnValue(publishedProducts);
      const result = await controller.findAll(undefined, undefined);
      expect(result).toEqual(publishedProducts);
      expect(mockProductsService.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledWith(1, 5);
    });

    it('should return products list with custom pagination', async () => {
      jest
        .spyOn(mockProductsService, 'findAll')
        .mockReturnValue(publishedProducts);
      expect(await controller.findAll('2', '1')).toBe(publishedProducts);
      expect(service.findAll).toHaveBeenCalledWith(2, 1);
    });

    it('should return only products with status equal to published', async () => {
      jest
        .spyOn(mockProductsService, 'findAll')
        .mockReturnValue(publishedProducts);
      const response = await controller.findAll('', '');
      expect(response).toEqual(publishedProducts);
      expect(service.findAll).toHaveBeenCalledWith(1, 5);

      const returnedProducts = await controller.findAll('', '');
      expect(
        returnedProducts.itens.every(
          (product) => product.status === ProductStatus.PUBLISHED,
        ),
      ).toBe(true);
    });

    it('should not return products with statuses different from published', async () => {
      jest
        .spyOn(mockProductsService, 'findAll')
        .mockReturnValue(publishedProducts);

      const result = await controller.findAll(undefined, undefined);

      expect(result).not.toEqual(mockedProducts);

      expect(
        result.itens.every(
          (product) => product.status === ProductStatus.PUBLISHED,
        ),
      ).toBe(true);
    });

    it('should return the correct total number of products', async () => {
      jest
        .spyOn(mockProductsService, 'findAll')
        .mockReturnValue(publishedProducts);
      const result = await controller.findAll('1', '5');
      expect(result.total).toBe(result.itens.length);
    });
  });

  describe('update', () => {
    it('should update a product and return the updated product', async () => {
      const code = 2;

      const updateProductDto: UpdateProductDto = {
        labels: 'Labels',
        cities: 'Cities',
        stores: 'Stores',
      };

      jest
        .spyOn(mockProductsService, 'update')
        .mockReturnValue(mockUpdatedProduct);

      const result = await controller.update(code, updateProductDto);

      expect(result).toEqual(mockUpdatedProduct);
      expect(service.update).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalledWith(code, updateProductDto);
    });
  });
});

import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class Env {
  @IsString()
  @IsNotEmpty()
  dbURL: string;
  productsBaseUrl: string;
  filesNames: string;
}

export const env: Env = plainToInstance(Env, {
  dbURL: process.env.DATABASE_URL,
  productsBaseUrl: process.env.PRODUCTS_BASE_URL,
  filesNames: process.env.FILE_NAMES,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}

import { generateSku } from '../helpers/generateSku';
import productVariantModel from '../models/productVariant.model';
import { ProductVariantInput } from '../validators/productVariant.validator';

class ProductVariantRepository {
  create(data: ProductVariantInput) {
    data.sku = generateSku();
    return productVariantModel.create(data);
  }
}

export default new ProductVariantRepository();

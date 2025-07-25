import productVariantRepository from '../repositories/productVariant.repository';
import { ProductVariantInput } from '../validators/productVariant.validator';

class ProductVariantService {
  async create(data: ProductVariantInput) {
    return await productVariantRepository.create(data);
  }
}

export default new ProductVariantService();

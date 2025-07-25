import { Types } from 'mongoose';
import productVariantRepository from '../repositories/productVariant.repository';
import { ProductVariantInput } from '../validators/productVariant.validator';

class ProductVariantService {
  async getByProductId(productId: Types.ObjectId) {
    return await productVariantRepository.getByProductId(productId);
  }
  
  async create(data: ProductVariantInput) {
    return await productVariantRepository.create(data);
  }
}

export default new ProductVariantService();

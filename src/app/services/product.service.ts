import { Types } from 'mongoose';
import productRepository from '../repositories/product.repository';
import { ProductInput } from '../validators/product.validator';

class ProductService {
  async create(data: ProductInput) {
    return await productRepository.create(data);
  }

  async getProductsByCategoryName(name: string, page: number, limit: number) {
    return await productRepository.getProductsByCategoryName(name, page, limit);
  }

  async getSpecialProducts(page: number, limit: number) {
    return await productRepository.getSpecialProducts(page, limit);
  }

  async getTopDealProducts(page: number, limit: number) {
    return await productRepository.getTopDealProducts(page, limit);
  }

  async getBestSellingProducts(page: number, limit: number) {
    return await productRepository.getBestSellingProducts(page, limit);
  }
}

export default new ProductService();

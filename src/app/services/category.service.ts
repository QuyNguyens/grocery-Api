import categoryRepository from '../repositories/category.repository';
import { CategoryInput } from '../validators/category.validator';

class CategoryService {
  async get() {
    return await categoryRepository.get();
  }
  
  async create(data: CategoryInput) {
    return await categoryRepository.create(data);
  }
}

export default new CategoryService();

import categoryModel from '../models/category.model';
import { CategoryInput } from '../validators/category.validator';

class CategoryRepository {
  create(data: CategoryInput) {
    return categoryModel.create(data);
  }
}

export default new CategoryRepository();

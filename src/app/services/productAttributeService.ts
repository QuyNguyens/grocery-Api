import { IAttribute, IAttributeValue } from '../../types/productVariant';
import productAttributeRepository from '../repositories/productAttribute.repository';
import { ProductAttributeInput, ProductAttributeValueInput } from '../validators/productAttribute.validator';

class ProductAttributeService {
  async createAttribute(data: ProductAttributeInput) {
    return await productAttributeRepository.createAttribute(data);
  }

  async createAttributeValue(data: ProductAttributeValueInput) {
    return await productAttributeRepository.createAttributeValue(data);
  }
}

export default new ProductAttributeService();

import { IAttribute, IAttributeValue } from '../../types/productVariant';
import { attributeModel, attributeValueModel } from '../models/attributeValue.model';
import { ProductAttributeInput, ProductAttributeValueInput } from '../validators/productAttribute.validator';

class ProductAttributeRepository {
  createAttribute(data: ProductAttributeInput) {
    return attributeModel.create(data);
  }

  createAttributeValue(data: ProductAttributeValueInput) {
    return attributeValueModel.create(data);
  }
}

export default new ProductAttributeRepository();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attributeValue_model_1 = require("../models/attributeValue.model");
class ProductAttributeRepository {
    createAttribute(data) {
        return attributeValue_model_1.attributeModel.create(data);
    }
    createAttributeValue(data) {
        return attributeValue_model_1.attributeValueModel.create(data);
    }
}
exports.default = new ProductAttributeRepository();

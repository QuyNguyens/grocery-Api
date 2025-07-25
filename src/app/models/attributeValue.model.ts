import mongoose, { Schema, Document } from 'mongoose';
import { IAttribute, IAttributeValue } from '../../types/productVariant';

interface IAttributeValueDocument extends IAttributeValue, Document {}
interface IAttributeDocument extends IAttribute, Document {}

const AttributeValueSchema = new Schema<IAttributeValueDocument>({
  attributeId: { type: Schema.Types.ObjectId, ref: 'Attribute', required: true },
  value: { type: String, required: true },
});

const AttributeSchema = new Schema<IAttributeDocument>({
  name: { type: String, require: true },
});

const attributeValueModel = mongoose.model<IAttributeValueDocument>(
  'AttributeValue',
  AttributeValueSchema,
);
const attributeModel = mongoose.model<IAttributeDocument>('Attribute', AttributeSchema);

export { attributeValueModel, attributeModel };

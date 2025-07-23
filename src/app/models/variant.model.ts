import mongoose, { Schema, Document } from 'mongoose';
import { IVariant } from '../../types/variant';

interface IVariantDocument extends IVariant, Document {}

const VariantSchema = new Schema<IVariantDocument>({
  name: String,
  values: [String],
});

export default mongoose.model<IVariantDocument>('Variant', VariantSchema);

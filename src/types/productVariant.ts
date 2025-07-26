import { Ref } from './common';
import { IProduct } from './product';

export interface IAttribute {
  name: string; // e.g. "Color", "Size"
}

export interface IAttributeValue {
  attributeId: Ref<IAttribute>;
  value: string; // e.g. "Red", "XL"
}

export interface IProductVariant {
    productId: Ref<IProduct>;
    attributeValueIds: string[];
    price: number;
    currentPrice: number;
    discount?: {
      type: 'percentage' | 'fixed';
      value: number;
      endDate?: Date;
    };
    quantity: number;
    sku: string;
}

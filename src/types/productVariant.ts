import { Ref } from "./common";
import { IProduct } from "./product";

export interface IProductVariant {
  productId: Ref<IProduct>;
  options: { name: string; value: string }[];
  price: number; // Giá gốc
  currentPrice: number; // Giá hiện tại (có thể thấp hơn nếu đang sale)
  discount?: {
    type: 'percentage' | 'fixed';
    value: number; // VD: 10 (10%), hoặc 50000 (50k)
    endDate?: Date;
  };
  quantity: number;
  sku: string;
}

import { Types } from 'mongoose';
import { CartInput } from '../validators/cart.validator';
import cartModel from '../models/cart.model';
import { ICart, ICartItem } from '../../types/cart';
import productVariantModel from '../models/productVariant.model';

class CartRepository {
  async addCartItem(data: CartInput, userId: Types.ObjectId) {
    let cart = await cartModel.findOne({ userId });

    const cartItem: ICartItem = {
      productVariantId: new Types.ObjectId(data.productVariantId),
      quantity: data.quantity,
      attributesSnapshot: data.attributesSnapshot,
      image: data.image,
      name: data.name,
    };

    if (cart) {
      const existingItem = cart.items.find(
        item =>
          item.productVariantId.toString() === data.productVariantId &&
          JSON.stringify(item.attributesSnapshot) === JSON.stringify(data.attributesSnapshot),
      );

      if (existingItem) {
        existingItem.quantity += data.quantity;
      } else {
        cart.items.push(cartItem);
      }

      await cart.save();
    } else {
      cart = await cartModel.create({
        userId,
        items: [cartItem],
      });
    }

    return cart;
  }

  create(userId: Types.ObjectId) {
    return cartModel.create({ userId, items: [] });
  }

  async get(userId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const cart = await cartModel.findOne({ userId });

    if (!cart || !cart.items.length) return [];

    const pagedItems = cart.items.slice(skip, skip + limit);

    const result = await Promise.all(
      pagedItems.map(async cartItem => {
        const product = await productVariantModel.findById(cartItem.productVariantId, {
          discount: 1,
          price: 1,
        });

        if (!product) return null;

        return {
          _id: product._id,
          name: cartItem.name,
          discount: product.discount,
          quantity: cartItem.quantity,
          image: cartItem.image,
          attributesSnapshot: cartItem.attributesSnapshot,
          price: product.price,
        };
      }),
    );

    return result.filter(item => item !== null);
  }
}

export default new CartRepository();

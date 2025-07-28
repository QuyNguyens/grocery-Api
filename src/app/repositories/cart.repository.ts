import { Types } from 'mongoose';
import { CartInput } from '../validators/cart.validator';
import cartModel from '../models/cart.model';
import { ICartItem } from '../../types/cart';
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
      type: data.type,
    };

    let resultItem: ICartItem;

    if (cart) {
      const existingItem = cart.items.find(
        item =>
          item.productVariantId.toString() === data.productVariantId &&
          item.attributesSnapshot?.value === data.attributesSnapshot?.value,
      );

      if (existingItem) {
        existingItem.quantity += data.quantity;
        await cart.save();
        resultItem = existingItem;
      } else {
        cart.items.push(cartItem);
        await cart.save();
        resultItem = cart.items[cart.items.length - 1];
      }
    } else {
      cart = await cartModel.create({
        userId,
        items: [cartItem],
      });
      resultItem = cart.items[0];
    }

    const productVariant = await productVariantModel
      .findOne({ _id: resultItem.productVariantId })
      .populate('productId')
      .lean();

    const product = productVariant?.productId as any;

    const result = {
      _id: resultItem._id,
      productVariantId: resultItem.productVariantId,
      quantity: resultItem.quantity,
      attributesSnapshot: resultItem.attributesSnapshot,
      image: resultItem.image,
      name: resultItem.name,
      type: resultItem.type,
      price: product?.basePrice,
      discount: productVariant?.discount,
    };

    return result;
  }

  create(userId: Types.ObjectId) {
    return cartModel.create({ userId, items: [] });
  }

  async get(userId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const cart = await cartModel.findOne({ userId });

    if (!cart || !cart.items.length) return { result: [], totalCount: 0 };

    const pagedItems = cart.items.slice(skip, skip + limit);

    const result = await Promise.all(
      pagedItems.map(async cartItem => {
        const product = await productVariantModel.findById(cartItem.productVariantId, {
          discount: 1,
          price: 1,
        });

        if (!product) return null;

        return {
          _id: cartItem._id,
          name: cartItem.name,
          discount: product.discount,
          quantity: cartItem.quantity,
          image: cartItem.image,
          attributesSnapshot: cartItem.attributesSnapshot,
          price: product.price,
          type: cartItem.type,
          productVariantId: cartItem.productVariantId,
        };
      }),
    );
    const items = result.filter(item => item !== null);
    return { result: items, totalCount: cart.items.length };
  }

  async updateCartItem(userId: Types.ObjectId, itemId: Types.ObjectId, quantity: number) {
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find(item => (item._id as Types.ObjectId).equals(itemId));

    if (!item) {
      throw new Error('Cart item not found');
    }

    item.quantity = quantity;

    await cart.save();

    return { itemId, quantity };
  }

  async deleteCartItem(userId: Types.ObjectId, itemId: Types.ObjectId) {
    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(item => !item._id?.equals(itemId));

    await cart.save();
  }
}

export default new CartRepository();

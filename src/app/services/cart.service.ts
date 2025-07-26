import { Types } from 'mongoose';
import { CartInput } from '../validators/cart.validator';
import cartRepository from '../repositories/cart.repository';

class CartService {
  async addCartItem(cartItem: CartInput, userId: Types.ObjectId) {
    return await cartRepository.addCartItem(cartItem, userId);
  }

  async create(userId: Types.ObjectId) {
    return await cartRepository.create(userId);
  }

  async get(userId: Types.ObjectId, page: number, limit: number) {
    return await cartRepository.get(userId, page, limit);
  }
}

export default new CartService();

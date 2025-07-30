import { Types } from 'mongoose';
import userModel, { IUserDocument } from '../models/user.model';
import { Address } from '../../types/user';

class UserRepository {
  createUser = (data: Partial<IUserDocument>): Promise<IUserDocument> => {
    return userModel.create(data);
  };

  findUserByEmail(email: string) {
    return userModel.findOne({ email });
  }

  async pushAddress(userId: Types.ObjectId, address: Address) {
    const user = await userModel.findById(userId);
    if (!user) return;
    user?.addresses?.push(address);
    await user.save();
  }
}

export default new UserRepository();

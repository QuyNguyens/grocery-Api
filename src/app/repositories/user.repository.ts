import userModel, { IUserDocument } from '../models/user.model';

class UserRepository {
  createUser = (data: Partial<IUserDocument>): Promise<IUserDocument> => {
    return userModel.create(data);
  };

  findUserByEmail(email: string) {
    return userModel.findOne({ email });
  }
}

export default new UserRepository();

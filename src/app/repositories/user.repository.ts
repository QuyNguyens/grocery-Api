import userModel, { IUserDocument } from '../models/user.model';

export const createUser = (data: Partial<IUserDocument>): Promise<IUserDocument> => {
  return userModel.create(data);
};

export const findUserByEmail = (email: string) => {
  return userModel.findOne({ email });
};

import { Types } from 'mongoose';

export function ObjectIdConvert(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}

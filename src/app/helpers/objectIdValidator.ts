import { isValidObjectId, Types } from 'mongoose';

export function ObjectValidator(id: any): boolean {
  if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
    return false;
  }
  return true;
}

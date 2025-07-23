// types/common.ts
import { Types } from 'mongoose';

export type Ref<T> = Types.ObjectId | T;

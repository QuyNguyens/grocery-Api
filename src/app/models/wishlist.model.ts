import mongoose, { Schema, Document } from 'mongoose';
import { IWishlist } from '../../types/wishlist';

interface IWishlistDocument extends IWishlist, Document {}

const WishlistSchema = new Schema<IWishlistDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

export default mongoose.model<IWishlistDocument>('Wishlist', WishlistSchema);

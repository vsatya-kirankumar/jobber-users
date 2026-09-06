import { IBuyerDocument } from '@vsatya-kirankumar/jobber-shared';
import mongoose, { Model, Schema } from 'mongoose';

const buyerSchema: Schema = new Schema(
  {
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    profilePicture: { type: String, required: true },
    country: { type: String, required: true },
    isSeller: { type: Boolean, default: true },
    purchasedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
    createdAt: { type: Date }
  },
  {
    versionKey: false
  }
);

const BuyerModel: Model<IBuyerDocument> = mongoose.model<IBuyerDocument>('Buyer', buyerSchema, 'Buyer');
export { BuyerModel };

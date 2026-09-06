import { ISellerDocument } from '@vsatya-kirankumar/jobber-shared';
import mongoose, { Model, Schema } from 'mongoose';

const sellerSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    profilePicture: { type: String, required: true },
    description: { type: String, required: true },
    profilePublicId: { type: String, required: true },
    online: { type: String, default: '' },
    country: { type: String, required: true },
    languages: [
      {
        language: { type: String, required: true },
        level: { type: String, required: true }
      }
    ],
    skills: [{ type: String, required: true }],
    ratingsCount: { type: Number, default: 0 },
    ratingCategories: {
      five: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      four: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      three: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      two: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
      one: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } }
    },
    responseTime: { type: Number, default: 0 },
    recentDelivery: { type: Date, default: '' },
    experience: [
      {
        company: { type: String, default: '' },
        title: { type: String, default: '' },
        startDate: { type: Date, default: '' },
        endDate: { type: Date, default: '' },
        description: { type: String, default: '' },
        currentlyWorking: { type: Boolean, default: false }
      }
    ],
    education: [
      {
        country: { type: String, default: '' },
        university: { type: String, default: '' },
        title: { type: String, default: '' },
        major: { type: String, default: '' },
        year: { type: String, default: '' }
      }
    ],
    socialLinks: [{ type: String, default: '' }],
    certificates: [
      {
        name: { type: String },
        from: { type: String },
        year: { type: Number }
      }
    ],
    ongoingJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalGigs: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

const SellerModel: Model<ISellerDocument> = mongoose.model<ISellerDocument>('Seller', sellerSchema, 'Seller');
export { SellerModel };

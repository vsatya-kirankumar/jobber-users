import { IBuyerDocument } from '@vsatya-kirankumar/jobber-shared';
import { BuyerModel } from 'src/models/buyer.schema';

const getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ email }).exec()) as IBuyerDocument;
  return buyer;
};

const getBuyerByUsername = async (username: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ username }).exec()) as IBuyerDocument;
  return buyer;
};

const getRandomBuyers = async (count: number): Promise<IBuyerDocument[]> => {
  // Randomly selects the specified number of documents from the input documents.
  const pipeline = [{ $sample: { size: count } }];
  const buyers: IBuyerDocument[] = await BuyerModel.aggregate(pipeline);
  return buyers;
};

const createBuyer = async (buyerData: IBuyerDocument): Promise<void> => {
  const isBuyerExists: IBuyerDocument | null = await getBuyerByEmail(`${buyerData.email}`);
  if (!isBuyerExists) {
    await BuyerModel.create(buyerData);
  }
};

const updateBuyerIsSeller = async (email: string): Promise<void> => {
  await BuyerModel.updateOne(
    { email },
    {
      $set: {
        isSeller: true
      }
    }
  ).exec();
};

const updateBuyerPurchasedGigs = async (buyerId: string, purchasedGigId: string, type: string): Promise<void> => {
  await BuyerModel.updateOne(
    { _id: buyerId },
    type === 'puchased-gigs'
      ? {
          $push: {
            purchasedGigs: purchasedGigId
          }
        }
      : {
          $pull: {
            purchasedGigs: purchasedGigId
          }
        }
  );
};

export { getBuyerByEmail, getBuyerByUsername, getRandomBuyers, createBuyer, updateBuyerIsSeller, updateBuyerPurchasedGigs };

import { ISellerDocument } from '@vsatya-kirankumar/jobber-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getRandomSellers, getSellerById, getSellerByUsername } from '@users/services/seller.service';

const getById = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument | null = await getSellerById(req.params.sellerId as string);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

const getByUsername = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument | null = await getSellerByUsername(req.params.username as string);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

const getByRandomSellers = async (req: Request, res: Response): Promise<void> => {
  const sellers: ISellerDocument[] = await getRandomSellers(parseInt(req.params.size as string, 10));
  res.status(StatusCodes.OK).json({ message: 'Random sellers profile', sellers });
};

export { getById, getByUsername, getByRandomSellers };

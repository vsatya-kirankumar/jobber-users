import { Request, Response } from 'express';
import { getBuyerByEmail, getBuyerByUsername } from 'src/services/buyer.service';
import { StatusCodes } from 'http-status-codes';
import { IBuyerDocument } from '@vsatya-kirankumar/jobber-shared';

const email = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByEmail(req.currentUser!.email);
  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};

const currentUsername = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByUsername(req.currentUser!.email);
  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};

const username = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByUsername(req.params.username.toString());
  res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
};

export { email, currentUsername, username };

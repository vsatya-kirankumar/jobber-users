import { verifyGatewayRequest } from '@vsatya-kirankumar/jobber-shared';
import { Application } from 'express';
import { buyerRoutes, sellerRoutes, healthRoutes } from '@users/routes/index';

const BUYER_BASE_PATH = '/api/v1/buyer';
const SELLER_BASE_PATH = '/api/v1/seller';

export const appRoutes = (app: Application) => {
  app.use('', healthRoutes());

  app.use(BUYER_BASE_PATH, verifyGatewayRequest, buyerRoutes());
  app.use(SELLER_BASE_PATH, verifyGatewayRequest, sellerRoutes());
};

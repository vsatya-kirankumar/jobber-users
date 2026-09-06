import express, { Router } from 'express';
import { updateSellerDetails } from '@users/controllers/seller/update';
import { createNewSeller } from '@users/controllers/seller/create';
import { getById, getByUsername, getByRandomSellers } from '@users/controllers/seller/get';
import { seed } from '@users/controllers/seller/seed';

const router: Router = express.Router();

const sellerRoutes = (): Router => {
  router.get('/id/:sellerId', getById);
  router.get('/username/:username', getByUsername);
  router.get('/random/:size', getByRandomSellers);
  router.post('/create', createNewSeller);
  router.put('/:sellerId', updateSellerDetails);
  router.get('/seed/:count', seed);

  return router;
};

export { sellerRoutes };

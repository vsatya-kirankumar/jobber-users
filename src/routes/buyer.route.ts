import express, { Router } from 'express';
import { currentUsername, email, username } from '@users/controllers/buyer/get';

const router = express.Router();

const buyerRoutes = (): Router => {
  router.get('/email', email);
  router.get('/username', currentUsername);
  router.get('/:username', username);

  return router;
};

export { buyerRoutes };

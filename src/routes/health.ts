import express, { Router } from 'express';
import { health } from '@users/controllers/health';

const router = express.Router();

export function healthRoutes(): Router {
  router.get('/user-health', health);

  return router;
}

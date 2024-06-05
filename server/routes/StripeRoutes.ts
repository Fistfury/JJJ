import express from 'express';
import {StripeController} from '../controllers/StripeController';

const router = express.Router();

router.post('/create-checkout-session', StripeController.createCheckoutSession);

export default router;
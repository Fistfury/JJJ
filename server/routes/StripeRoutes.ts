import express from 'express';
import {StripeController} from '../controllers/StripeController';

const router = express.Router();

router.post('/create-checkout-session', StripeController.createCheckoutSession);
router.get('/prices', StripeController.getPrices);

export default router;
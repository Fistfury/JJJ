import express from 'express';
import { createPayment, getPaymentById, retryPayment } from '../controllers/PaymentController';

const router = express.Router();

// Route för att skapa en betalning
router.post('/', createPayment);

// Route för att hämta betalningsinformation baserat på ID
router.get('/:id', getPaymentById);

router.post('/retry', retryPayment);

export default router;
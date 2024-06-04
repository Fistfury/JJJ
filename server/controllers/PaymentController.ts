import { Request, Response } from 'express';
import { connectToDatabase } from '../config/db';
import { stripe } from '../config/stripe';

export const createPayment = async (req: Request, res: Response) => {
    const { userId, subscriptionId } = req.body;

    try {
        const db = await connectToDatabase();
        const subscription = await db.collection('subscriptions').findOne({ _id: subscriptionId });

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        const amount = subscription.price;

        // Skapa en ny betalningsintent med Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, 
            currency: 'sek',
            metadata: { userId, subscriptionId }
        });

        res.status(201).json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error('Payment creation failed:', error);
        res.status(500).json({ message: 'Failed to create payment', error: error.message});
    }
};

export const getPaymentById = async (req: Request, res: Response) => {
    // Din befintliga metod, eventuellt lägg till Stripe-specifika query om nödvändigt
};

export const retryPayment = async (req: Request, res: Response) => {
    const { paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === 'requires_payment_method') {
            const retriedIntent = await stripe.paymentIntents.confirm(paymentIntentId);
            res.status(200).json({ clientSecret: retriedIntent.client_secret });
        } else {
            res.status(400).json({ message: 'Payment cannot be retried in current state' });
        }
    } catch (error: any) {
        console.error('Failed to retry payment:', error);
        res.status(500).json({ message: 'Failed to retry payment', error: error.message });
    }
};
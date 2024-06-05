import { Request, Response } from 'express';
import { stripe } from "../config/stripe";

export class StripeController {
    static async createCheckoutSession(req: Request, res: Response): Promise<void> {
        try {
            const { priceId } = req.body;
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price: priceId,
                    quantity: 1,
                }],
                mode: 'subscription',
                success_url: `${process.env.BASE_URL}/payment-success`,
                cancel_url: `${process.env.BASE_URL}/payment-failed`,
            });
            res.json({ sessionId: session.id, url: session.url });
        } catch (error: any) {
            console.error('Stripe Checkout Session creation failed:', error);
            res.status(500).json({ message: 'Failed to create Stripe checkout session', error: error.message });
        }
    }
}
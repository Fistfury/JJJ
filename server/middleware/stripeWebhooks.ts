import { Request, Response } from 'express';
import { stripe } from '../config/stripe';

export async function handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    console.log('Received webhook event:', req.body);
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);

        switch (event.type) {
            case 'invoice.payment_succeeded':
                const paymentIntentId = event.data.object.payment_intent;
                console.log(`Payment succeeded with payment intent: ${paymentIntentId}`);
                break;
            case 'invoice.payment_failed':
                const failedPaymentIntentId = event.data.object.payment_intent;
                console.log(`Payment failed for intent: ${failedPaymentIntentId}`);
                break;
            case 'customer.subscription.created':
                const subscription = event.data.object;
                console.log(`New subscription created: ${subscription.id}`);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({received: true});
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        } else {
            return res.status(400).send("Webhook Error: Unknown error");
        }
    }
}

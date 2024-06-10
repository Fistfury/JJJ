import { Request, Response } from 'express';
import { stripe } from '../config/stripe';
import { connectToDatabase } from '../config/db';
import Stripe from 'stripe';

export async function handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const buf = req.body;

    console.log('Received webhook event:', buf.toString());

    try {
        const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
        console.log('Constructed event:', event);
        const db = await connectToDatabase();

        switch (event.type) {
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                const paymentIntentId = invoice.payment_intent as string;
                const customerId = invoice.customer as string;
                const subscriptionId = invoice.subscription as string;
                console.log(`Payment succeeded with payment intent: ${paymentIntentId}`);

                const insertResult = await db.collection('payments').insertOne({
                    paymentIntentId: paymentIntentId,
                    status: 'succeeded',
                    customerId: customerId,
                    amount: invoice.amount_paid,
                    currency: invoice.currency,
                    createdAt: new Date(invoice.created * 1000),
                });
                console.log('Insert result:', insertResult);

                const subscriptionUpdateResult = await db.collection('subscriptions').updateOne(
                    { subscriptionId: subscriptionId },
                    { $set: { status: 'active' } }
                );
                console.log('Subscription update result:', subscriptionUpdateResult);
                break;
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const failedPaymentIntentId = invoice.payment_intent as string;
                const failedCustomerId = invoice.customer as string;
                const subscriptionId = invoice.subscription as string;
                console.log(`Payment failed for intent: ${failedPaymentIntentId}`);

                const failedInsertResult = await db.collection('payments').insertOne({
                    paymentIntentId: failedPaymentIntentId,
                    status: 'failed',
                    customerId: failedCustomerId,
                    amount: invoice.amount_due,
                    currency: invoice.currency,
                    createdAt: new Date(invoice.created * 1000),
                });
                console.log('Failed insert result:', failedInsertResult);

                const subscriptionUpdateResult = await db.collection('subscriptions').updateOne(
                    { subscriptionId: subscriptionId },
                    { $set: { status: 'past_due' } }
                );
                console.log('Subscription update result:', subscriptionUpdateResult);
                break;
            }
            case 'customer.subscription.created': {
                const subscription = event.data.object as Stripe.Subscription;
                const subscriptionLevel = subscription.metadata.subscriptionLevel;
                console.log(`New subscription created: ${subscription.id}, Level: ${subscriptionLevel}`);

                const subscriptionInsertResult = await db.collection('subscriptions').insertOne({
                    subscriptionId: subscription.id,
                    customerId: subscription.customer as string,
                    subscriptionLevel: subscriptionLevel,
                    status: subscription.status,
                    createdAt: new Date(subscription.created * 1000),
                });
                console.log('Subscription insert result:', subscriptionInsertResult);
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Error in webhook handling:', err);
        if (err instanceof Error) {
            res.status(400).send(`Webhook Error: ${err.message}`);
        } else {
            res.status(400).send("Webhook Error: Unknown error");
        }
    }
}

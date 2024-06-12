import { Request, Response } from 'express';
import { stripe } from '../config/stripe';
import { connectToDatabase } from '../config/db';
import Stripe from 'stripe';
import { Db } from 'mongodb';

interface PaymentRecord {
  paymentIntentId: string;
  status: string;
  customerId: string;
  amount: number;
  currency: string;
  createdAt: Date;
  retryUrl?: string | null;
}

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const buf = req.body;

  try {
    const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    const db = await connectToDatabase();

    console.log(`Received event: ${event.type}`);

    switch (event.type) {
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
        await handleInvoiceEvents(event, db);
        break;
    case 'checkout.session.completed':
        await handleSubscriptionEvents(event, db);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionEvents(event, db);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('Error in webhook handling:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

const handleInvoiceEvents = async (event: Stripe.Event, db: Db) => {
  const invoice = event.data.object as Stripe.Invoice;
  const status = event.type === 'invoice.payment_succeeded' ? 'succeeded' : 'failed';

  console.log(`Handling invoice event: ${event.type}`);

  const paymentRecord: PaymentRecord = {
    paymentIntentId: invoice.payment_intent as string,
    status: status,
    customerId: invoice.customer as string,
    amount: status === 'succeeded' ? invoice.amount_paid : invoice.amount_due,
    currency: invoice.currency,
    createdAt: new Date(invoice.created * 1000),
  };

  if (status === 'failed' && invoice.hosted_invoice_url) {
    paymentRecord.retryUrl = invoice.hosted_invoice_url;
  }

  await db.collection('payments').insertOne(paymentRecord);

  if (invoice.subscription) {
    const subscriptionStatus = status === 'succeeded' ? 'active' : 'past_due';
    const updateResult = await db.collection('subscriptions').updateOne(
      { subscriptionId: invoice.subscription as string },
      { $set: { status: subscriptionStatus } }
    );
    console.log(`Updated subscription status: ${subscriptionStatus}, Update result: ${JSON.stringify(updateResult)}`);
  }
};

const handleSubscriptionEvents = async (event: Stripe.Event, db: Db) => {
    if (event.type === 'checkout.session.completed' && 'metadata' in event.data.object) {
        const session = event.data.object as Stripe.Checkout.Session;
      
        console.log(`Handling checkout session completed event: ${event.type}`);
      
        // Check if metadata and customer are not null or undefined
        if (session.metadata && session.customer && typeof session.customer === 'string') {
            const subscriptionLevel = session.metadata.subscriptionLevel;
            console.log(`subscriptionLevel: ${subscriptionLevel}`);
          
            // Retrieve customer details from Stripe
            const customerDetails = await stripe.customers.retrieve(session.customer) as Stripe.Customer;
            const email = customerDetails.email;
      
          // Check if a user exists with the given stripeCustomerId
          const user = await db.collection('user').findOne({ stripeCustomerId: session.customer });
          if (!user) {
            console.error(`No user found with customerId: ${session.customer}`);
            return;
          }
      
          // Check if subscription is not null or undefined
          if (session.subscription) {
            // Update the subscription record
            const updateResult = await db.collection('subscriptions').updateOne(
              { subscriptionId: session.subscription },
              {
                $set: {
                  customerId: session.customer,
                  subscriptionLevel: subscriptionLevel,
                  status: 'active',
                  email: email,
                  createdAt: new Date(),
                },
              },
              { upsert: true }
            );
          }
        }
      }
    }
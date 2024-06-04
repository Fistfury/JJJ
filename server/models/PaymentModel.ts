import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';
import { stripe } from '../config/stripe';

export class Payment {
    private collection: any;

    constructor() {
        this.init();
    }

    async init() {
        const db = await connectToDatabase();
        this.collection = db.collection('payments');
    }

    async createStripePayment(userId: string, subscriptionId: string, amount: number) {
        // Skapa kund med Stripe
        const customer = await stripe.customers.create({
            email: "user@example.com"  // Använd korrekt e-post från användardata
        });

        // Skapa betalningsintent med Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'sek',
            customer: customer.id,
            metadata: { userId, subscriptionId }
        });

        // Spara betalningsinformation i databasen
        const paymentRecord = {
            userId,
            subscriptionId,
            stripeCustomerId: customer.id,
            stripePaymentIntentId: paymentIntent.id,
            amount,
            currency: 'sek',
            status: paymentIntent.status,
            createdAt: new Date(),
        };

        const result = await this.collection.insertOne(paymentRecord);
        return { paymentIntentId: paymentIntent.id, clientSecret: paymentIntent.client_secret, paymentRecordId: result.insertedId };
    }

    async getPaymentById(paymentId: string) {
        const result = await this.collection.findOne({ _id: new ObjectId(paymentId) });
        return result;
    }
}
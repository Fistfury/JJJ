import Stripe from 'stripe';
import { connectToDatabase } from './db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10'
});

// async function generatePaymentMethodUpdateLink(stripeCustomerId: string): Promise<string> {
//   console.log(`Received stripeCustomerId: ${stripeCustomerId}`);
//   const db = await connectToDatabase();
//   const user = await db.collection("user").findOne({ stripeCustomerId });

//   if (!user || !user.stripeCustomerId) {
//     throw new Error("No Stripe customer ID found for user.");
//   }
  
//   const session = await stripe.billingPortal.sessions.create({
//     customer: user.stripeCustomerId, 
//     return_url: 'http://localhost:5173',
//   });

//   return session.url;
// }


export { stripe };
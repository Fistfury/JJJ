import { Request, Response } from "express";
import { stripe } from "../config/stripe";
import { connectToDatabase } from "../config/db";
import { Price } from "../../client/src/Interfaces/Price";
import Stripe from "stripe";

export class StripeController {
  static async createCheckoutSession(
    req: Request,
    res: Response
  ): Promise<void> {
    const { priceId, email, subscriptionLevel } = req.body;
    let customer;

    try {
      // Kolla om användaren redan har ett Stripe kund-ID
      const db = await connectToDatabase();
      const user = await db.collection("user").findOne({ email: email });
      if (user && user.stripeCustomerId) {
        customer = { id: user.stripeCustomerId };
      } else {
        // Skapa en ny Stripe-kund
        customer = await stripe.customers.create({ email });
        // Uppdatera användardatabasen med Stripe kund-ID
        await db
          .collection("user")
          .updateOne(
            { email },
            { $set: { stripeCustomerId: customer.id } },
            { upsert: true }
          );
      }

      // Skapa Stripe Checkout-session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        metadata: {
            subscriptionLevel: subscriptionLevel
          },
        success_url: `${process.env.BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/payment-failed`,
        customer: customer.id,
      });
      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Failed to create Stripe checkout session:", error);
      res.status(500).json({
        message: "Failed to create Stripe checkout session",
        error: error.message,
      });
    }
  }

  static async getPrices(req: Request, res: Response): Promise<void> {
    try {
      const prices = await stripe.prices.list({
        active: true,
        expand: ["data.product"],
      });

      const filteredPrices: Price[] = prices.data
        .filter((price) =>
          price.product && typeof price.product !== 'string' && 'name' in price.product &&
          ["Dev Basics", "Dev Plus", "Dev Dominator"].includes(price.product.name)
        )
        .map((price) => ({
          id: price.id,
          name: (price.product as Stripe.Product).name,
          unit_amount: price.unit_amount ?? 0,
          currency: price.currency,
        }));

      res.json(filteredPrices);
    } catch (error: any) {
      console.error("Error fetching prices from Stripe:", error);
      res.status(500).send("Failed to retrieve prices");
    }
  }
}

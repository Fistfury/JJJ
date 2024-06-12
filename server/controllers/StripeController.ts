import { Request, Response } from "express";
import { stripe } from "../config/stripe";
import { connectToDatabase } from "../config/db";
import { Price } from "../../client/src/Interfaces/Price";
import Stripe from "stripe";

export class StripeController {
  static async createCheckoutSession(req: Request, res: Response): Promise<void> {
    console.log("Received data:", req.body); 
    const { priceId, email, subscriptionLevel, stripeCustomerId  } = req.body;
    
    if (!email || !subscriptionLevel || !priceId) {
        res.status(400).json({ message: "Email, priceId and subscription level are required" });
        return;
      }
      let customer;
      try {
        const db = await connectToDatabase();
        
        if (stripeCustomerId) {
          customer = await stripe.customers.retrieve(stripeCustomerId);
          if (!customer || customer.deleted) {
            res.status(404).json({ message: "Stripe Customer ID not found or deleted" });
            return;
          }
        } else {
          customer = await stripe.customers.create({ email });
          await db.collection("user").updateOne(
            { email },
            { $set: { stripeCustomerId: customer.id } },
            { upsert: true }
          );
        }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: "subscription",
        metadata: { subscriptionLevel },
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
        const allPrices: Price[] = [];
        let hasMore = true;
        let startingAfter: string | undefined = undefined;

        while (hasMore) {
            const response = await stripe.prices.list({
                active: true,
                limit: 10,
                expand: ["data.product"],
                starting_after: startingAfter,
            });

            const prices = response.data as Stripe.Price[];

            prices.forEach((price) => {
                const product = price.product as Stripe.Product;
                const isProductActive = product.active;
                const isPriceActive = price.active;
                const isRelevantProductName = ["Dev Basics", "Dev Plus", "Dev Dominator"].includes(product.name);

                if (isProductActive && isPriceActive && isRelevantProductName) {
                    allPrices.push({
                        id: price.id,
                        name: product.name,
                        unit_amount: price.unit_amount ?? 0,
                        currency: price.currency,
                    });
                }
            });

            hasMore = response.has_more;
            if (hasMore) {
                startingAfter = prices[prices.length - 1].id;
            }
        }

        // Log filtered prices
        console.log("Filtered prices:", allPrices);

        res.json(allPrices);
    } catch (error: any) {
        console.error("Error fetching prices from Stripe:", error);
        res.status(500).send("Failed to retrieve prices");
    }
  }
}
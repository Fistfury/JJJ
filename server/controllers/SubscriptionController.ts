import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/db";
import { Request, Response } from "express";
import { SubscriptionLevel } from "../models/SubscriptionModel";
import { stripe } from "../config/stripe";
import Stripe from "stripe";


interface User {
    email: string;
    password: string;
    stripeCustomerId: string;
}

interface Admin {
    email: string;
    password: string;
}

interface Session {
    user? : User;
    admin? : Admin;
}

export const getSubscriptionLevels = async (req: Request, res: Response) => {

    let email = (req.session as Session).user?.email
    console.log(email);
    try { 
    const db = await connectToDatabase();
    const user = await db.collection('subscriptions').findOne({ "email": email });
    res.json(user?.subscriptionLevel);
    console.log(user?._id);
    } catch (error) {
    res.status(500).send('Error getting subscription levels');
    }
};

export const createSubscription = async (req: Request, res: Response) => {
    const { priceId, email, subscriptionLevel, stripeCustomerId } = req.body;
    console.log("Request data:", { priceId, email, subscriptionLevel, stripeCustomerId });

    try {
      const db = await connectToDatabase();
      const usersCollection = db.collection("user");
      let user = await usersCollection.findOne({ email });
      
      // Kontrollera att en användare faktiskt hittades
      if (!user) {
        res.status(404).json({ error: "User not found" });
        console.error("User not found:", email);
        return;
      }

      console.log("Fetched user from DB:", user);

      // Kontrollera om användaren redan har ett stripeCustomerId, annars skapa en ny
      if (!user.stripeCustomerId) {
        const newCustomer = await stripe.customers.create({ email });
        user.stripeCustomerId = newCustomer.id;
        await user.Collection.updateOne({ email }, { $set: { customerId: user.stripeCustomerId } });
        console.log("Created new Stripe customer:", newCustomer);
      }
      
      const subscription = await stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [{ price: priceId }],
        expand: ['latest_invoice.payment_intent'],
      });

      console.log("Created subscription:", subscription);

      if (!subscription.latest_invoice || typeof subscription.latest_invoice === 'string') {
        throw new Error("Failed to retrieve latest invoice details.");
      }

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      console.log("Latest invoice details:", invoice);

      if (!invoice.payment_intent) {
        throw new Error("Failed to retrieve payment intent from invoice.");
      }

      const paymentIntentId = (invoice.payment_intent as Stripe.PaymentIntent).id;
      console.log("Payment Intent ID:", paymentIntentId);

      const updateResult = await user.Collection.updateOne(
        { email },
        { $set: { 
          subscriptionLevel, 
          startDate: new Date(), 
          customerId: user.stripeCustomerId, 
          paymentIntentId, 
          subscriptionId: subscription.id 
        } },
        { upsert: true }
      );

      console.log("Database update result:", updateResult);
      res.status(201).json({ subscriptionId: subscription.id });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).send("Error creating subscription");
    }
};


export const updateSubscription = async (req: Request, res: Response) => {
    const { subscriptionLevel } = req.body;
    let email = (req.session as Session).user?.email

    try {
    const db = await connectToDatabase();
    const collection = db.collection("subscriptions");
    const userExists = await collection.findOne({ "email": email });
    if (userExists) {
      if (userExists && userExists.subscriptionLevel === subscriptionLevel) {
        return res.status(409).json("Already subscribed");

    } else  {
        const result = await collection.updateOne(
          {"email": email}, {$set: 
            {"subscriptionLevel": subscriptionLevel, "createdAt": new Date()}});
        console.log(result);
        return res.status(200).json(result);
    }  
    } else {
      return res.status(404).json("User not found");
    } 
    } catch (error) {
        console.error("Error updating subscription:", error);
        res.status(500).send("Error updating subscription");
    }
    };

  
    export const pauseSubscription = async (req: Request, res: Response) => {
      let email = (req.session as Session).user?.email;
      
      console.log(`Received request to pause subscription for email: ${email}`);
      
      try {
        const db = await connectToDatabase();
        
        const user = await db.collection('subscriptions').findOne({ "email": email });
        const subscriptionId = user?.subscriptionId;
        console.log("subscriptionId:", subscriptionId);
        if (!subscriptionId) {
          return res.status(404).json("SubscriptionId not found");
        }
        const pauseSubscription = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
        await db.collection('subscriptions').updateOne({"email": email} , { $set: { cancel_at_period_end: true } });
        
        console.log("Subscription paused:", pauseSubscription);
        
        res.json("Subscription paused");
                
        } catch (error) {
            console.error("Error pausing subscription:", error);
            res.status(500).send("Error pausing subscription");
        }
    };

    export const getSubscriptionStatus = async (req: Request, res: Response) => {

        const { subscriptionId } = req.params;
      
        console.log(`Received request to get status for subscription: ${subscriptionId}`);
      
        if (!subscriptionId) {
          return res.status(400).json({ error: 'Subscription ID is required' });
        }
      
        try {
          const db = await connectToDatabase();
          const subscription = await db.collection('subscriptions').findOne({ subscriptionId });
      
          if (!subscription) {
            console.error(`No subscription found in database with ID: ${subscriptionId}`);
            return res.status(404).json({ error: 'Subscription not found' });
          }
      
          console.log(`Found subscription in database`, (subscription));
      
          // Retrieve the Stripe subscription using the subscriptionId
          const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      
        console.log(`Retrieved subscription from Stripe:`, (stripeSubscription));
          const invoiceId = stripeSubscription.latest_invoice as string;
          const invoice = await stripe.invoices.retrieve(invoiceId);
        console.log(`Retrieved invoice from Stripe:`, (invoice));
          const updateUrl = invoice.hosted_invoice_url;
      
          res.json({ status: stripeSubscription.status, updateUrl });
        } catch (error) {
          console.error("Error fetching subscription status:", error);
          res.status(500).send("Error fetching subscription status");
        }
      };

    export const getArticles = async (req: Request, res: Response) => {
        const email = (req.session as Session).user?.email;
        if (!email) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
    try { 
    const db = await connectToDatabase();
    const user = await db.collection('subscriptions').findOne({ "email": email });
    if (!user) {
        return res.status(404).json("User not found");
    }
    const userSubscriptionLevel = user.subscriptionLevel as SubscriptionLevel;
    const articleCursor = db.collection('articles').find({subscriptionLevel: {$lte: userSubscriptionLevel}});
    const articles = await articleCursor.toArray();


    return res.json(articles);
    

    } catch (error) {
    res.status(500).json('Error getting subscription levels');
    }
}
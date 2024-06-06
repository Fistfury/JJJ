import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/db";
import { Request, Response } from "express";

export const getSubscriptionLevels = async (req: Request, res: Response) => {
    try { 
    const db = await connectToDatabase();
    const subscriptionLevels = await db.collection('subscriptions').find({}).toArray();
    res.json(subscriptionLevels);
    } catch (error) {
    res.status(500).send('Error getting subscription levels');
    }
};

export const createSubscription = async (req: Request, res: Response) => {
    const { email, subscriptionLevel } = req.body;

    // uppdatera användare till rätt sub lvl
    // skapa document i collection subscriptions
        // länk till användaren
        // stripe-id
        // startdatum

    try {
    const db = await connectToDatabase();
    const user = db.collection("user");
    const collection = db.collection("subscriptions");
    const userExists = await collection.findOne({ "email": email });

    if (userExists && userExists.subscriptionLevel === subscriptionLevel) {
        return res.status(409).send("Already subscribed");

    } else if (userExists && userExists.subscriptionLevel !== subscriptionLevel) {
        const result = await collection.updateOne({"email": email}, {$set: {"subscriptionLevel": subscriptionLevel, "startDate": new Date()}});
        return res.status(201).send("Subscription updated");
        
    } else {
        const result = await collection.insertOne({
            "email": email, 
            "subscriptionLevel": subscriptionLevel, 
            "startDate": new Date(),
            "stripeCustomerId": null,
            "paymentId": null});
        const createdSubscription = await user.findOne({ email, subscriptionLevel });
        res.status(201).json(createdSubscription);
    } 
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).send("Error creating subscription");
    }
    };

    export const deleteSubscription = async (req: Request, res: Response) => {
        try {
            const db = await connectToDatabase();
            const { id } = req.params;
            await db.collection('subscriptions').deleteOne({ _id: new ObjectId(id) });
            res.send('Subscription deleted');
        } catch (error) {
            res.status(500).send('Error deleting subscription');
        }
    };

export const getArticles = async (req: Request, res: Response) => {
    try { // TODO JLo: get articles sub lvl 
      const db = await connectToDatabase();
      const articles = await db.collection('articles').find({}).toArray();
      res.json(articles);
    } catch (error) {
      res.status(500).send('Error getting articles');
    }
  };

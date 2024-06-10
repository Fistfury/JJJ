import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/db";
import { NextFunction, Request, Response } from "express";
import { SubscriptionLevel } from "../models/SubscriptionModel";

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
    try { 
    const db = await connectToDatabase();
    const subscriptionLevels = await db.collection('subscriptions').find({}).toArray();
    res.json(subscriptionLevels);
    } catch (error) {
    res.status(500).send('Error getting subscription levels');
    }
};

export const createSubscription = async (req: Request, res: Response) => {
    const { subscriptionLevel } = req.body;
    let email = (req.session as Session).user?.email

    try {
    const db = await connectToDatabase();
    const user = db.collection("user");
    const collection = db.collection("subscriptions");
    const userExists = await collection.findOne({ "email": email });

    if (userExists && userExists.subscriptionLevel === subscriptionLevel) {
        return res.status(409).json("Already subscribed");

    } else if (userExists && userExists.subscriptionLevel !== subscriptionLevel) {
        const result = await collection.updateOne({"email": email}, {$set: {"subscriptionLevel": subscriptionLevel, "startDate": new Date()}});
        return res.status(201).json({"message": "Subscription updated"});
        
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

    
     export const pauseSubscription = async (req: Request, res: Response) => {
        try {
        const db = await connectToDatabase();
        const { id } = req.params;

        await db.collection('subscriptions').updateOne({ _id: new ObjectId(id) }, { $set: { subscriptionLevel: "noob" } });
        // TODOJLo: check date 
        
        res.send("Subscription paused");
        
        } catch (error) {
            console.error("Error pausing subscription:", error);
            res.status(500).send("Error pausing subscription");
        }
    };


/* export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
    const db = await connectToDatabase();
    const email = req.headers['email'] as string;
    // TODO JLo: get user or id from session

    const user = await db.collection('user').findOne({ email });

    if(!user) {
        return res.status(404).send('User not found');
    }

    const articles = await db.collection('articles').find({}).toArray();
    res.json(articles);

    if (user.subscriptionLevel !== articles.subscriptionLevel) {

    }
  };
 */
    // TODO JLo: get articles sub lvl 
      // hämta user sub lvl
      // filtrera artiklar baserat på user sub lvl
      // lte > less than or equal
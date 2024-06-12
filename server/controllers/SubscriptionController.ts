import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/db";
import { Request, Response } from "express";
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

        res.status(201).json(result);
    } 
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
    
        if (userExists && userExists.subscriptionLevel === subscriptionLevel) {
            return res.status(409).json("Already subscribed");
    
        } else if (userExists && userExists.subscriptionLevel !== subscriptionLevel) {
            const result = await collection.updateOne({"email": email}, {$set: {"subscriptionLevel": subscriptionLevel, "startDate": new Date()}});
            return res.status(201).json(result);
            
        } 
        } catch (error) {
            console.error("Error creating subscription:", error);
            res.status(500).send("Error creating subscription");
        }
        };

    
    export const pauseSubscription = async (req: Request, res: Response) => {
        try {
        const db = await connectToDatabase();
        const email = (req.session as Session).user?.email;
        console.log(email);

        const subscription = await db.collection('subscriptions').findOne({ "email": email });
        const _id = subscription?._id;
        console.log("_id:", _id);

        await db.collection('subscriptions').updateOne({ _id: new ObjectId(_id) }, { $set: { subscriptionLevel: "paused" } });
        // TODO JLo: check date 
        
        res.json("Subscription paused");
                
        } catch (error) {
            console.error("Error pausing subscription:", error);
            res.status(500).send("Error pausing subscription");
        }
    };
	
export const getArticles = async (req: Request, res: Response) => {
    let email = (req.session as Session).user?.email

    try { 
    const db = await connectToDatabase();
    const user = await db.collection('subscriptions').findOne({ "email": email });
    if (!user) {
        return res.status(404).json("User not found");
    }
    const userSubscriptionLevel = user.subscriptionLevel as SubscriptionLevel;
    const articleCursor = db.collection('articles').find({subscriptionLevel: {$lte: userSubscriptionLevel}});
    const articles = await articleCursor.toArray();
    /* const invalidArticles = articles.filter(article => article.subscriptionLevel > userSubscriptionLevel);
        if (invalidArticles.length > 0) {

            return res.status(403).json("Some articles exceed user's subscription level");
        }
 */

    return res.json(articles);
    

    } catch (error) {
    res.status(500).json('Error getting subscription levels');
    }
}
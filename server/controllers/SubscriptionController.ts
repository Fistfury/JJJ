import { connectToDatabase } from "../config/db";
import { Request, Response } from "express";
import { SubscriptionLevel } from "../models/SubscriptionModel";
import { ObjectId } from "mongodb";

export const getSubscriptionLevels = async (req: Request, res: Response) => {
    try { 
    const db = await connectToDatabase();
    const subscriptionLevels = await db.collection('subscriptions').find({}).toArray();
    res.json(subscriptionLevels);
    } catch (error) {
    res.status(500).send('Error getting subscription levels');
    }
}

export const updateSubscription = async (req: Request, res: Response) => {
    try {
    const db = await connectToDatabase();
    const { id } = req.params;
    const { subscriptionLevel } = req.body;
    const collection = db.collection('subscriptions');
    let user = await collection.findOne({ "user": req.body.user });

    if (user && user.subscriptionLevel === subscriptionLevel) {
        return res.status(409).send("Already subscribed");
    }
/*     if (user.subscriptionLevel ==! subscriptionLevel) {
        await collection.updateOne({ "_id": new ObjectId(id)}, { "$set": {
            "subscriptionLevel": 
            subscriptionLevel
            }});
            res.send('Subscription updated');
        } */
    } /* finally {
        await collection.insertOne({ _id: new ObjectId(id),
        user: req.body.user, 
        subscriptionLevel: subscriptionLevel,
        stripeCustomerId: "",
        startDate: new Date(),
        paymentId: null,
    });
    res.send('Subscription updated');
} */ catch (error) {
    res.status(500).send('Error updating subscription');
}
};

/*     await collection.updateOne({ "_id": new ObjectId(id)}, { "$set": {
        "subscriptionLevel": 
        subscriptionLevel)}};
    res.send('Subscription updated');
    } catch (error) {
    res.status(500).send('Error updating subscription');
    } */


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

//    const subscriptionLevel = db.collection("user");
    const userExists = await user.findOne({ "email": email });

    console.log(req.body);

    if (userExists) {
        return res.status(409).send("Already subscribed");
        
    } else {
        const result = await user.insertOne({"email": email, "subscriptionLevel": subscriptionLevel});
        const createdSubscription = await user.findOne({ email, subscriptionLevel });
        res.status(201).json(createdSubscription);  
    } 
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).send("Error creating subscription");
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

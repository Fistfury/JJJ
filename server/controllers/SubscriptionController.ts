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
    
    export const updateSubscription = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const db = await connectToDatabase();
            console.log(req.body);
            const user = await db.collection('subscriptions').findOne({ "user": req.body.user }); // TODO JLo: get user
            const subscriptionLevel = req.body.subscriptionLevel;
    
            if (user && user.subscriptionLevel === subscriptionLevel) {
                return res.status(409).send("Already subscribed");
            } else if (user && user.subscriptionLevel == subscriptionLevel) {
                await db.collection('subscriptions').updateOne(
                    { "_id": new ObjectId(id) },
                    { "$set": { 
                        "subscriptionLevel": subscriptionLevel,
                    }}
                );
                return res.send('Subscription updated');
            } 
        } catch (error) {
            res.status(500).send('Error updating subscription');
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

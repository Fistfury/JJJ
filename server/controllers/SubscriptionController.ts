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

export const createSubscription = async (req: Request, res: Response) => {
    try {
    const db = await connectToDatabase();
    const user = db.collection("users");
    const userExists = await user.findOne({ _id: req.body._id });

    if (userExists) {
        return res.status(409).send("Already subscribed");
    } else {
        const result = await user.insertOne({"_id": req.body._id, "subscriptionLevel": req.body.subscriptionLevel});
        const createdSubscription = await user.findOne({ _id: result.insertedId });
        res.status(201).json(createdSubscription);  
    } 
    } catch (error) {
        res.status(500).send("Error creating subscription");
    }
    };

export const getArticles = async (req: Request, res: Response) => {
    try {
      const db = await connectToDatabase();
      const articles = await db.collection('articles').find({}).toArray();
      res.json(articles);
    } catch (error) {
      res.status(500).send('Error getting articles');
    }
  };


export const updateSubscription = async (req: Request, res: Response) => {
    try {
        const db = await connectToDatabase();
        const user = db.collection("users");
        const updatedSubscription = await user.updateOne({ "_id": req.body._id }, { "$set": { "subscriptionLevel": req.body.subscriptionLevel } });
        res.json(updatedSubscription);
    } catch (error) {
        res.status(500).send("Error updating subscription");
    }
}; //// NOT WORKING AT ALL 
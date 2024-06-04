import { ObjectId } from "mongodb";

export interface subscriptionLevel {
    _id?: ObjectId;
    name: string;
    price: number;
    duration: string;
}
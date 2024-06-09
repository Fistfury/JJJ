import { ObjectId } from 'mongodb';

export interface Article {
  _id?: ObjectId;
  title: string;
  content: string;
  imageUrl: string;
  subscriptionLevel: string;
}
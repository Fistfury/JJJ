import { Request, Response } from 'express';
import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';
import { Article } from '../models/ArticleModel';


export const getArticles = async (req: Request, res: Response) => {
  try {
    const db: Db = await connectToDatabase();
    const articles = await db.collection('articles').find({}).toArray();
    res.json(articles);
  } catch (error) {
    res.status(500).send('Error getting articles');
  }
};

export const createArticle = async (req: Request, res: Response) => {
    try {
      const db: Db = await connectToDatabase();
      const article: Article = req.body;
      const result = await db.collection('articles').insertOne({
        ...article,
        _id: new ObjectId()
      });
      const createdArticle = await db.collection('articles').findOne({ _id: result.insertedId });
      res.status(201).json(createdArticle);
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).send('Error creating article');
    }
  };

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const db: Db = await connectToDatabase();
    const { id } = req.params;
    const article: Partial<Article> = req.body;
    console.log('Updating article with ID:', id, 'with data:', article);
    await db.collection('articles').updateOne({ _id: new ObjectId(id) }, { $set: article });
    res.send('Article updated');
  } catch (error) {
    res.status(500).send('Error updating article');
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const db: Db = await connectToDatabase();
    const { id } = req.params;
    console.log(`Attempting to delete article with id: ${id}`);
    await db.collection('articles').deleteOne({ _id: new ObjectId(id) });
    res.send('Article deleted');
  } catch (error) {
    res.status(500).send('Error deleting article');
  }
};

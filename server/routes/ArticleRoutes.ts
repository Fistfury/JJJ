import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';

const router = Router();


router.get('/', async (req, res) => {
  try {
    const db: Db = await connectToDatabase();
    const articles = await db.collection('articles').find({}).toArray();
    res.json(articles);
  } catch (error) {
    res.status(500).send('Error getting articles');
  }
});


router.post('/', async (req, res) => {
  try {
    const db: Db = await connectToDatabase();
    const article = req.body;
    await db.collection('articles').insertOne(article);
    res.status(201).send('Article created');
  } catch (error) {
    res.status(500).send('Error creating article');
  }
});


router.put('/:id', async (req, res) => {
  try {
    const db: Db = await connectToDatabase();
    const { id } = req.params;
    const article = req.body;
    await db.collection('articles').updateOne({ _id: new ObjectId(id) }, { $set: article });
    res.send('Article updated');
  } catch (error) {
    res.status(500).send('Error updating article');
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const db: Db = await connectToDatabase();
    const { id } = req.params;
    await db.collection('articles').deleteOne({ _id: new ObjectId(id) });
    res.send('Article deleted');
  } catch (error) {
    res.status(500).send('Error deleting article');
  }
});

export default router;

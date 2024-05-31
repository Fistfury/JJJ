import express from 'express';
import { connectToDatabase } from './config/db';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/test-db', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('testCollection');
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error connecting to the database');
  }
});

app.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to start server due to database connection error', error);
  }
});

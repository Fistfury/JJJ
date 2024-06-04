import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/db';
import ArticleRoutes from './routes/ArticleRoutes';
import logger from './middleware/logger';
import SubscriptionRoutes from './routes/SubscriptionRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/articles', ArticleRoutes);
app.use('/api/subscriptions', SubscriptionRoutes);

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

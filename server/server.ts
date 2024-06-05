import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sessionMiddleware from './middleware/session';
import AuthRoutes from './routes/AuthRoutes';
import ArticleRoutes from './routes/ArticleRoutes';
import { connectToDatabase } from './config/db';
import PaymentRoutes from './routes/PaymentRoutes';
import logger from './middleware/logger';
import SubscriptionRoutes from './routes/SubscriptionRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);


app.use('/api/auth', AuthRoutes);
app.use('/api/articles', ArticleRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/articles', ArticleRoutes);
app.use('/api/subscriptions', SubscriptionRoutes);
app.use('/api/payments', PaymentRoutes);

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

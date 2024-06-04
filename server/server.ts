import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sessionMiddleware from './middleware/session';
import AuthRoutes from './routes/AuthRoutes';
import ArticleRoutes from './routes/ArticleRoutes';
import { connectToDatabase } from './config/db';
import logger from './middleware/logger';

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

app.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to start server due to database connection error', error);
  }
});

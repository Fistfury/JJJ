import { MongoClient, Db } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'JJJ'; 

let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  try {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log(`Successfully connected to database: ${dbName}`);
    return db;
  } catch (error) {
    console.error('Failed to connect to the database', error);
    throw error;
  }
};

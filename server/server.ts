import express from 'express';
import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const app = express();
app.get('/', async (req, res) => {
res.send('Hello World');
})

app.listen(3000, async () => {
console.log("Server running on port 3000");
})
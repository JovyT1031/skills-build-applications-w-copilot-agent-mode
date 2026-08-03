import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'octofit-backend' });
});

app.get('/', (_req, res) => {
  res.send('OctoFit Tracker API is running');
});

connectToDatabase();

app.listen(port, () => {
  console.log(`OctoFit backend listening on port ${port}`);
});

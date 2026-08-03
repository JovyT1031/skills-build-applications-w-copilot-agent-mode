import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';
import { User } from './models/user';
import { Team } from './models/team';
import { Activity } from './models/activity';
import { LeaderboardEntry } from './models/leaderboard';
import { Workout } from './models/workout';

dotenv.config();

function getApiBaseUrl() {
  const codespaceName = process.env.CODESPACE_NAME;
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
}

export function createApp() {
  const app = express();

  void connectToDatabase();

  app.use(cors());
  app.use(express.json());

  app.locals.apiBaseUrl = getApiBaseUrl();

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'octofit-backend',
      apiUrl: app.locals.apiBaseUrl,
    });
  });

  app.get(['/api/users', '/api/users/'], async (_req, res) => {
    const users = await User.find({}).lean();
    res.json({
      count: users.length,
      users,
      apiUrl: app.locals.apiBaseUrl,
    });
  });

  app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
    const teams = await Team.find({}).lean();
    res.json({
      count: teams.length,
      teams,
      apiUrl: app.locals.apiBaseUrl,
    });
  });

  app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
    const activities = await Activity.find({}).lean();
    res.json({
      count: activities.length,
      activities,
      apiUrl: app.locals.apiBaseUrl,
    });
  });

  app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
    const leaderboard = await LeaderboardEntry.find({}).lean();
    res.json({
      count: leaderboard.length,
      leaderboard,
      apiUrl: app.locals.apiBaseUrl,
    });
  });

  app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
    const workouts = await Workout.find({}).lean();
    res.json({
      count: workouts.length,
      workouts,
      apiUrl: app.locals.apiBaseUrl,
    });
  });

  app.get('/', (_req, res) => {
    res.send('OctoFit Tracker API is running');
  });

  return app;
}

export function startServer(port = Number(process.env.PORT) || 8000) {
  const app = createApp();

  return app.listen(port, () => {
    console.log(`OctoFit backend listening on port ${port}`);
    console.log(`API base URL: ${app.locals.apiBaseUrl}`);
  });
}

if (require.main === module) {
  startServer();
}

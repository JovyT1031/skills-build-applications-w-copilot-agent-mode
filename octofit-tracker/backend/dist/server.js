"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const user_1 = require("./models/user");
const team_1 = require("./models/team");
const activity_1 = require("./models/activity");
const leaderboard_1 = require("./models/leaderboard");
const workout_1 = require("./models/workout");
dotenv_1.default.config();
function getApiBaseUrl() {
    const codespaceName = process.env.CODESPACE_NAME;
    return codespaceName
        ? `https://${codespaceName}-8000.app.github.dev`
        : 'http://localhost:8000';
}
function createApp() {
    const app = (0, express_1.default)();
    void (0, database_1.connectToDatabase)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.locals.apiBaseUrl = getApiBaseUrl();
    app.get('/api/health', (_req, res) => {
        res.json({
            status: 'ok',
            service: 'octofit-backend',
            apiUrl: app.locals.apiBaseUrl,
        });
    });
    app.get(['/api/users', '/api/users/'], async (_req, res) => {
        const users = await user_1.User.find({}).lean();
        res.json({
            count: users.length,
            users,
            apiUrl: app.locals.apiBaseUrl,
        });
    });
    app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
        const teams = await team_1.Team.find({}).lean();
        res.json({
            count: teams.length,
            teams,
            apiUrl: app.locals.apiBaseUrl,
        });
    });
    app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
        const activities = await activity_1.Activity.find({}).lean();
        res.json({
            count: activities.length,
            activities,
            apiUrl: app.locals.apiBaseUrl,
        });
    });
    app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
        const leaderboard = await leaderboard_1.LeaderboardEntry.find({}).lean();
        res.json({
            count: leaderboard.length,
            leaderboard,
            apiUrl: app.locals.apiBaseUrl,
        });
    });
    app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
        const workouts = await workout_1.Workout.find({}).lean();
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
exports.createApp = createApp;
function startServer(port = Number(process.env.PORT) || 8000) {
    const app = createApp();
    return app.listen(port, () => {
        console.log(`OctoFit backend listening on port ${port}`);
        console.log(`API base URL: ${app.locals.apiBaseUrl}`);
    });
}
exports.startServer = startServer;
if (require.main === module) {
    startServer();
}

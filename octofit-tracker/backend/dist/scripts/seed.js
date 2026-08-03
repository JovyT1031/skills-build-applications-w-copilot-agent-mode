"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../models/user");
const team_1 = require("../models/team");
const activity_1 = require("../models/activity");
const leaderboard_1 = require("../models/leaderboard");
const workout_1 = require("../models/workout");
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Seed the octofit_db database with test data');
        await Promise.all([
            user_1.User.deleteMany({}),
            team_1.Team.deleteMany({}),
            activity_1.Activity.deleteMany({}),
            leaderboard_1.LeaderboardEntry.deleteMany({}),
            workout_1.Workout.deleteMany({}),
        ]);
        const users = await user_1.User.insertMany([
            {
                name: 'Ada Lovelace',
                email: 'ada@example.com',
                username: 'ada',
                fitnessGoal: 'Marathon prep',
                location: 'London',
            },
            {
                name: 'Linus Torvalds',
                email: 'linus@example.com',
                username: 'linus',
                fitnessGoal: 'Strength training',
                location: 'Helsinki',
            },
            {
                name: 'Grace Hopper',
                email: 'grace@example.com',
                username: 'grace',
                fitnessGoal: 'Cycling endurance',
                location: 'Arlington',
            },
        ]);
        await team_1.Team.insertMany([
            {
                name: 'Trailblazers',
                description: 'Weekend hikers and runners',
                members: users.slice(0, 2).map((user) => user.username),
                focus: 'Endurance',
            },
            {
                name: 'Peak Performers',
                description: 'Strength and conditioning crew',
                members: [users[2].username],
                focus: 'Strength',
            },
        ]);
        await activity_1.Activity.insertMany([
            {
                userId: users[0]._id.toString(),
                type: 'run',
                durationMinutes: 35,
                date: '2026-08-01',
                calories: 420,
            },
            {
                userId: users[1]._id.toString(),
                type: 'strength',
                durationMinutes: 50,
                date: '2026-08-02',
                calories: 610,
            },
            {
                userId: users[2]._id.toString(),
                type: 'cycle',
                durationMinutes: 75,
                date: '2026-08-03',
                calories: 780,
            },
        ]);
        await leaderboard_1.LeaderboardEntry.insertMany([
            {
                userId: users[0]._id.toString(),
                name: users[0].name,
                points: 120,
                streak: 4,
            },
            {
                userId: users[1]._id.toString(),
                name: users[1].name,
                points: 98,
                streak: 2,
            },
            {
                userId: users[2]._id.toString(),
                name: users[2].name,
                points: 87,
                streak: 3,
            },
        ]);
        await workout_1.Workout.insertMany([
            {
                title: 'Interval Sprint',
                description: 'High-intensity sprint intervals for speed',
                difficulty: 'medium',
                durationMinutes: 25,
                equipment: ['running shoes'],
            },
            {
                title: 'Core Strength',
                description: 'Full core circuit with bodyweight moves',
                difficulty: 'easy',
                durationMinutes: 20,
                equipment: ['mat'],
            },
            {
                title: 'Hill Cycling',
                description: 'Steady-state climbing workout',
                difficulty: 'hard',
                durationMinutes: 45,
                equipment: ['bike'],
            },
        ]);
        console.log('Database seeding complete');
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
exports.seedDatabase = seedDatabase;
if (require.main === module) {
    seedDatabase();
}

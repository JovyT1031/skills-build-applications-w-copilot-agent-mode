"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
async function connectToDatabase() {
    if (mongoose_1.default.connection.readyState >= 1) {
        return mongoose_1.default.connection;
    }
    try {
        await mongoose_1.default.connect(connectionString, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('Connected to octofit_db');
        return mongoose_1.default.connection;
    }
    catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
}
exports.connectToDatabase = connectToDatabase;
mongoose_1.default.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
exports.default = mongoose_1.default.connection;

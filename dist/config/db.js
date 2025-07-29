"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const env_1 = __importDefault(require("./env"));
const MONGODB_URI = env_1.default.MONGO_URI;
async function connectToDatabase() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        logger_1.default.info('✅ Connected to MongoDB');
    }
    catch (error) {
        logger_1.default.error('❌ Failed to connect to MongoDB');
        console.error(error);
        process.exit(1);
    }
}

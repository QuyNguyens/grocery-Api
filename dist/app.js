"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./utils/logger"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("../src/config/passport");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'https://grocery-ecru.vercel.app',
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('combined', { stream: { write: msg => logger_1.default.info(msg.trim()) } }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', routes_1.default);
app.get('/', (_req, res) => {
    res.json({ message: 'API is running' });
});
app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});
exports.default = app;

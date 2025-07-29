"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
class UserRepository {
    constructor() {
        this.createUser = (data) => {
            return user_model_1.default.create(data);
        };
    }
    findUserByEmail(email) {
        return user_model_1.default.findOne({ email });
    }
}
exports.default = new UserRepository();

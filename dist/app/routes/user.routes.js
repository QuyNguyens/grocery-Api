"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_validator_1 = require("../validators/auth.validator");
const validateRequest_1 = require("../middlewares/validateRequest");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = express_1.default.Router();
router.post('/signup', (0, validateRequest_1.validateRequest)(auth_validator_1.signupSchema), user_controller_1.default.signup);
router.post('/login', (0, validateRequest_1.validateRequest)(auth_validator_1.loginSchema), user_controller_1.default.login);
router.post('/refresh-token', user_controller_1.default.refresh);
exports.default = router;

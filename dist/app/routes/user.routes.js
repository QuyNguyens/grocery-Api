"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_validator_1 = require("../validators/auth.validator");
const validateRequest_1 = require("../middlewares/validateRequest");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../../utils/auth");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.post('/signup', (0, validateRequest_1.validateRequest)(auth_validator_1.signupSchema), user_controller_1.default.signup);
router.post('/login', (0, validateRequest_1.validateRequest)(auth_validator_1.loginSchema), user_controller_1.default.login);
router.post('/refresh-token', user_controller_1.default.refresh);
router.post('/update', auth_1.verifyToken, upload.single('avatar'), user_controller_1.default.update);
exports.default = router;

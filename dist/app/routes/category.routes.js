"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_validator_1 = require("../validators/category.validator");
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middlewares/validateRequest");
const categories_controller_1 = __importDefault(require("../controllers/categories.controller"));
const auth_1 = require("../../utils/auth");
const router = express_1.default.Router();
router.get('', categories_controller_1.default.get);
router.post('/create', auth_1.verifyToken, (0, validateRequest_1.validateRequest)(category_validator_1.categorySchema), categories_controller_1.default.create);
router.post('/create-all', auth_1.verifyToken, categories_controller_1.default.createAll);
exports.default = router;

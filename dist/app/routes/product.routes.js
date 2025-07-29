"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middlewares/validateRequest");
const product_validator_1 = require("../validators/product.validator");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const router = express_1.default.Router();
router.get('/our-store', product_controller_1.default.getProducts);
router.get('/categories', product_controller_1.default.getProductsByCategoryName);
router.get('/special', product_controller_1.default.getSpecialProducts);
router.get('/top-deal', product_controller_1.default.getTopDealProducts);
router.get('/best-selling', product_controller_1.default.getBestSellingProducts);
router.post('/create', (0, validateRequest_1.validateRequest)(product_validator_1.productSchema), product_controller_1.default.create);
exports.default = router;

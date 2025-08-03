"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middlewares/validateRequest");
const productVariant_validator_1 = require("../validators/productVariant.validator");
const productVariant_controller_1 = __importDefault(require("../controllers/productVariant.controller"));
const auth_1 = require("../../utils/auth");
const router = express_1.default.Router();
router.get('', productVariant_controller_1.default.getByProductId);
router.post('/create', auth_1.verifyToken, (0, validateRequest_1.validateRequest)(productVariant_validator_1.productVariantSchema), productVariant_controller_1.default.create);
exports.default = router;

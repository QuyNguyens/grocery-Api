"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productAttribute_controller_1 = __importDefault(require("../controllers/productAttribute.controller"));
const validateRequest_1 = require("../middlewares/validateRequest");
const productAttribute_validator_1 = require("../validators/productAttribute.validator");
const router = express_1.default.Router();
router.post('/create-attribute', (0, validateRequest_1.validateRequest)(productAttribute_validator_1.productAttributeSchema), productAttribute_controller_1.default.createAttribute);
router.post('/create-attribute-value', (0, validateRequest_1.validateRequest)(productAttribute_validator_1.productAttributeValueSchema), productAttribute_controller_1.default.createAttributeValue);
exports.default = router;

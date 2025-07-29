"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = __importDefault(require("../controllers/cart.controller"));
const validateRequest_1 = require("../middlewares/validateRequest");
const cart_validator_1 = require("../validators/cart.validator");
const router = express_1.default.Router();
router.post('/create', cart_controller_1.default.create);
router.put('/update', cart_controller_1.default.updateCartItem);
router.get('/items', cart_controller_1.default.get);
router.post('/add-cart-item', (0, validateRequest_1.validateRequest)(cart_validator_1.cartSchema), cart_controller_1.default.addCartItem);
router.delete('/delete', cart_controller_1.default.deleteCartItem);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const auth_1 = require("../../utils/auth");
const router = (0, express_1.Router)();
router.get('/order-detail', order_controller_1.default.getOrderDetail);
router.get('', auth_1.verifyToken, order_controller_1.default.getOrders);
exports.default = router;

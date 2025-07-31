"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vnpay_1 = require("vnpay");
const response_1 = require("../../utils/response");
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const objectIdValidator_1 = require("../helpers/objectIdValidator");
const ObjectIdConvert_1 = require("../helpers/convert/ObjectIdConvert");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const env_1 = __importDefault(require("../../config/env"));
const router = express_1.default.Router();
function createVNPayInstance() {
    return new vnpay_1.VNPay({
        tmnCode: env_1.default.VNPAY_TMN_CODE,
        secureSecret: env_1.default.VNPAY_SECURE_SECRET,
        vnpayHost: env_1.default.VNPAY_HOST,
        testMode: true,
        hashAlgorithm: vnpay_1.HashAlgorithm.SHA512,
        loggerFn: vnpay_1.ignoreLogger,
    });
}
router.post('/create-qr', async (req, res) => {
    const { userId, totalPrice, items, address } = req.body;
    if (!(0, objectIdValidator_1.ObjectValidator)(userId)) {
        return (0, response_1.error)(res, 400, 'invalid userId');
    }
    const uId = (0, ObjectIdConvert_1.ObjectIdConvert)(userId?.toString() || '');
    const order = {
        userId: uId,
        status: 'pending',
        totalAmount: totalPrice,
        paymentMethod: 'CreditCard',
    };
    const orderId = await order_controller_1.default.createOrder(order);
    if (!orderId)
        return (0, response_1.error)(res, 400, 'Tạo order thất bại');
    await user_controller_1.default.pushAddress(uId, address);
    await order_controller_1.default.createOrderDetail(orderId, items);
    const vnpay = createVNPayInstance();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '';
    if (ip === '::1' || ip === '::ffff:127.0.0.1')
        ip = '127.0.0.1';
    const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: totalPrice * 26000,
        vnp_IpAddr: ip,
        vnp_TxnRef: `ORDER_${Date.now()}`,
        vnp_OrderType: vnpay_1.ProductCode.Other,
        vnp_ReturnUrl: `${process.env.APP_URL}/api/vnpay/check-payment-vnpay`,
        vnp_OrderInfo: orderId.toString(),
        vnp_Locale: vnpay_1.VnpLocale.VN,
        vnp_CreateDate: (0, vnpay_1.dateFormat)(new Date()),
        vnp_ExpireDate: (0, vnpay_1.dateFormat)(tomorrow),
    });
    return (0, response_1.success)(res, 201, 'vnpay success', vnpayResponse);
});
router.get('/check-payment-vnpay', async (req, res) => {
    let verify;
    const vnpay = createVNPayInstance();
    const query = req.query;
    try {
        verify = vnpay.verifyReturnUrl(query);
        if (!verify.isVerified) {
            return res.send('Data integrity verification failed');
        }
        if (!verify.isSuccess) {
            return res.send('Payment order failed');
        }
    }
    catch (error) {
        return res.send('Invalid data');
    }
    const orderId = query['vnp_OrderInfo'];
    const oId = (0, ObjectIdConvert_1.ObjectIdConvert)(orderId || '');
    await order_controller_1.default.updateStatusOrder(oId, 'paid');
    res.redirect(`${env_1.default.SCHEMA_FE_URL}/order/order-status?status=${verify.vnp_ResponseCode}&orderId=${orderId}`);
});
exports.default = router;

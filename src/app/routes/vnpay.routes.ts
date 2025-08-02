import express, { Request, Response } from 'express';
import {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
  HashAlgorithm,
  VerifyReturnUrl,
  ReturnQueryFromVNPay,
} from 'vnpay';
import { error, success } from '../../utils/response';
import orderController from '../controllers/order.controller';
import { IOrder } from '../../types/order';
import { ObjectValidator } from '../helpers/objectIdValidator';
import { ObjectIdConvert } from '../helpers/convert/ObjectIdConvert';
import userController from '../controllers/user.controller';
import env from '../../config/env';
import { verifyToken } from '../../utils/auth';

const router = express.Router();

function createVNPayInstance() {
  return new VNPay({
    tmnCode: env.VNPAY_TMN_CODE,
    secureSecret: env.VNPAY_SECURE_SECRET,
    vnpayHost: env.VNPAY_HOST,
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    loggerFn: ignoreLogger,
  });
}

router.post('/create-qr', verifyToken, async (req: Request, res: Response) => {
  const { userId, totalPrice, items, address } = req.body;
  if (!ObjectValidator(userId)) {
    return error(res, 400, 'invalid userId');
  }
  const uId = ObjectIdConvert(userId?.toString() || '');
  const order: IOrder = {
    userId: uId,
    status: 'pending',
    totalAmount: totalPrice,
    paymentMethod: 'CreditCard',
  };
  const orderId = await orderController.createOrder(order);
  if (!orderId) return error(res, 400, 'Tạo order thất bại');
  await userController.pushAddress(uId, address);
  await orderController.createOrderDetail(orderId, items);

  const vnpay = createVNPayInstance();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  let ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '';
  if (ip === '::1' || ip === '::ffff:127.0.0.1') ip = '127.0.0.1';

  const vnpayResponse = await vnpay.buildPaymentUrl({
    vnp_Amount: totalPrice * 26000,
    vnp_IpAddr: ip,
    vnp_TxnRef: `ORDER_${Date.now()}`,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: `${process.env.APP_URL}/api/vnpay/check-payment-vnpay`,
    vnp_OrderInfo: orderId.toString(),
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(tomorrow),
  });

  return success(res, 201, 'vnpay success', vnpayResponse);
});

router.get('/check-payment-vnpay', async (req: Request, res: Response) => {
  let verify: VerifyReturnUrl;
  const vnpay = createVNPayInstance();
  const query = req.query;
  try {
    verify = vnpay.verifyReturnUrl(query as ReturnQueryFromVNPay);
    if (!verify.isVerified) {
      return res.send('Data integrity verification failed');
    }
    if (!verify.isSuccess) {
      return res.send('Payment order failed');
    }
  } catch (error) {
    return res.send('Invalid data');
  }
  const orderId = query['vnp_OrderInfo'] as string;
  const oId = ObjectIdConvert(orderId || '');
  await orderController.updateStatusOrder(oId, 'paid');

  res.redirect(
    `${env.SCHEMA_FE_URL}/order/order-status?status=${verify.vnp_ResponseCode}&orderId=${orderId}`,
  );
});

export default router;

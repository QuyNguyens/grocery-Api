import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.send('Danh sách order');
});

router.post('/', (_req, res) => {
  res.send('Tạo đơn hàng');
});

export default router;

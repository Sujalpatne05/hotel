import { Router } from 'express';
import { query } from '../db.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = Router();

router.get('/orders', authenticate, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM orders WHERE restaurant_id=$1 ORDER BY created_at DESC`,
      [req.user.restaurantId]
    );
    res.json(rows.map(o => ({
      ...o,
      items: Array.isArray(o.items) ? o.items : [],
      orderType: o.order_type,
      paymentStatus: o.payment_status,
      paymentMethod: o.payment_method,
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/orders/table/:num', authenticate, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT * FROM orders WHERE restaurant_id=$1 AND table_number=$2 AND payment_status='unpaid' ORDER BY created_at DESC LIMIT 1`,
      [req.user.restaurantId, Number(req.params.num)]
    );
    if (!rows[0]) return res.status(404).json({ error: 'No active order for this table' });
    const o = rows[0];
    res.json({
      ...o,
      items: Array.isArray(o.items) ? o.items : [],
      orderType: o.order_type,
      paymentStatus: o.payment_status,
      paymentMethod: o.payment_method,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/orders', authenticate, async (req, res) => {
  try {
    const { items, total, table_number, orderType, paymentMethod, userId } = req.body;
    if (!items || !total) return res.status(400).json({ error: 'items and total required' });

    const orderNum = `ORD-${Date.now()}`;
    const payStatus = (orderType === 'delivery' || orderType === 'take-away') ? 'paid' : 'unpaid';
    const orderStatus = 'pending'; // Always start as pending - kitchen needs to prepare

    const { rows } = await query(
      `INSERT INTO orders (restaurant_id, user_id, order_number, table_number, items, total, status, order_type, payment_status, payment_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.user.restaurantId, userId || req.user.id, orderNum, table_number || null, JSON.stringify(items), Number(total), orderStatus, orderType || 'dine-in', payStatus, paymentMethod || null]
    );
    res.status(201).json({ ...rows[0], items: rows[0].items });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/orders/:id', authenticate, async (req, res) => {
  try {
    const { items, total, status, paymentStatus, paymentMethod } = req.body;
    const { rows } = await query(
      `UPDATE orders SET
        items=COALESCE($1::jsonb, items),
        total=COALESCE($2, total),
        status=COALESCE($3, status),
        payment_status=COALESCE($4, payment_status),
        payment_method=COALESCE($5, payment_method),
        updated_at=NOW()
       WHERE id=$6 AND restaurant_id=$7 RETURNING *`,
      [items ? JSON.stringify(items) : null, total ? Number(total) : null, status || null, paymentStatus || null, paymentMethod || null, req.params.id, req.user.restaurantId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json({ ...rows[0], items: Array.isArray(rows[0].items) ? rows[0].items : [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/orders/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status required' });
    const { rows } = await query(
      `UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 AND restaurant_id=$3 RETURNING *`,
      [status, req.params.id, req.user.restaurantId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
